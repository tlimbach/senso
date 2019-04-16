function Light(controller, paper, x, y, radius, rotation, colorOn, colorOff) {
    this.controller = controller;

    this.colorOn = colorOn;
    this.colorOff = colorOff;
    var path = "m" + x + " " + y;
    path += " c" + (radius / 2) + ",0";
    path += " " + radius + "," + (radius / 2);
    path += " " + radius + "," + radius + " ";

    this.lamp = paper.path(path).rotate(rotation);

    var strokeWidth = radius / 1.5;

    this.lamp.attr({
        stroke: this.colorOff,
        'stroke-width': strokeWidth,
        'opacity': '0.8',
        cursor: 'pointer'
    });

    this.lamp.click(
            function () {
                this.on();
                setTimeout(this.off.bind(this), 300);
                controller.setClicked(this);
            }.bind(this));
}

Light.prototype.on = function () {
    this.lamp.attr({
        stroke: this.colorOn
    });
}

Light.prototype.off = function () {
    this.lamp.attr({
        stroke: this.colorOff
    });
}

function Device(controller) {
    this.controller = controller;
}

Device.prototype.init = function (paper) {

 paper.circle(500, 500, 450).attr({fill: 'url("img/plastik.png")'});

       
    paper.circle(500, 500, 200).attr({fill: 'url("img/metall.png")'});

    var radiusLight = 290;
    this.lights = [];
    this.lights.push(new Light(this.controller, paper, 530, 180, radiusLight, 0, 'RoyalBlue', 'DarkBlue'));
    this.lights.push(new Light(this.controller, paper, 530, 530, radiusLight, 90, 'LightGreen', 'DarkGreen'));
    this.lights.push(new Light(this.controller, paper, 180, 530, radiusLight, 180, 'red', 'DarkRed'));
    this.lights.push(new Light(this.controller, paper, 180, 180, radiusLight, 270, 'yellow', 'GoldenRod'));

    this.roundnumber = paper.text(500, 500, "");

    this.gameOver = paper.text(500, 490, "GAME OVER");
    this.restart = paper.text(500, 550, "restart");

    this.st = paper.set();
    this.st.push(this.gameOver, this.restart);

    this.gameOver.attr({
        'font-size': '64px',
        'x': '-1000px'
    });

    this.restart.attr({
        'font-size': '58px',
        'x': '-1000px'
    });

    this.start = paper.text(500, 500, "Start");
    this.start.attr({
        'font-size': '104px'
    });


    this.start.attr({
        'font-size': '104px'
    });

    this.start.click(
            function () {
                this.controller.startGame();
            }.bind(this));

    this.st.click(
            function () {
                this.controller.startGame();
            }.bind(this));

};


Device.prototype.getLights = function () {
    return this.lights;
}

Device.prototype.shine = function (light, delay, duration) {
    setTimeout(light.on.bind(light), delay);
    setTimeout(light.off.bind(light), (delay + duration));
};

Device.prototype.setStartEnabled = function (enabled) {
    var x = enabled ? 500 : -1000;
    this.start.attr({"x": x});
}

Device.prototype.setGameoverEnabled = function (enabled) {
    var x = enabled ? 500 : -1000;
    this.st.attr({"x": x});
}

Device.prototype.setRoundnumber = function (number) {
    this.roundnumber.attr({
        'text': number,
        'font-size': '124px',
        'stroke-width' : '10px'
    });
}


function Controller() {
}

Controller.prototype.init = function () {
    window.addEventListener('resize', function () {
        var paperSize = getAvailableSize();
        paper.setSize(paperSize, paperSize);
    });

    var paperSize = getAvailableSize();
    var paper = Raphael(document.getElementById('device'), paperSize, paperSize);
    paper.rect(0, 0, 1000, 1000).attr({fill: 'url("img/sand.png")'});
    paper.setViewBox(0, 0, 1000, 1000);
    this.device = new Device(this);
    this.device.init(paper, paperSize);
    this.lights = this.device.getLights();
};

Controller.prototype.getRandomLight = function () {
    var x = Math.floor((Math.random() * 4));
    return this.lights[x];
}

Controller.prototype.startGame = function () {
    this.order = [];
    this.device.setStartEnabled(false);
    this.device.setGameoverEnabled(false);
    this.runNextLevel();
}

Controller.prototype.runNextLevel = function () {
    this.order.push(this.getRandomLight());

    this.orderToCheck = 'undefined';

    this.device.setRoundnumber(this.order.length);

    var that = this;
    setTimeout(function () {
        that.play(that.order, 1000, 500);
    }, 500);
}

Controller.prototype.checkUserInput = function (order) {
    this.orderToCheck = order;
    this.userClickCount = -1;
}

Controller.prototype.setClicked = function (light) {
    this.userClickCount++;

    if (this.orderToCheck !== 'undefined') {

        if (light !== this.orderToCheck[this.userClickCount]) {

            this.order = [];
            this.orderToCheck = 'undefined';

            var that = this;
            setTimeout(function () {
                that.device.setGameoverEnabled(true);
                that.device.setRoundnumber("");
            }, 1000);
            return;
        }

        if (this.userClickCount === this.orderToCheck.length - 1)
            setTimeout(this.runNextLevel.bind(this), 2000);

    }
}

Controller.prototype.play = function (lights, delay, duration) {
    for (t = 0; t < lights.length; t++) {
        var light = lights[t];
        var currentDelay = delay * t;
        console.log("cd:" + currentDelay + "/" + duration);
        this.device.shine(light, currentDelay, duration);
    }

    var totalDelayForPlay = lights.length * delay;
    setTimeout(this.checkUserInput.bind(this, lights), totalDelayForPlay);
};


$(document).ready(function () {
    new Controller().init();
});

function getAvailableSize() {
    var availableWidth = window.innerWidth;
    var availableHeight = window.innerHeight;
    return Math.min(availableWidth, availableHeight);
}
