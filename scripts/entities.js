import {
  WALL_DIM,
  PACMAN_RADIUS,
  MOVEMENT_SPEED,
  GHOST_RADIUS,
  GHOST_DIM,
  GHOST_START_X,
  GHOST_START_Y,
  ENEMY_QUANTITY,
  IMAGES,
} from './constants.js';

import {
  GAME_MAP
} from './map.js';

const canvas2 = document.getElementById("game-canvas");
const ctx = canvas2.getContext("2d");
canvas2.width = innerWidth;
canvas2.height = innerHeight;


function createGhost({ position, velocity, color }) {
  return {
    position,
    velocity,
    color,
    radius: GHOST_RADIUS,
    width: GHOST_DIM,
    height: GHOST_DIM,
    draw() {
      const x = this.position.x - GHOST_RADIUS
      const y = this.position.y - GHOST_RADIUS;
      // Draw the body of the ghost
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.fillRect(x, y + this.height/ 2, this.width, this.height / 2);
      ctx.moveTo(x, y + this.height/ 2);
      ctx.arc(x + this.width / 2, y + this.height / 2, this.width / 2, Math.PI, 0, false);
      ctx.fill();
      // Draw the eyes
      ctx.beginPath();
      ctx.fillStyle = "#FFF";
      ctx.arc(x + this.width / 3, y + this.height / 3, this.width / 10, 0, Math.PI * 2, true);
      ctx.arc(x + 2 * this.width / 3, y + this.height / 3, this.width / 10, 0, Math.PI * 2, true);
      ctx.fill();
      // Draw the pupils
      ctx.beginPath();
      ctx.fillStyle = "#000";
      ctx.arc(x + this.width / 3, y + this.height / 3, this.width / 25, 0, Math.PI * 2, true);
      ctx.arc(x + 2 * this.width / 3, y + this.height / 3, this.width / 25, 0, Math.PI * 2, true);
      ctx.fill();
    },
    update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    },
    possibleMoves() {
      const possibleMoves = [];
      const currentPosition = {
        x: Math.floor(this.position.x / WALL_DIM),
        y: Math.floor(this.position.y / WALL_DIM)
      };
      if ((GAME_MAP[currentPosition.y][currentPosition.x + 1] === "." || GAME_MAP[currentPosition.y][currentPosition.x + 1] === " ") && this.velocity.x !== -MOVEMENT_SPEED) {
        possibleMoves.push("right");
      }
      if ((GAME_MAP[currentPosition.y][currentPosition.x - 1] === "." || GAME_MAP[currentPosition.y][currentPosition.x - 1] === " ") && this.velocity.x !== MOVEMENT_SPEED) {
        possibleMoves.push("left");
      }
      if ((GAME_MAP[currentPosition.y + 1][currentPosition.x] === "." || GAME_MAP[currentPosition.y + 1][currentPosition.x] === " ") && this.velocity.y !== -MOVEMENT_SPEED) {
        possibleMoves.push("down");
      }
      if ((GAME_MAP[currentPosition.y - 1][currentPosition.x] === "." || GAME_MAP[currentPosition.y - 1][currentPosition.x] === " ") && this.velocity.y !== MOVEMENT_SPEED) {
        possibleMoves.push("up");
      }
      return possibleMoves;
    },
    changeDirection() {
      const possibleMoves = this.possibleMoves();
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      const currentPosition = {
        x: Math.floor(this.position.x / WALL_DIM),
        y: Math.floor(this.position.y / WALL_DIM)
      };
      switch (randomMove) {
        case "right":
          if (this.position.y - this.radius > currentPosition.y * WALL_DIM && this.position.y + this.radius < (currentPosition.y + 1) * WALL_DIM) {
            this.velocity = { x: MOVEMENT_SPEED, y: 0 };
            break;
          }
        case "left":
          if (this.position.y - this.radius > currentPosition.y * WALL_DIM && this.position.y + this.radius < (currentPosition.y + 1) * WALL_DIM) {
            this.velocity = { x: -MOVEMENT_SPEED, y: 0 };
            break;
          }
        case "down":
          if (this.position.x - this.radius > currentPosition.x * WALL_DIM && this.position.x + this.radius < (currentPosition.x + 1) * WALL_DIM) {
            this.velocity = { x: 0, y: MOVEMENT_SPEED };
            break;
          }
        case "up":
          if (this.position.x - this.radius > currentPosition.x * WALL_DIM && this.position.x + this.radius < (currentPosition.x + 1) * WALL_DIM) {
            this.velocity = { x: 0, y: -MOVEMENT_SPEED };
            break;
          }
      }
    }
  }
}

