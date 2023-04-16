const { fromEvent, from } = rxjs;
const { map, debounceTime, mapTo, filter, tap, distinctUntilChanged, pluck  } = rxjs.operators;
const { merge, interval } = rxjs;
import { drawMap, deletePellet } from './map.js';
import { createGhosts, createPlayer, addPoint } from './entities.js';
import {
  MOVEMENT_SPEED,
  PLAYER_1_START,
  PLAYER_2_START,
  INTERVAL_RATE,
  GHOST_START
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
  playerNumber: 1,
})

const leftArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => {
    if (event.key === "ArrowLeft") {event.preventDefault(); return true}
    return false
  }),
  mapTo({ x: -MOVEMENT_SPEED, y: 0 })
);
const rightArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => {
    if (event.key === "ArrowRight") {event.preventDefault(); return true}
    return false
  }),
  mapTo({ x: MOVEMENT_SPEED, y: 0 })
);
const upArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => {
    if (event.key === "ArrowUp") {event.preventDefault(); return true}
    return false
  }),
  mapTo({ x: 0, y: -MOVEMENT_SPEED })
);
const downArrow$ = fromEvent(document, "keydown").pipe(
  filter((event) => {
    if (event.key === "ArrowDown") {event.preventDefault(); return true}
    return false
  }),
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
  playerNumber: 2,
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
  ctx.clearRect(0, 0, canvas2.width, canvas2.height);
  player1.move();
  player2.move();
  ghosts.forEach((ghost) => {
    ghost.update();
    ghost.changeDirection();
  });
  pellets.forEach((pellet) => {
    if (!pellet.alive){return}
    pellet.update();
    if (
      Math.hypot(
        pellet.position.x - player1.position.x,
        pellet.position.y - player1.position.y
      ) <
      pellet.radius + player1.radius
    ) {
      pellet.color = player1.color;
    }
    if (
      Math.hypot(
        pellet.position.x - player2.position.x,
        pellet.position.y - player2.position.y
      ) <
      pellet.radius + player2.radius
    ) {
      pellet.color = player2.color;
    }
    ghosts.forEach((ghost) => {
      if (
        Math.hypot(
          pellet.position.x - ghost.position.x,
          pellet.position.y - ghost.position.y
        ) <
        pellet.radius + ghost.radius
      ) {
        if (pellet.color === player1.color) {
          player1.score += 10;
          deletePellet(pellet)
        } else if (pellet.color === player2.color) {
          player2.score += 10;
          deletePellet(pellet)
        }
        pellet.color = "white";
      }
    })
  });
});

export function reset() {
  pellets.forEach((p)=>{p.alive = true; p.color = 'white'})
  player1.score = 0;
  player2.score = 0;
  player1.position = PLAYER_1_START;
  player2.position = PLAYER_2_START;
  player1.velocity = { x: 0, y: 0 };
  player2.velocity = { x: 0, y: 0 };
  ghosts.forEach((g) => {g.position = { x: 367.5, y: 330.5 }})
}


const resetButton = document.querySelector('#start-button');

fromEvent(resetButton, 'click')
  .pipe(
    tap(() => reset())
  ).subscribe();



