function Light(paper, name, x, y, radius, rotation, colorOn, colorOff) {
    this.state = "off";
    this.colorOn = colorOn;
    this.colorOff = colorOff;
    this.name = name;
    log("name -> " + name);
    var path = "m" + x + " " + y;
    path += " c" + (radius / 2) + ",0";
    path += " " + radius + "," + (radius / 2);
    path += " " + radius + "," + radius + " ";

    console.log(path);

    this.lamp = paper.path(path);

    this.lamp.rotate(rotation);

    var strokeWidth = radius / 1.5;

    this.lamp.attr({
        stroke: this.colorOff,
        'stroke-width': strokeWidth,
        cursor: 'pointer'
    });

    this.lamp.click(this.toggle.bind(this));
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

function Device() {
}

Device.prototype.init = function (paper) {
    
   
    var radius = boxSize / 3;

    paper.circle(boxSize / 2, boxSize / 2, boxSize / 2).attr({fill: 'gray'});
    paper.circle(boxSize / 2, boxSize / 2, boxSize / 5).attr({fill: 'WhiteSmoke'});

    // Naja, so ungefähr. 
    var xOff = 20;
    var yOff = 20;

    this.bluelight = new Light(paper, "Bluelight", 400 + xOff, 100 + yOff, radius, 0, 'RoyalBlue', 'DarkBlue');
    this.greenlight = new Light(paper, "Greenlight", 400 + xOff, 400 + yOff, radius, 90, 'LightGreen', 'DarkGreen');
    this.redLight = new Light(paper, "Redlight", 100 + xOff, 400 + yOff, radius, 180, 'red', 'DarkRed');
    this.yellowLight = new Light(paper, "Yellowlight", 100 + xOff, 100 + yOff, radius, 270, 'yellow', 'GoldenRod');
};


var boxSize = 800;


$(document).ready(function () {
     var paper = Raphael(document.getElementById('device'), boxSize, boxSize);
    new Device().init(paper);
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