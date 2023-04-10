const { fromEvent } = rxjs;
const { map, debounceTime, mapTo, filter} = rxjs.operators;
const { merge, interval}= rxjs


const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

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
        type: cell
      })
    );
  });
});







const canvas2 = document.getElementById("game-players");
const c = canvas2.getContext('2d');
canvas2.width = innerWidth;
canvas2.height = innerHeight;

class Packman {
  constructor({position, velocity}) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 6;
  } 

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'white'
    c.fill()
    c.closePath()
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
  move(){
    this.draw()
    const nextPosition = {
      x:((this.position.x + this.velocity.x)+(gameMap[0].length * Wall.width))%(gameMap[0].length * Wall.width),
      y:((this.position.y + this.velocity.y)+(gameMap.length * Wall.height))%(gameMap.length * Wall.height)
    }
    const EsquinaAbajoIzq = gameMap[Math.trunc((nextPosition.y  + this.radius)/Wall.height)][Math.trunc((nextPosition.x  - this.radius)/Wall.width)]
    const EsquinaArribaDer = gameMap[Math.trunc((nextPosition.y  - this.radius)/Wall.height)][Math.trunc((nextPosition.x  + this.radius)/Wall.width)]
    const EsquinaAbajoDer = gameMap[Math.trunc((nextPosition.y + this.radius)/Wall.height)][Math.trunc((nextPosition.x + this.radius)/Wall.width)]
    const EsquinaArribaIzq = gameMap[Math.trunc((nextPosition.y - this.radius)/Wall.height)][Math.trunc((nextPosition.x - this.radius)/Wall.width)]
    if ((EsquinaAbajoIzq!='.' && EsquinaAbajoIzq!=' ')||(EsquinaArribaDer!='.' && EsquinaArribaDer!=' ')||(EsquinaAbajoDer!='.' && EsquinaAbajoDer!=' ')||(EsquinaArribaIzq!='.' && EsquinaArribaIzq!=' ')) {
      this.velocity = {x:0, y:0}
    }
    this.position.x = ((this.position.x + this.velocity.x)+(gameMap[0].length * Wall.height))%(gameMap[0].length * Wall.height)
    this.position.y = ((this.position.y + this.velocity.y)+(gameMap.length * Wall.height))%(gameMap.length * Wall.height)
    c.beginPath()
    c.rect(Math.trunc((nextPosition.x)/25)*25,Math.trunc((nextPosition.y )/25)*25,25,25)
    c.strokeStyle = 'grey'
    c.stroke()
    c.closePath()
    // console.log(this.position)
  }
}

const player = new Packman({position: {x: 37.5, y: 37.5}, velocity: {x: 0, y: 0}})


const leftArrow$ = fromEvent(document, 'keydown').pipe(
  filter(event => event.key === 'ArrowLeft'),
  mapTo({ x: -7, y: 0 })
);
const rightArrow$ = fromEvent(document, 'keydown').pipe(
  filter(event => event.key === 'ArrowRight'),
  mapTo({ x: 7, y: 0 })
);
const upArrow$ = fromEvent(document, 'keydown').pipe(
  filter(event => event.key === 'ArrowUp'),
  mapTo({ x: 0, y: -7 })
);
const downArrow$ = fromEvent(document, 'keydown').pipe(
  filter(event => event.key === 'ArrowDown'),
  mapTo({ x: 0, y: 7 })
);


const movepackmanP1$ = merge(leftArrow$, rightArrow$, upArrow$, downArrow$);

movepackmanP1$.subscribe(distance => {
  player.velocity = distance;
});
 const cicle = interval(50);

 cicle.subscribe(() => {c.clearRect(0,0,canvas2.width, canvas2.height);player.move()});

walls.forEach((wall) => wall.draw());
player.draw()