const { fromEvent } = rxjs;
const { map, debounceTime, mapTo, filter } = rxjs.operators;
const { merge, interval } = rxjs;

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

class Pellet {
  constructor({ position }) {
    this.position = position;
    this.radius = 3;
    this.color = "white";
  }

  draw() {
    c.beginPath();
    c.arc(
      this.position.x + this.radius,
      this.position.y + this.radius,
      this.radius,
      0,
      Math.PI * 2
    );
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
  }
}

class Wall {
  static width = 25;
  static height = 25;
  constructor({ position, image, type }) {
    this.position = position;
    this.width = 25;
    this.height = 25;
    this.image = image;
    this.type = type;
  }

  draw() {
    // console.log("draw wall");
    // console.log(this.position.x, this.position.y);

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

const pellets = [];
const walls = [];

const gameMap = [
  [
    "1",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "_",
    "2",
  ],
  [
    "r",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    "a",
    "b",
    ".",
    "e",
    "i",
    "i",
    "i",
    "f",
    ".",
    "e",
    "i",
    "i",
    "i",
    "f",
    ".",
    "a",
    "b",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    "c",
    "d",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    " ",
    ".",
    ".",
    ".",
    ".",
    ".",
    "c",
    "d",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    ".",
    ".",
    ".",
    "a",
    "b",
    ".",
    "a",
    "-",
    "-",
    "-",
    "b",
    ".",
    "a",
    "b",
    ".",
    ".",
    ".",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    "a",
    "b",
    ".",
    "c",
    "d",
    ".",
    "c",
    "_",
    "_",
    "_",
    "d",
    ".",
    "c",
    "d",
    ".",
    "a",
    "b",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    "l",
    "r",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "l",
    "r",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    "l",
    "r",
    ".",
    "a",
    "b",
    ".",
    "g",
    " ",
    " ",
    " ",
    "g",
    ".",
    "a",
    "b",
    ".",
    "l",
    "r",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    "c",
    "d",
    ".",
    "l",
    "r",
    ".",
    "j",
    " ",
    " ",
    " ",
    "j",
    ".",
    "l",
    "r",
    ".",
    "c",
    "d",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    ".",
    ".",
    ".",
    "l",
    "r",
    ".",
    "l",
    "-",
    "-",
    "-",
    "r",
    ".",
    "l",
    "r",
    ".",
    ".",
    ".",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    "a",
    "b",
    ".",
    "c",
    "d",
    ".",
    "c",
    "_",
    "_",
    "_",
    "d",
    ".",
    "c",
    "d",
    ".",
    "a",
    "b",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    "l",
    "r",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "l",
    "r",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    "l",
    "3",
    "-",
    "-",
    "-",
    "b",
    ".",
    "a",
    "-",
    "b",
    ".",
    "a",
    "-",
    "-",
    "-",
    "4",
    "r",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    "c",
    "_",
    "_",
    "_",
    "_",
    "d",
    ".",
    "c",
    "_",
    "d",
    ".",
    "c",
    "_",
    "_",
    "_",
    "_",
    "d",
    ".",
    "l",
  ],
  [
    "r",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "l",
  ],
  [
    "3",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "4",
  ],
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
    if (cell === ".") {
      console.log("pellet");
      pellets.push(
        new Pellet({
          position: {
            x: Wall.width * j + Wall.width / 2,
            y: Wall.height * i + Wall.height / 2,
          },
        })
      );
    } else {
      walls.push(
        new Wall({
          position: { x: Wall.width * j, y: Wall.height * i },
          image: images[cell],
          type: cell,
        })
      );
    }
  });
});

const canvas2 = document.getElementById("game-players");
const c = canvas2.getContext("2d");
canvas2.width = innerWidth;
canvas2.height = innerHeight;

