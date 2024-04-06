import { Game } from "./Game";

const canvas = document.querySelector<HTMLCanvasElement>("#cnvs");
const input = document.querySelector<HTMLInputElement>("#input");
if (canvas && input) {
  const game = new Game(canvas);

  window.addEventListener("keypress", (event) => {
    if (event.key === "r") game.run(+input.value || 2000);
  });
}
