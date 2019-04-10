
var paper;

function Light(name, x, y, colorOn, colorOff) {
    this.name = name;
    log("name -> " + name);
    this.circle = paper.circle(x, y, 100);
    this.circle.attr({
        fill: colorOn,
        cursor: 'pointer'
    });

    this.circle.click((function () {
        this.on();
    }).bind(this));
}

Light.prototype.on = function () {
    log(this.name + " turned on");
}

Light.prototype.off = function () {
    log(this.name + " turned off");
}

function Device() {
}

Device.prototype.init = function () {
    this.circle = paper.circle(300, 300, 300);
    this.circle.attr({
        fill: 'gray'
    });

    this.greenlight = new Light("Greenlight", 200, 200, 'green');
    this.redlight = new Light("Redlight", 400, 200, 'red');
    this.yellowlight = new Light("Yellowlight", 200, 400, 'yellow');
    this.bluelight = new Light("Bluelight", 400, 400, 'blue');
};

$(document).ready(function () {
    paper = Raphael(document.getElementById('device'), 600, 600);
    new Device().init();
});

function msgBox(text) {
    return function () {
//        log("msgBox -> text");
        alert(text);
    };
}

function log(text) {
    console.log(text);
}