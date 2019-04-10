
var paper;

function Light(name, x, y, colorOn, colorOff) {
    this.state = "off";
    this.colorOn = colorOn;
    this.colorOff = colorOff;
    this.name = name;
    log("name -> " + name);
    this.circle = paper.circle(x, y, 100);
    this.circle.attr({
        fill: this.colorOff,
        cursor: 'pointer'
    });

    this.circle.click(this.toggle.bind(this));
}

Light.prototype.toggle = function () {
    this.state === "off" ? this.state = "on" : this.state = "off";
    this.state === "off" ? this.off.bind(this)() : this.on.bind(this)();
}

Light.prototype.on = function () {
    log(this.name + " turned on");
    this.circle.attr({
        fill: this.colorOn,
        cursor: 'pointer'
    });
}

Light.prototype.off = function () {
    log(this.name + " turned off");
    this.circle.attr({
        fill: this.colorOff,
        cursor: 'pointer'
    });
}

function Device() {
}

Device.prototype.init = function () {
    this.circle = paper.circle(300, 300, 300);
    this.circle.attr({
        fill: 'gray'
    });

    this.greenlight = new Light("Greenlight", 200, 200, 'green', 'white');
    this.redlight = new Light("Redlight", 400, 200, 'red', 'white');
    this.yellowlight = new Light("Yellowlight", 200, 400, 'yellow', 'white');
    this.bluelight = new Light("Bluelight", 400, 400, 'blue', 'white');
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