class Packman {
  constructor({ position, velocity, color }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.radius = 9;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
  //  checkColision() {
  //   const nextPosition = {
  //     x: ((this.position.x + this.velocity.x)+(gameMap[0].length * Wall.width))%(gameMap[0].length * Wall.width),
  //     y:((this.position.y + this.velocity.y)+(gameMap.length * Wall.height))%(gameMap.length * Wall.height)
  //   }
  //   if (
  //     Math.trunc((nextPosition.x + this.radius)/Wall.width)
  //   )
  //  }
  move() {
    this.draw();
    const nextPosition = {
      x:
        (this.position.x + this.velocity.x + gameMap[0].length * Wall.width) %
        (gameMap[0].length * Wall.width),
      y:
        (this.position.y + this.velocity.y + gameMap.length * Wall.height) %
        (gameMap.length * Wall.height),
    };
    const EsquinaAbajoIzq =
      gameMap[Math.trunc((nextPosition.y + this.radius) / Wall.height)][
        Math.trunc((nextPosition.x - this.radius) / Wall.width)
      ];
    const EsquinaArribaDer =
      gameMap[Math.trunc((nextPosition.y - this.radius) / Wall.height)][
        Math.trunc((nextPosition.x + this.radius) / Wall.width)
      ];
    const EsquinaAbajoDer =
      gameMap[Math.trunc((nextPosition.y + this.radius) / Wall.height)][
        Math.trunc((nextPosition.x + this.radius) / Wall.width)
      ];
    const EsquinaArribaIzq =
      gameMap[Math.trunc((nextPosition.y - this.radius) / Wall.height)][
        Math.trunc((nextPosition.x - this.radius) / Wall.width)
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
      (this.position.x + this.velocity.x + gameMap[0].length * Wall.height) %
      (gameMap[0].length * Wall.height);
    this.position.y =
      (this.position.y + this.velocity.y + gameMap.length * Wall.height) %
      (gameMap.length * Wall.height);
    c.beginPath();
    c.rect(
      Math.trunc(nextPosition.x / 25) * 25,
      Math.trunc(nextPosition.y / 25) * 25,
      25,
      25
    );
    c.strokeStyle = "grey";
    c.stroke();
    c.closePath();
    // console.log(this.position)
  }
}

const player1 = new Packman({
  position: { x: 37.5, y: 37.5 },
  velocity: { x: 0, y: 0 },
  color: "blue",
});

const player2 = new Packman({
  position: { x: 50, y: 37.5 },
  velocity: { x: 0, y: 0 },
  color: "red",
});

const leftArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "ArrowLeft"),
  mapTo({ x: -7, y: 0 })
);
const rightArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "ArrowRight"),
  mapTo({ x: 7, y: 0 })
);
const upArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "ArrowUp"),
  mapTo({ x: 0, y: -7 })
);
const downArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "ArrowDown"),
  mapTo({ x: 0, y: 7 })
);

const movepackmanP1$ = merge(leftArrow$, rightArrow$, upArrow$, downArrow$);

movepackmanP1$.subscribe((distance) => {
  player1.velocity = distance;
});

const aKey$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "a"),
  mapTo({ x: -7, y: 0 })
);
const dKey$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "d"),
  mapTo({ x: 7, y: 0 })
);
const wKey$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "w"),
  mapTo({ x: 0, y: -7 })
);
const sKey$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "s"),
  mapTo({ x: 0, y: 7 })
);

const movepackmanP2$ = merge(aKey$, dKey$, wKey$, sKey$);

movepackmanP2$.subscribe((distance) => {
  player2.velocity = distance;
});

const cicle = interval(50);

cicle.subscribe(() => {
  c.clearRect(0, 0, canvas2.width, canvas2.height);
  player1.move();
  player2.move();
  walls.forEach((wall) => wall.draw());
  pellets.forEach((pellet) => {
    pellet.draw();
    if (
      Math.hypot(
        pellet.position.x - player1.position.x,
        pellet.position.y - player1.position.y
      ) <
      pellet.radius + player1.radius
    ) {
      pellet.color = "blue";
    }
    if (
      Math.hypot(
        pellet.position.x - player2.position.x,
        pellet.position.y - player2.position.y
      ) <
      pellet.radius + player2.radius
    ) {
      pellet.color = "red";
    }
  });
});

// player.draw();
