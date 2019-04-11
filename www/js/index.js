function Light(paper, name, x, y, radius, rotation, colorOn, colorOff) {
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

    paper.circle(500, 500, 450).attr({fill: 'gray'});
    paper.circle(500, 500, 200).attr({fill: 'WhiteSmoke'});

    var radiusLight = 290;
    this.bluelight = new Light(paper, "Bluelight", 530, 180, radiusLight, 0, 'RoyalBlue', 'DarkBlue');
    this.greenlight = new Light(paper, "Greenlight", 530, 530, radiusLight, 90, 'LightGreen', 'DarkGreen');
    this.redLight = new Light(paper, "Redlight", 180, 530, radiusLight, 180, 'red', 'DarkRed');
    this.yellowLight = new Light(paper, "Yellowlight", 180,180, radiusLight, 270, 'yellow', 'GoldenRod');
};

$(document).ready(function () {
    
    window.addEventListener('resize', function() {
        var paperSize = getAvailableSize();
        paper.setSize(paperSize, paperSize);
    });
    
    var paperSize = getAvailableSize();
    var paper = Raphael(document.getElementById('device'), paperSize, paperSize);
    paper.rect(0, 0, 1000, 1000).attr({fill: 'Snow'});
    paper.setViewBox(0, 0, 1000, 1000);
    new Device().init(paper, paperSize);
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