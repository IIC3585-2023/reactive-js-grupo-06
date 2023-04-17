const { fromEvent, from } = rxjs;
const { map, mapTo, filter, tap } = rxjs.operators;
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
  GAME_TIME,
} from './constants.js';

const canvas2 = document.getElementById("game-canvas");
const ctx = canvas2.getContext("2d");
canvas2.width = innerWidth;
canvas2.height = innerHeight;


function subscribePlayerMovement(player) {
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
  // Cuando se presiona una tecla, si deberia ser un movimiento valido
  // Evitamos que mueva la pantalla, y seteamos en moves$ el diccionario de la velocidad correspondiente.
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
  // moves$ guarda el valor de multiples teclas presionadas a la vez para manejarlas juntas.
  // Seteamos la velocidad del jugador
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

// Suscribimos a los jugadores a los eventos de teclas.
subscribePlayerMovement(player1)
subscribePlayerMovement(player2)

// Se crean los pellets y los fantasmas
const pellets = drawMap();
const ghosts = createGhosts();

let timerStart = Date.now();

// GAME LOOP
// El juego se desarrolla en un loop infinito con logica en cada frame
interval(INTERVAL_RATE)
  .pipe(
    // Borramos los elementos del canvas para re dibujar el nuevo estado
    filter(() => Math.round(((GAME_TIME - (Date.now() - timerStart))/1000) * 100) / 100 >= 0),
    filter(() => !player1.movementSubscription.closed || !player2.movementSubscription.closed), 
    tap(() => {
      document.querySelector(`#game-time`).innerText = Math.round(((GAME_TIME - (Date.now() - timerStart))/1000) * 100) / 100;
      ctx.clearRect(0, 0, canvas2.width, canvas2.height);
      if (!player1.movementSubscription.closed) { player1.move() }
      if (!player2.movementSubscription.closed) { player2.move() }
      ghosts.forEach((ghost) => {
        ghost.update();
        ghost.changeDirection();
        if (collisionWithGhost(player1, ghost)) {
          console.log("player 1 died");
          player1.movementSubscription.unsubscribe();
          player1.velocity = { x: 0, y: 0 };
        }
        if (collisionWithGhost(player2, ghost)) {
          console.log("player 2 died");
          player2.movementSubscription.unsubscribe();
          player2.velocity = { x: 0, y: 0 };
        }
      });

      // Para solo los pellets que estan vivos, los re dibujamos
      from(pellets)
        .pipe(
          filter(pellet => pellet.alive),
          tap(pellet => pellet.update()),
          // Si un jugador colisiona con un pelet lo cambia de color
          tap(pellet => {
            if (collisionWithPellet(player1, pellet)) { pellet.color = player1.color }
            if (collisionWithPellet(player2, pellet)) { pellet.color = player2.color }
          }),
          // Para los pellets, filtramos los que tienen colision con fantasmas, y si tienen otro color
          // se elimina el pellet y si asigna el puntaje.
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

// Se reinicia al estado inicial del juego.
function reset() {
  pellets.forEach((p) => { p.alive = true; p.color = 'white' })
  player1.score = 0;
  player2.score = 0;
  document.querySelector(`#p1-score`).innerText = 0;
  document.querySelector(`#p2-score`).innerText = 0;
  resetTimer();
  player1.position = { x: PLAYER_1_START_X, y: PLAYER_1_START_Y };
  player2.position = { x: PLAYER_2_START_X, y: PLAYER_2_START_Y };
  player1.velocity = { x: 0, y: 0 };
  player2.velocity = { x: 0, y: 0 };
  subscribePlayerMovement(player1)
  subscribePlayerMovement(player2)
  ghosts.forEach((g) => { g.position = { x: GHOST_START_X, y: GHOST_START_Y } })
}

const resetButton = document.querySelector('#start-button');

// Conectamos la funcion con un un boton del front.
fromEvent(resetButton, 'click')
  .pipe(
    tap(() => reset())
  ).subscribe();

function resetTimer() {
  timerStart = Date.now();
  document.querySelector(`#game-time`).innerText = Math.round((GAME_TIME/1000) * 100) / 100;
}