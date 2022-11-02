"use strict"
import Player from "./classes/Player.js";
import Ghost from "./classes/Ghost.js";
import Boundary from "./classes/Boundary.js";
import Pellet from "./classes/Pellet.js";
import PowerUp from "./classes/PowerUp.js";

const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreElem = document.getElementById("score");

let player;
const pellets = [];
const powerups =[];

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let keysPressed = [];

const boundaries = [];
const ghosts = [];

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', 'p', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'g', '.', '.', '.', '.', '.', 'u', '|'],
    ['|', '.', '^', '.', '<', '-', '>', '.', '^', '.', '^', '.', '<', '-', '>', '.', '^', '.', '|'],
    ['|', '.', '|', '.', '.', '.', '.', '.', '|', '.', '|', '.', '.', '.', '.', '.', '|', '.', '|'],
    ['|', '.', '_', '.', 'x', '.', 'x', '.', '_', '.', '_', '.', 'x', '.', 'x', '.', '_', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '2', '.', '^', '.', '^', 'g', '^', '.', '^', '.', '^', '.', '^', '.', '^', '.', '1', '3'],
    ['1', '3', '.', '_', '.', '_', '.', '_', '.', '_', '.', '_', '.', '_', '.', '_', '.', '4', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', '^', '.', 'x', '.', 'x', '.', '^', '.', '^', '.', 'x', 'g', 'x', '.', '^', '.', '|'],
    ['|', '.', '|', '.', '.', '.', '.', '.', '|', '.', '|', '.', '.', '.', '.', '.', '|', '.', '|'],
    ['|', '.', '_', '.', '<', '-', '>', '.', '_', '.', '_', '.', '<', '-', '>', '.', '_', '.', '|'],
    ['|', 'u', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'u', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
];

//Первоначальная инициализация игры
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    createBoundary(j, i, './img/pipeHorizontal.png')
                )
                break;
            case '^':
                boundaries.push(
                    createBoundary(j, i, './img/deadendUp.png')
                )
                break;
            case '>':
                boundaries.push(
                    createBoundary(j, i, './img/deadendRight.png')
                )
                break;
            case '<':
                boundaries.push(
                    createBoundary(j, i, './img/deadendLeft.png')
                )
                break;
            case '_':
                boundaries.push(
                    createBoundary(j, i, './img/deadendBottom.png')
                )
                break;
            case '|':
                boundaries.push(
                    createBoundary(j, i, './img/pipeVertical.png')
                )
                break;
            case 'x':
                boundaries.push(
                    createBoundary(j, i, './img/block.png')
                )
                break;
            case '1':
                boundaries.push(
                    createBoundary(j, i, './img/pipeUL.png')
                )
                break;
            case '2':
                boundaries.push(
                    createBoundary(j, i, './img/pipeUR.png')
                )
                break;
            case '3':
                boundaries.push(
                    createBoundary(j, i, './img/pipeBR.png')
                )
                break;
            case '4':
                boundaries.push(
                    createBoundary(j, i, './img/pipeBL.png')
                )
                break;
            case '.':
                pellets.push(
                    new Pellet({
                        position: {
                            x: j * Boundary.width + Boundary.width / 2,
                            y: i * Boundary.height + Boundary.height / 2
                        }
                    })
                )
                break;
            case 'g':
                pellets.push(
                    new Pellet({
                        position: {
                            x: j * Boundary.width + Boundary.width / 2,
                            y: i * Boundary.height + Boundary.height / 2
                        }
                    })
                )
                ghosts.push(
                    new Ghost({
                        position: {
                            x: j * Boundary.width + Boundary.width / 2,
                            y: i * Boundary.height + Boundary.height / 2
                        },
                        velocity: {
                            x: 0,
                            y: 0
                        }
                    })
                )
                break;
            case 'u':
                powerups.push(
                    new PowerUp({
                        position: {
                            x: j * Boundary.width + Boundary.width / 2,
                            y: i * Boundary.height + Boundary.height / 2
                        }
                    })
                )
                break;
            case 'p':
                player = new Player({
                    position: {
                        x: j * Boundary.width + Boundary.width / 2,
                        y: i * Boundary.height + Boundary.height / 2
                    },
                    velocity: {
                        x: 0,
                        y: 0
                    }
                });
        }
    })
})


function createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

function createBoundary(posX, posY, imageSrc) {
    return new Boundary({
        position: {
            x: Boundary.width * posX,
            y: Boundary.height * posY
        },
        image: createImage(imageSrc)
    })
}

let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, c.canvas.height);

    //Операторы для движения игрока
    if (keys.w.pressed && keysPressed.includes('w')) {
        if (!player.lost) {
            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                if (isColliding({
                    circle: {
                        ...player,
                        velocity: {
                            x: 0,
                            y: -5
                        }
                    }, rect: boundary
                })) {
                    player.velocity.y = 0;
                    break;
                } else {
                    player.velocity.y = -Player.speed;
                }
            }
        }
    }
    if (keys.a.pressed && keysPressed.includes('a')) {
        if (!player.lost) {
            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                if (isColliding({
                    circle: {
                        ...player,
                        velocity: {
                            x: -5,
                            y: 0
                        }
                    }, rect: boundary
                })) {
                    player.velocity.x = 0;
                    break;
                } else {
                    player.velocity.x = -Player.speed;
                }
            }
        }
    }
    if (keys.s.pressed && keysPressed.includes('s')) {
        if (!player.lost) {
            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                if (isColliding({
                    circle: {
                        ...player,
                        velocity: {
                            x: 0,
                            y: 5
                        }
                    }, rect: boundary
                })) {
                    player.velocity.y = 0;
                    break;
                } else {
                    player.velocity.y = Player.speed;
                }
            }
        }
    }
    if (keys.d.pressed && keysPressed.includes('d')) {
        if (!player.lost) {
            for (let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                if (isColliding({
                    circle: {
                        ...player,
                        velocity: {
                            x: 5,
                            y: 0
                        }
                    }, rect: boundary
                })) {
                    player.velocity.x = 0;
                    break;
                } else {
                    player.velocity.x = Player.speed;
                }
            }
        }
    }

    //Отрисовка пеллет, в том числе при столкновении с игроком
    for (let i = pellets.length - 1; i >= 0; i--) {
        const pellet = pellets[i];
        pellet.draw();

        if (Math.hypot(pellet.position.x - player.position.x,
            pellet.position.y - player.position.y) <
            pellet.radius + player.radius) {
            pellets.splice(i, 1);
            scoreAdd(10);

        }
    }

    //Отрисовка усилений, в т.ч. при столкновении с игроком
    for (let i = powerups.length - 1; i >= 0; i--) {
        const powerup = powerups[i];
        powerup.draw();
         
        if (Math.hypot(powerup.position.x - player.position.x,
            powerup.position.y - player.position.y) <
            powerup.radius + player.radius) {
            powerups.splice(i, 1);
            scoreAdd(50);
            
            
            ghosts.forEach(ghost => {
                if (ghost.scaredTimer) {
                    clearTimeout(ghost.scaredTimer);
                }
                ghost.scared = true;
                ghost.scaredTimer = setTimeout (() => {
                    ghost.scared = false;
                }, 7000)
            })
        }

        
    }

    //Условие победы в игре
    if (pellets.length === 0) {
        alert('You win!');
        cancelAnimationFrame(animationId);
    }


    //Функция проверки столкновения игрока со стенами
    boundaries.forEach(boundary => {
        boundary.draw();

        if (isColliding({ circle: player, rect: boundary })) {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
    })
    

    //Часть кода описывающая поведение призрака
    for (let i = ghosts.length - 1; i >= 0; i--) {
        const ghost = ghosts[i];
        ghost.update();

        const collisions = [];
        boundaries.forEach(boundary => {
            if (!collisions.includes('down') && isColliding({
                circle: {
                    ...ghost,
                    velocity: {
                        x: 0,
                        y: 5
                    }
                }, rect: boundary
            })) {
                collisions.push('down');
            }
            if (!collisions.includes('up') && isColliding({
                circle: {
                    ...ghost,
                    velocity: {
                        x: 0,
                        y: -5
                    }
                }, rect: boundary
            })) {
                collisions.push('up');
            }
            if (!collisions.includes('right') && isColliding({
                circle: {
                    ...ghost,
                    velocity: {
                        x: 5,
                        y: 0
                    }
                }, rect: boundary
            })) {
                collisions.push('right');
            }
            if (!collisions.includes('left') && isColliding({
                circle: {
                    ...ghost,
                    velocity: {
                        x: -5,
                        y: 0
                    }
                }, rect: boundary
            })) {
                collisions.push('left');
            }
        })
        let pathways = [];

        pathways = ghost.pathways.filter(path => {
            return !collisions.includes(path);
        })
        if (ghost.velocity.x > 0) {
            pathways = pathways.filter(path => path !== 'left')
        } else if (ghost.velocity.x < 0) {
            pathways = pathways.filter(path => path !== 'right')
        } else if (ghost.velocity.y > 0) {
            pathways = pathways.filter(path => path !== 'up')
        } else if (ghost.velocity.y < 0) {
            pathways = pathways.filter(path => path !== 'down')
        }
        const direction = pathways[Math.floor((Math.random() * pathways.length))];

        switch (direction) {
            case 'up':
                ghost.velocity.x = 0;
                ghost.velocity.y = -Ghost.speed;
                break;
            case 'down':
                ghost.velocity.x = 0;
                ghost.velocity.y = Ghost.speed;
                break;
            case 'left':
                ghost.velocity.x = -Ghost.speed;
                ghost.velocity.y = 0;
                break;
            case 'right':
                ghost.velocity.x = Ghost.speed;
                ghost.velocity.y = 0;
                break;
        }
        if (Math.hypot(ghost.position.x - player.position.x,
            ghost.position.y - player.position.y) <
            ghost.radius + player.radius) {
                if (!ghost.scared) {
                    alert('You lose!');
                    cancelAnimationFrame(animationId);
                }
                const deadGhost = ghost;
                ghosts.splice(i, 1);
                scoreAdd(75);
                setTimeout(() => {
                    ghosts.push(deadGhost);
                }, 10000)
        }
    }
    if (player.velocity.x > 0) {
        player.rotation = 0
    } else if (player.velocity.x < 0) {
        player.rotation = Math.PI;
    }
    else if (player.velocity.y < 0) {
        player.rotation = Math.PI * 1.5;
    }
    else if (player.velocity.y > 0) {
        player.rotation = Math.PI / 2;
    }

    player.update();
}

