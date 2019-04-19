"use strict";
function Light(controller, paper, x, y, radius, rotation, colorOn, colorOff, hz) {
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

    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.hz = hz;
}

Light.prototype.sound = function () {
    var osc = this.context.createOscillator(); // instantiate an oscillator
    osc.type = 'triangle'; // this is the default - also square, sawtooth, triangle
    osc.frequency.value = this.hz; // Hz
    osc.connect(this.context.destination); // connect it to the destination
    osc.start(); // start the oscillator
    osc.stop(this.context.currentTime + 0.5); // stop 2 seconds after the current time
}

Light.prototype.testSound = function () {
    var osc = this.context.createOscillator(); // instantiate an oscillator
    osc.type = 'triangle'; // this is the default - also square, sawtooth, triangle
    osc.frequency.value = this.hz; // Hz
    osc.connect(this.context.destination); // connect it to the destination
    osc.start(); // start the oscillator
    osc.stop(this.context.currentTime); // stop 2 seconds after the current time
}

Light.prototype.on = function () {
    this.sound();
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
    this.lights.push(new Light(this.controller, paper, 530, 180, radiusLight, 0, 'RoyalBlue', 'DarkBlue', 493));
    this.lights.push(new Light(this.controller, paper, 530, 530, radiusLight, 90, 'LightGreen', 'DarkGreen', 440));
    this.lights.push(new Light(this.controller, paper, 180, 530, radiusLight, 180, 'red', 'DarkRed', 391));
    this.lights.push(new Light(this.controller, paper, 180, 180, radiusLight, 270, 'yellow', 'GoldenRod', 349));

    this.roundnumber = paper.text(500, 500, "");

    this.st = paper.set();

    var w = 500;
    var gameOverRect = paper.rect(500 - (w / 2), 340, w, 300).attr({
        'fill': 'gray'
    });
    this.gameOver = paper.text(500, 490, "GAME OVER");
    this.st.push(this.gameOver, this.restart, gameOverRect);

    this.gameOver.attr({
        'font-size': '64px',
    });

    this.st.attr({
        'opacity': '0'
    });

    this.start = paper.text(500, 500, "Start");
    this.start.attr({
        'font-size': '104px',
        cursor: 'pointer'
    });


    this.start.attr({
        'font-size': '104px'
    });

    this.start.click(
            function () {
                for (var t = 0; t < this.lights.length; t++) {
                    var light = this.lights[t];
                    light.testSound();
                }
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

Device.prototype.setGameoverEnabled = function (enabled, score) {
    var x = enabled ? 1 : 0;
    var text = enabled ? 'Game Over\nScore: ' + score : "";
    this.st.attr({'opacity': x});
    this.gameOver.attr({
        'text': text
    });

    if (enabled) {
        setTimeout(function () {
            this.setGameoverEnabled(false);
            this.setStartEnabled(true);
        }.bind(this), 2500);
    }
}

Device.prototype.setRoundnumber = function (number) {
    this.roundnumber.attr({
        'text': number,
        'font-size': '124px',
        'stroke-width': '10px'
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
    paper.setViewBox(0, 0, 1000, 1000);
    this.device = new Device(this);
    this.device.init(paper, paperSize);
    this.lights = this.device.getLights();
    this.order = [];
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

    this.orderToCheck = [];

    var roundNumber = this.order.length;

    this.device.setRoundnumber(roundNumber);
    var delay = 1000;
    var duration = 500;

    if (roundNumber >= 5) {
        delay = 800;
        duration = 400;
    }

    if (roundNumber >= 10) {
        delay = 600;
        duration = 300;
    }

    var that = this;
    setTimeout(function () {
        that.play(that.order, delay, duration);
    }, 500);
}

Controller.prototype.checkUserInput = function (order) {
    this.orderToCheck = order;
    this.userClickCount = -1;
}

Controller.prototype.isGameActive = function () {
    return this.order.length > 0;
}

Controller.prototype.setClicked = function (light) {

    if (this.isGameActive()) {
        this.userClickCount++;
        if (light !== this.orderToCheck[this.userClickCount]) {

            var score = this.order.length - 1;

            this.order = [];
            this.orderToCheck = [];

            var that = this;
            setTimeout(function () {
                that.device.setGameoverEnabled(true, score);
                that.device.setRoundnumber("");
            }, 1000);
            return;
        }

        if (this.userClickCount === this.orderToCheck.length - 1)
            setTimeout(this.runNextLevel.bind(this), 2000);

    }
}

Controller.prototype.play = function (lights, delay, duration) {
    for (var t = 0; t < lights.length; t++) {
        var light = lights[t];
        var currentDelay = delay * t;
        this.device.shine(light, currentDelay, duration);
    }

    var totalDelayForPlay = (lights.length - 1) * delay;
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


