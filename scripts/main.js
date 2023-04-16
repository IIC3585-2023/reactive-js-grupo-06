const { fromEvent } = rxjs;
const { map, debounceTime, mapTo, filter } = rxjs.operators;
const { merge, interval } = rxjs;
import { drawMap } from './map.js';
import { createGhosts, createPlayer } from './entities.js';
import {
  MOVEMENT_SPEED,
  PLAYER_1_START,
  PLAYER_2_START,
  INTERVAL_RATE,
} from './constants.js';

const canvas2 = document.getElementById("game-canvas");
const ctx = canvas2.getContext("2d");
canvas2.width = innerWidth;
canvas2.height = innerHeight;


// PLAYER 1
const player1 = createPlayer({
  position: PLAYER_1_START,
  velocity: { x: 0, y: 0 },
  color: "yellow",
})

const leftArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "ArrowLeft"),
  mapTo({ x: -MOVEMENT_SPEED, y: 0 })
);
const rightArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "ArrowRight"),
  mapTo({ x: MOVEMENT_SPEED, y: 0 })
);
const upArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "ArrowUp"),
  mapTo({ x: 0, y: -MOVEMENT_SPEED })
);
const downArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key === "ArrowDown"),
  mapTo({ x: 0, y: MOVEMENT_SPEED })
);

const movepacmanP1$ = merge(leftArrow$, rightArrow$, upArrow$, downArrow$);

movepacmanP1$.subscribe((distance) => {
  player1.velocity = distance;
});

// PLAYER 2
const player2 = createPlayer({
  position: PLAYER_2_START,
  velocity: { x: 0, y: 0 },
  color: "red",
});

const aKey$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key.toLowerCase() === "a"),
  mapTo({ x: -MOVEMENT_SPEED, y: 0 })
);
const dKey$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key.toLowerCase() === "d"),
  mapTo({ x: MOVEMENT_SPEED, y: 0 })
);
const wKey$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key.toLowerCase() === "w"),
  mapTo({ x: 0, y: -MOVEMENT_SPEED })
);
const sKey$ = fromEvent(document, "keydown").pipe(
  filter((event) => event.key.toLowerCase() === "s"),
  mapTo({ x: 0, y: MOVEMENT_SPEED })
);

const movepacmanP2$ = merge(aKey$, dKey$, wKey$, sKey$);

movepacmanP2$.subscribe((distance) => {
  player2.velocity = distance;
});




const pellets = drawMap();
const ghosts = createGhosts();

const cicle = interval(INTERVAL_RATE);

cicle.subscribe(() => {
  console.log("player1 score: " + player1.score)
  console.log("player2 score: " + player2.score)
  ctx.clearRect(0, 0, canvas2.width, canvas2.height);
  player1.move();
  player2.move();
  ghosts.forEach((ghost) => {
    ghost.update();
    ghost.changeDirection();
  });
  pellets.forEach((pellet) => {
    pellet.update();
    if (
      Math.hypot(
        pellet.position.x - player1.position.x,
        pellet.position.y - player1.position.y
      ) <
      pellet.radius + player1.radius
    ) {
      pellet.color = "yellow";
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
    ghosts.forEach((ghost) => {
      if (
        Math.hypot(
          pellet.position.x - ghost.position.x,
          pellet.position.y - ghost.position.y
        ) <
        pellet.radius + ghost.radius
      ) {
        if (pellet.color === "yellow") {
          player1.score += 10;
        } else if (pellet.color === "red") {
          player2.score += 10;
        }
        pellet.color = "white";
      }
    })
  });
});