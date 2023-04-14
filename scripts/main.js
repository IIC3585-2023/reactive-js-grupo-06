const { fromEvent } = rxjs;
const { map, debounceTime, mapTo, filter } = rxjs.operators;
const { merge, interval } = rxjs;

const inputField = document.getElementById("input-field");
const displayText = document.getElementById("display-text");

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

class Packman {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 20;
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
    c.fillStyle = "white";
    c.fill();
    c.closePath();
  }

  move() {
    this.draw();
    this.position.x = (this.position.x + this.velocity.x) % 300;
    this.position.y = (this.position.y + this.velocity.y) % 300;
    console.log(this.position);
  }
}

const player = new Packman({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
});

const leftArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "ArrowLeft"),
  mapTo({ x: -10, y: 0 })
);
const rightArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "ArrowRight"),
  mapTo({ x: 10, y: 0 })
);
const upArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "ArrowUp"),
  mapTo({ x: 0, y: -10 })
);
const downArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "ArrowDown"),
  mapTo({ x: 0, y: 10 })
);

const movepackmanP1$ = merge(leftArrow$, rightArrow$, upArrow$, downArrow$);

movepackmanP1$.subscribe((distance) => {
  player.velocity = distance;
});
const cicle = interval(50);

cicle.subscribe(() => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.move();
});

player.draw();
