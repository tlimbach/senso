function Light(controller, paper, name, x, y, radius, rotation, colorOn, colorOff) {
    this.controller = controller;

    console.log("ctrL =" + controller);

    this.state = "off";
    this.colorOn = colorOn;
    this.colorOff = colorOff;
    this.name = name;
    var path = "m" + x + " " + y;
    path += " c" + (radius / 2) + ",0";
    path += " " + radius + "," + (radius / 2);
    path += " " + radius + "," + radius + " ";

    console.log(path);

    this.lamp = paper.path(path).rotate(rotation);

    var strokeWidth = radius / 1.5;

    this.lamp.attr({
        stroke: this.colorOff,
        'stroke-width': strokeWidth,
        cursor: 'pointer'
    });

//    this.lamp.click(this.toggle.bind(this));
    this.lamp.click(
            function () {
                this.on();
                setTimeout(this.off.bind(this), 300);
                controller.setClicked(this);
            }.bind(this));
}

Light.prototype.toggle = function () {
    this.state === "off" ? this.state = "on" : this.state = "off";
    this.state === "off" ? this.off.bind(this)() : this.on.bind(this)();
}

Light.prototype.on = function () {
    log(this.name + " turned on");
    this.lamp.attr({
        stroke: this.colorOn
    });
}

Light.prototype.off = function () {
    log(this.name + " turned off");
    this.lamp.attr({
        stroke: this.colorOff,
    });
}

Light.prototype.getName = function () {
    return this.name;
}

function Device(controller) {
    this.controller = controller;
}

Device.prototype.init = function (paper) {
    this.userInput = true;

    paper.circle(500, 500, 450).attr({fill: 'gray'});
    paper.circle(500, 500, 200).attr({fill: 'WhiteSmoke'});

    var radiusLight = 290;
    this.bluelight = new Light(this.controller, paper, "Bluelight", 530, 180, radiusLight, 0, 'RoyalBlue', 'DarkBlue');
    this.greenlight = new Light(this.controller, paper, "Greenlight", 530, 530, radiusLight, 90, 'LightGreen', 'DarkGreen');
    this.redLight = new Light(this.controller, paper, "Redlight", 180, 530, radiusLight, 180, 'red', 'DarkRed');
    this.yellowLight = new Light(this.controller, paper, "Yellowlight", 180, 180, radiusLight, 270, 'yellow', 'GoldenRod');
};

Device.prototype.shineYellow = function (delay, duration) {
    setTimeout(this.yellowLight.on.bind(this.yellowLight), delay);
    setTimeout(this.yellowLight.off.bind(this.yellowLight), (delay + duration));
};
Device.prototype.shineBlue = function (delay, duration) {
    setTimeout(this.bluelight.on.bind(this.bluelight), delay);
    setTimeout(this.bluelight.off.bind(this.bluelight), (delay + duration));
};
Device.prototype.shineGreen = function (delay, duration) {
    setTimeout(this.greenlight.on.bind(this.greenlight), delay);
    setTimeout(this.greenlight.off.bind(this.greenlight), (delay + duration));
};
Device.prototype.shineRed = function (delay, duration) {
    setTimeout(this.redLight.on.bind(this.redLight), delay);
    setTimeout(this.redLight.off.bind(this.redLight), (delay + duration));
};

Device.prototype.enableUserInput = function (userInput) {
    this.userInput = userInput;
}


$(document).ready(function () {
    new Controller().init();
});

function getAvailableSize() {
    var availableWidth = window.innerWidth;
    var availableHeight = window.innerHeight;
    return Math.min(availableWidth, availableHeight);
}

function msgBox(text) {
    return function () {
        alert(text);
    };
}

function log(text) {
    console.log(text);
}

function Controller() {
}

Controller.prototype.init = function () {

    this.round = 1;

    window.addEventListener('resize', function () {
        var paperSize = getAvailableSize();
        paper.setSize(paperSize, paperSize);
    });

    var paperSize = getAvailableSize();
    var paper = Raphael(document.getElementById('device'), paperSize, paperSize);
    paper.rect(0, 0, 1000, 1000).attr({fill: 'Snow'});
    paper.setViewBox(0, 0, 1000, 1000);
    this.device = new Device(this);
    this.device.init(paper, paperSize);
    this.order = 'undefined';
    this.runLevel();
};

Controller.prototype.getRandomColor = function () {
    var x = Math.floor((Math.random() * 4) + 1);

    if (x === 1)
        return 'y';

    if (x === 2)
        return 'b';

    if (x === 3)
        return 'g';

    if (x === 4)
        return 'r';

}

Controller.prototype.runLevel = function () {
    var delay = 1000;
    var duration = 500;

    if (this.order === 'undefined') {
        this.order = [];
    }

    var colorChar = this.getRandomColor();
    console.log("rand Char Color: " + colorChar);

    this.order.push(colorChar);

    console.log("order = " + this.order);
    this.orderToCheck = 'undefined';
    this.play(this.order, delay, duration);
}

Controller.prototype.checkUserInput = function (order) {
    this.device.enableUserInput(true);  //TODO: Eingaben auch tatsächlich verhindern, wenn disabled

    console.log("check order: " + order);
    this.orderToCheck = order;
    this.userClickCount = -1;
}

Controller.prototype.setClicked = function (light) {
    this.userClickCount++;
    console.log("controller got clickinfo: " + light.getName());
    console.log("orderToCheck= " + this.orderToCheck);

    var gameOver = false;

    if (this.orderToCheck !== 'undefined') {

        firstChar = light.getName().toLowerCase()[0];
        if (firstChar === this.orderToCheck[this.userClickCount]) {
            console.log("ok");
        } else {
            console.log("failed!!");
            gameOver = true;
        }

        if (gameOver) {
            var count = this.orderToCheck.length - 1;
            
            console.log("ordertocheck bei gameover " + this.orderToCheck);
            
            this.order = 'undefined';
            this.orderToCheck = 'undefined';

            var that = this;
            setTimeout(function () {
                alert("Game Over! Rounds: " + count);
                setTimeout(that.runLevel.bind(that), 4000);
            }, 1000);
            return;
        }

        if (this.userClickCount === this.orderToCheck.length - 1)
            setTimeout(this.runLevel.bind(this), 2000);

    }
}

Controller.prototype.play = function (order, delay, duration) {
    this.device.enableUserInput(false);
    console.log("duration" + duration);
    for (t = 0; t < order.length; t++) {
        var o = order[t];
        var currentDelay = delay * t;

        console.log("cd:" + currentDelay + "/" + duration);

        if (o === 'y')
            this.device.shineYellow(currentDelay, duration);

        if (o === 'b')
            this.device.shineBlue(currentDelay, duration);

        if (o === 'r')
            this.device.shineRed(currentDelay, duration);

        if (o === 'g')
            this.device.shineGreen(currentDelay, duration);

    }

    var totalDelayForPlay = order.length * delay;

    setTimeout(this.checkUserInput.bind(this, order), totalDelayForPlay);
};