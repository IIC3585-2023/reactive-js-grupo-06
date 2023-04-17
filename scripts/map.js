import {
  PELLET_RADIUS,
  PACMAN_RADIUS,
  GHOST_RADIUS,
  WALL_DIM,
  IMAGES,
  GAME_MAP_ORIGINAL
} from './constants.js';

export const GAME_MAP = [...GAME_MAP_ORIGINAL]

const canvas = document.getElementById("map-canvas");
const mapCtx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const canvas2 = document.getElementById("game-canvas");
const ctx = canvas2.getContext("2d");
canvas2.width = innerWidth;
canvas2.height = innerHeight;

function createWall({ position, image, type}) {
  return {
    position,
    image,
    type,
    width: WALL_DIM,
    height: WALL_DIM,
    draw() {
      const img = new Image();
      img.src = this.image;
      img.onload = () => {
        mapCtx.drawImage(
          img,
          this.position.x,
          this.position.y,
          this.width,
          this.height
        );
        }
    }
  }
}

function createPellet({ position, position_relative }) {
  return {
    position,
    position_relative,
    radius: PELLET_RADIUS,
    color: "white",
    alive: true,
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
      if (this.alive){
        this.draw();
      }
    }
  }
}

export function collisionWithPellet(player, pellet) {
  const x = player.position.x - pellet.position.x;
  const y = player.position.y - pellet.position.y;
  return Math.hypot(x, y) < PACMAN_RADIUS + PELLET_RADIUS
}

export function ghostCollisionWithPellet(ghost, pellet) {
  const x = ghost.position.x - pellet.position.x;
  const y = ghost.position.y - pellet.position.y;
  return Math.hypot(x, y) < GHOST_RADIUS + PELLET_RADIUS
}

export function deletePellet(pellet) {
  pellet.alive = false
}

export function drawMap() {
  const walls = [];
  const pellets = [];
  GAME_MAP.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === ".") {
        pellets.push(
          createPellet({
            position: {
              x: WALL_DIM * j + WALL_DIM / 2,
              y: WALL_DIM * i + WALL_DIM / 2,
            },
            position_relative: {
              x: j,
              y: i,
            },
          })
        );
      } else {
        walls.push(
          createWall({
            position: { x: WALL_DIM * j, y: WALL_DIM * i },
            image: IMAGES[cell],
            type: cell,
          })
        );
      }
    });
  });
  walls.forEach((wall) => wall.draw());
  return pellets
}

