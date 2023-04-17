const { fromEvent, from, timer } = rxjs;
const { map, debounceTime, mapTo, filter, tap, takeUntil } = rxjs.operators;
const { merge, interval } = rxjs;
import { drawMap, collisionWithPellet, deletePellet, ghostCollisionWithPellet } from './map.js';
import { createGhosts, createPlayer, collisionWithGhost, addPoints } from './entities.js';
import {
  MOVEMENT_SPEED,
  PLAYER_1_START_X,
  PLAYER_1_START_Y,
  PLAYER_2_START_X,
  PLAYER_2_START_Y,
  GHOST_START_X,
  GHOST_START_Y,
  INTERVAL_RATE,
} from './constants.js';

const canvas2 = document.getElementById("game-canvas");
const ctx = canvas2.getContext("2d");
canvas2.width = innerWidth;
canvas2.height = innerHeight;


const pellets = drawMap();
const ghosts = createGhosts();

function subscribePlayerToGame(player) {
  const directionsSpeed = [
    { x: -MOVEMENT_SPEED, y: 0 }, // left
    { x: MOVEMENT_SPEED, y: 0 },  // right
    { x: 0, y: -MOVEMENT_SPEED }, // up
    { x: 0, y: MOVEMENT_SPEED },  // down
  ]
  let keys = [];
  if (player.playerNumber == 1) {
    keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]
  } else {
    keys = ["a", "d", "w", "s"]
  }
  const moves$ = directionsSpeed.map(
    (speed) => {
      return fromEvent(document, "keydown")
        .pipe(
          filter((event) => { 
            if (event.key === keys[directionsSpeed.indexOf(speed)]) { event.preventDefault(); return true } return false
          }),
          mapTo(speed)
        )
    }
  )
  const movePlayer$ = merge(...moves$);
  player.movementSubscription = movePlayer$.subscribe((distance) => {
    player.velocity = distance;
  });
}

// PLAYER 1
const player1 = createPlayer({
  position: { x: PLAYER_1_START_X, y: PLAYER_1_START_Y },
  velocity: { x: 0, y: 0 },
  color: "yellow",
  playerNumber: 1,
})

// PLAYER 2
const player2 = createPlayer({
  position: { x: PLAYER_2_START_X, y: PLAYER_2_START_Y },
  velocity: { x: 0, y: 0 },
  color: "red",
  playerNumber: 2,
});


subscribePlayerToGame(player1)
subscribePlayerToGame(player2)

const timerStart = Date.now();
const stop$ = timer(45000)

// GAME LOOP
interval(INTERVAL_RATE)
  .pipe(
    takeUntil(stop$),
    filter(() => !player1.movementSubscription.closed || !player2.movementSubscription.closed),
    tap(() => {
      document.querySelector(`#game-time`).innerText = (Date.now() - timerStart)/1000;
      ctx.clearRect(0, 0, canvas2.width, canvas2.height);
      if (!player1.movementSubscription.closed) { player1.move() }
      if (!player2.movementSubscription.closed) { player2.move() }
      ghosts.forEach((ghost) => {
        ghost.update();
        ghost.changeDirection();
        if (collisionWithGhost(player1, ghost)) {
          console.log("player 1 died")
          player1.movementSubscription.unsubscribe();
          player1.velocity = { x: 0, y: 0 };
        }
        if (collisionWithGhost(player2, ghost)) {
          console.log("player 2 died")
          player2.velocity = { x: 0, y: 0 };
          player2.movementSubscription.unsubscribe();
        }
      });
      from(pellets)
        .pipe(
          filter(pellet => pellet.alive),
          tap(pellet => pellet.update()),
          tap(pellet => {
            if (collisionWithPellet(player1, pellet)) { pellet.color = player1.color }
            if (collisionWithPellet(player2, pellet)) { pellet.color = player2.color}
          }),
          map(pellet => [pellet, ghosts.filter(ghost => ghostCollisionWithPellet(ghost, pellet))]),
          filter(collisions => collisions[1].length > 0),
          tap(collisions => {
            const pellet = collisions[0];
            if (pellet.color === player1.color) {
              player1.score = addPoints(player1);
              deletePellet(pellet);
              pellet.color = 'white';
            } else if (pellet.color === player2.color) {
              player2.score = addPoints(player2);
              deletePellet(pellet);
              pellet.color = 'white';
            }

          }),
        )
        .subscribe();
    })
  ).subscribe()


function reset() {
  pellets.forEach((p) => { p.alive = true; p.color = 'white' })
  player1.score = 0;
  player2.score = 0;
  document.querySelector(`#p1-score`).innerText = 0;
  document.querySelector(`#p2-score`).innerText = 0;
  player1.position = { x: PLAYER_1_START_X, y: PLAYER_1_START_Y };
  player2.position = { x: PLAYER_2_START_X, y: PLAYER_2_START_Y };
  player1.velocity = { x: 0, y: 0 };
  player2.velocity = { x: 0, y: 0 };
  subscribePlayerToGame(player1)
  subscribePlayerToGame(player2)
  ghosts.forEach((g) => { g.position = { x: GHOST_START_X, y: GHOST_START_Y } })
}

const resetButton = document.querySelector('#start-button');

fromEvent(resetButton, 'click')
  .pipe(
    tap(() => reset())
  ).subscribe();