const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

class Wall {
  static width = 25;
  static height = 25;
  constructor({ position, image }) {
    this.position = position;
    this.width = 25;
    this.height = 25;
    this.image = image;
  }

  draw() {
    console.log("draw wall");
    console.log(this.position.x, this.position.y);

    const img = new Image();
    img.src = this.image;
    img.onload = () => {
      ctx.drawImage(
        img,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    };
    // ctx.fillStyle = "grey";
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    // ctx.drawImage(
    //   this.image,
    //   this.position.x,
    //   this.position.y,
    //   this.width,
    //   this.height
    // );
    // ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

const walls = [];

const gameMap = [
  [ "1", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "2", ],
  [ "r", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "l", ],
  [ "r", ".", "a", "b", ".", "e", "i", "i", "i", "f", ".", "e", "i", "i", "i", "f", ".", "a", "b", ".", "l", ],
  [ "r", ".", "c", "d", ".", ".", ".", ".", ".", ".", ".", " ", ".", ".", ".", ".", ".", "c", "d", ".", "l", ],
  [ "r", ".", ".", ".", ".", "a", "b", ".", "a", "-", "-", "-", "b", ".", "a", "b", ".", ".", ".", ".", "l", ],
  [ "r", ".", "a", "b", ".", "c", "d", ".", "c", "_", "_", "_", "d", ".", "c", "d", ".", "a", "b", ".", "l", ],
  [ "r", ".", "l", "r", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "l", "r", ".", "l", ],
  [ "r", ".", "l", "r", ".", "a", "b", ".", "g", " ", " ", " ", "g", ".", "a", "b", ".", "l", "r", ".", "l", ],
  [ "r", ".", "c", "d", ".", "l", "r", ".", "j", " ", " ", " ", "j", ".", "l", "r", ".", "c", "d", ".", "l", ],
  [ "r", ".", ".", ".", ".", "l", "r", ".", "l", "-", "-", "-", "r", ".", "l", "r", ".", ".", ".", ".", "l", ],
  [ "r", ".", "a", "b", ".", "c", "d", ".", "c", "_", "_", "_", "d", ".", "c", "d", ".", "a", "b", ".", "l", ],
  [ "r", ".", "l", "r", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "l", "r", ".", "l", ],
  [ "r", ".", "l", "3", "-", "-", "-", "b", ".", "a", "-", "b", ".", "a", "-", "-", "-", "4", "r", ".", "l", ],
  [ "r", ".", "c", "_", "_", "_", "_", "d", ".", "c", "_", "d", ".", "c", "_", "_", "_", "_", "d", ".", "l", ],
  [ "r", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "l", ],
  [ "3", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "4", ],
];

function loadImages(src) {
  const image = new Image();
  image.src = src;
  return image;
}
// new dictionary with characters to strings
const images = {
  1: "img/1.png",
  2: "img/2.png",
  3: "img/3.png",
  4: "img/4.png",
  a: "img/top_left.png",
  b: "img/top_right.png",
  c: "img/bot_right.png",
  d: "img/bot_left.png",
  e: "img/capLeft.png",
  f: "img/capRight.png",
  g: "img/capTop.png",
  h: "img/capBot.png",
  i: "img/pipeHorizontal.png",
  j: "img/pipeVertical.png",
  l: "img/left.png",
  r: "img/right.png",
  _: "img/bottom.png",
  "-": "img/top.png",
  ".": "img/path.png",
  " ": "img/path.png",
};
gameMap.forEach((row, i) => {
  row.forEach((cell, j) => {
    walls.push(
      new Wall({
        position: { x: Wall.width * j, y: Wall.height * i },
        image: images[cell],
      })
    );
  });
});

console.log(walls.length);
walls.forEach((wall) => wall.draw());
