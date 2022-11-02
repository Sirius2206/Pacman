switch (keysPressed[0]) {
    case 'w': {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (isColliding({pacman: {
                ...player,
                velocity: {
                    x: 0,
                    y: -5
                }
            }, rect: boundary})) {
                player.velocity.y = 0;
                break;
            } else {
                player.moveUp();
            }
        }
        break;
    }
    case 'a': {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (isColliding({pacman: {
                ...player,
                velocity: {
                    x: -5,
                    y: 0
                }
            }, rect: boundary})) {
                player.velocity.x = 0;
                break;
            } else {
                player.moveLeft();
            }
        }
        break;
    }
    case 's': {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (isColliding({pacman: {
                ...player,
                velocity: {
                    x: 0,
                    y: 5
                }
            }, rect: boundary})) {
                player.velocity.y = 0;
                break;
            } else {
                player.moveDown();
            }
        }
        break;
    }
    case 'd': {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (isColliding({pacman: {
                ...player,
                velocity: {
                    x: 5,
                    y: 0
                }
            }, rect: boundary})) {
                player.velocity.x = 0;
                break;
            } else {
                player.moveRight();
            }
        }
        break;
    }

}