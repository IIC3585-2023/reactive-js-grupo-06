import {
  WALL_DIM,
  GAME_MAP,
  PACMAN_RADIUS,
  MOVEMENT_SPEED,
  GHOST_RADIUS,
  GHOST_START,
} from './constants.js';

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
    draw() {
      ctx.beginPath();
      ctx.arc(
        this.position.x,
        this.position.y,
        this.radius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
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
      if (GAME_MAP[currentPosition.y][currentPosition.x + 1] === "." && this.velocity.x !== -MOVEMENT_SPEED) {
        possibleMoves.push("right");
      }
      if (GAME_MAP[currentPosition.y][currentPosition.x - 1] === "." && this.velocity.x !== MOVEMENT_SPEED) {
        possibleMoves.push("left");
      }
      if (GAME_MAP[currentPosition.y + 1][currentPosition.x] === "." && this.velocity.y !== -MOVEMENT_SPEED) {
        possibleMoves.push("down");
      }
      if (GAME_MAP[currentPosition.y - 1][currentPosition.x] === "." && this.velocity.y !== MOVEMENT_SPEED) {
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
  const colors = ["red", "pink", "cyan", "orange"]
  return colors.map((color) => {
    return createGhost({
      position: { x: 367.5, y: 330.5 },
      velocity: { x: MOVEMENT_SPEED, y: 0 },
      color,
    })
  });
}

function createPacman({ position, velocity, color }) {
  return {
    position,
    velocity,
    color,
    radius: PACMAN_RADIUS,
    score: 0,
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

export function createPlayer({ position, velocity, color }) {
  const player = createPacman({ position, velocity, color });
  return player
}