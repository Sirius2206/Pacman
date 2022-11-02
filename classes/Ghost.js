const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

export default class Ghost {
    static colors = ['red', 'green', 'blue', 'pink', 'purple', 'lightblue'];
    static speed = 2;
    static colorIndex = 0;
    constructor({ position, velocity }) {
        this.initPosition = position;
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = Ghost.colors[Ghost.colorIndex++ % Ghost.colors.length];
        this.pathways = ['up', 'down', 'left', 'right'];
        this.scared = false;
        this.scaredTimer = null;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.scared ? 'gray' : this.color;
        c.fill();
        c.closePath();
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw();
    }
}