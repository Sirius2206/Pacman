const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

export default class Pellet {
    constructor({ position }) {
        this.position = position;
        this.radius = 2;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}