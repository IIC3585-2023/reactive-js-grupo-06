const { fromEvent, from } = rxjs;
const { map, debounceTime, mapTo, filter, tap, distinctUntilChanged, pluck  } = rxjs.operators;
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
  movePlayer$.subscribe((distance) => {
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


// GAME LOOP
interval(INTERVAL_RATE)
  .pipe(
    tap(() => {
      ctx.clearRect(0, 0, canvas2.width, canvas2.height);
      player1.move();
      player2.move();
      ghosts.forEach((ghost) => {
        ghost.update();
        ghost.changeDirection();
        if (collisionWithGhost(player1, ghost)) {
          console.log("player 1 died")
        }
        if (collisionWithGhost(player2, ghost)) {
          console.log("player 2 died")
        }
      });
      pellets.forEach((pellet) => {
        if (!pellet.alive) { return }
        pellet.update();
        if (collisionWithPellet(player1, pellet)) { pellet.color = player1.color }
        if (collisionWithPellet(player2, pellet)) { pellet.color = player2.color }
        ghosts.forEach((ghost) => {
          if (ghostCollisionWithPellet(ghost, pellet)) {
            if (pellet.color === player1.color) {
              player1.score = addPoints(player1);
              deletePellet(pellet)
            } else if (pellet.color === player2.color) {
              player1.score = addPoints(player2);
              deletePellet(pellet)
            }
            pellet.color = "white";
          }
        })
      });
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
  ghosts.forEach((g) => { g.position = { x: GHOST_START_X, y: GHOST_START_Y } })
}

const resetButton = document.querySelector('#start-button');

fromEvent(resetButton, 'click')
  .pipe(
    tap(() => reset())
  ).subscribe();