animate();

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w': {
            keys.w.pressed = true;
            if (!keysPressed.includes('w')) {
                keysPressed.unshift('w');
            }
            break;
        }
        case 'a': {
            keys.a.pressed = true;
            if (!keysPressed.includes('a')) {
                keysPressed.unshift('a');
            }
            break;
        }
        case 's': {
            keys.s.pressed = true;
            if (!keysPressed.includes('s')) {
                keysPressed.unshift('s');
            }
            break;
        }
        case 'd': {
            keys.d.pressed = true;
            if (!keysPressed.includes('d')) {
                keysPressed.unshift('d');
            }
            break;
        }
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w': {
            keys.w.pressed = false;
            keysPressed = keysPressed.filter(item => item !== 'w');
            player.velocity.y = 0;
            break;
        }
        case 'a': {
            keys.a.pressed = false;
            keysPressed = keysPressed.filter(item => item !== 'a');
            player.velocity.x = 0;
            break;
        }
        case 's': {
            keys.s.pressed = false;
            keysPressed = keysPressed.filter(item => item !== 's');
            player.velocity.y = 0;
            break;
        }
        case 'd': {
            keys.d.pressed = false;
            keysPressed = keysPressed.filter(item => item !== 'd');
            player.velocity.x = 0;
            break;
        }
    }
})

function isColliding({ circle, rect }) {
    const padding = Boundary.width / 2 - circle.radius - 1;
    return (
        circle.position.y - circle.radius + circle.velocity.y <= rect.position.y + rect.height + padding
        && circle.position.x + circle.radius + circle.velocity.x >= rect.position.x - padding
        && circle.position.y + circle.radius + circle.velocity.y >= rect.position.y - padding
        && circle.position.x - circle.radius + circle.velocity.x <= rect.position.x + rect.width + padding
    )
}

function scoreAdd(number) {
    scoreElem.innerText = Number(scoreElem.innerText) + number;
}