import {
  PELLET_RADIUS, 
  WALL_DIM,
  GAME_MAP,
  IMAGES,
} from './constants.js';

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

function createPellet({ position }) {
  return {
    position,
    radius: PELLET_RADIUS,
    color: "white",
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
    }
  }
}

export function drawMap() {
  const walls = [];
  const pellets = [];
  GAME_MAP.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === ".") {
        console.log("pellet");
        pellets.push(
          createPellet({
            position: {
              x: WALL_DIM * j + WALL_DIM / 2,
              y: WALL_DIM * i + WALL_DIM / 2,
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