export function createGhosts() {
  const colors = Array(ENEMY_QUANTITY).fill("white")
  return colors.map((color) => {
    return createGhost({
      position: { x: GHOST_START_X, y: GHOST_START_Y },
      velocity: { x: MOVEMENT_SPEED, y: 0 },
      color,
    })
  });
}

function createPacman({ position, velocity, color, playerNumber }) {
  return {
    position,
    velocity,
    color,
    playerNumber,
    radius: PACMAN_RADIUS,
    score: 0,
    movementSubscription: null,
    draw() {
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    },
    move() {
      this.draw();
      const nextPosition = {
        x:
          (this.position.x + this.velocity.x + GAME_MAP[0].length * WALL_DIM) %
          (GAME_MAP[0].length * WALL_DIM),
        y:
          (this.position.y + this.velocity.y + GAME_MAP.length * WALL_DIM) %
          (GAME_MAP.length * WALL_DIM),
      };
      const EsquinaAbajoIzq =
        GAME_MAP[Math.trunc((nextPosition.y + this.radius) / WALL_DIM)][
          Math.trunc((nextPosition.x - this.radius) / WALL_DIM)
        ];
      const EsquinaArribaDer =
        GAME_MAP[Math.trunc((nextPosition.y - this.radius) / WALL_DIM)][
          Math.trunc((nextPosition.x + this.radius) / WALL_DIM)
        ];
      const EsquinaAbajoDer =
        GAME_MAP[Math.trunc((nextPosition.y + this.radius) / WALL_DIM)][
          Math.trunc((nextPosition.x + this.radius) / WALL_DIM)
        ];
      const EsquinaArribaIzq =
        GAME_MAP[Math.trunc((nextPosition.y - this.radius) / WALL_DIM)][
          Math.trunc((nextPosition.x - this.radius) / WALL_DIM)
        ];
      if (
        (EsquinaAbajoIzq != "." && EsquinaAbajoIzq != " ") ||
        (EsquinaArribaDer != "." && EsquinaArribaDer != " ") ||
        (EsquinaAbajoDer != "." && EsquinaAbajoDer != " ") ||
        (EsquinaArribaIzq != "." && EsquinaArribaIzq != " ")
      ) {
        this.velocity = { x: 0, y: 0 };
      }
      this.position.x =
        (this.position.x + this.velocity.x + GAME_MAP[0].length * WALL_DIM) %
        (GAME_MAP[0].length * WALL_DIM);
      this.position.y =
        (this.position.y + this.velocity.y + GAME_MAP.length * WALL_DIM) %
        (GAME_MAP.length * WALL_DIM);
      ctx.beginPath();
      ctx.rect(
        Math.trunc(nextPosition.x / WALL_DIM) * WALL_DIM,
        Math.trunc(nextPosition.y / WALL_DIM) * WALL_DIM,
        WALL_DIM,
        WALL_DIM
      );
      ctx.strokeStyle = "grey";
      ctx.stroke();
      ctx.closePath();
    }
  }
}

export function createPlayer({ position, velocity, color, playerNumber }) {
  const player = createPacman({ position, velocity, color, playerNumber });
  const pointsDiv = document.querySelector(`#p${playerNumber}-score`);
  pointsDiv.style.color = color
  pointsDiv.innerText = 0
  return player
}

export function collisionWithGhost(player, ghost) {
  const x = player.position.x - ghost.position.x;
  const y = player.position.y - ghost.position.y;
  return Math.hypot(x, y) < PACMAN_RADIUS + GHOST_RADIUS
}

export function addPoints(player) {
  player.score += 10;
  const pointsDiv = document.querySelector(`#p${player.playerNumber}-score`);
  pointsDiv.innerText = player.score
  return player.score
}