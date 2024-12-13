fetch("assets/data/game.pde").then((r) => r.text().then(addGameScript));

const addGameScript = (script) => {
  const el = document.createElement("script");
  el.type = "text/processing";
  el.innerHTML = script;
  document.getElementById("sketchContainer").prepend(el);

  window.Processing.reload();
};

// document.getElementById("resetBtn").addEventListener("click", () => {
//   if ("Processing" in window) {
//     window.Processing.reload();
//   }
// });
