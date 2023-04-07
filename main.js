const { fromEvent } = rxjs;
const { map, debounceTime } = rxjs.operators;

const inputField = document.getElementById("input-field");
const displayText = document.getElementById("display-text");

const inputObservable = fromEvent(inputField, "input").pipe(
  map((event) => event.target.value),
  debounceTime(300)
);

inputObservable.subscribe((text) => {
  displayText.textContent = text;
});