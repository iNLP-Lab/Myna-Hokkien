const comparisonModels = [
  ["gptaudio", "GPT Audio"],
  ["qwen", "Qwen3.5-Omni-Plus"],
  ["gemini", "Gemini Live"],
  ["glmvoice", "GLM-Voice"],
];

document.querySelectorAll(".demo[data-comparison]").forEach((demo) => {
  const exampleId = demo.querySelector("header > span")?.textContent.trim();
  const sourceId = demo.dataset.sourceId;
  if (!exampleId || !sourceId) return;
  const output = demo.querySelector(".turn.output");
  if (!output) return;

  const details = document.createElement("details");
  details.className = "model-comparison";

  const summary = document.createElement("summary");
  summary.append("Other model outputs");
  const count = document.createElement("small");
  count.textContent = "4 audio clips";
  summary.appendChild(count);

  const table = document.createElement("table");
  table.setAttribute("aria-label", `Other model outputs for example ${exampleId}`);
  const body = document.createElement("tbody");

  comparisonModels.forEach(([fileName, label]) => {
    const row = document.createElement("tr");
    const heading = document.createElement("th");
    heading.scope = "row";
    heading.textContent = label;
    const cell = document.createElement("td");
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "none";
    audio.src = `./assets/showcase/${sourceId}/${fileName}.wav`;
    audio.setAttribute("aria-label", `${label} output for example ${exampleId}`);
    cell.appendChild(audio);
    row.append(heading, cell);
    body.appendChild(row);
  });

  table.appendChild(body);
  details.append(summary, table);
  output.appendChild(details);
});

const players = document.querySelectorAll("audio");

players.forEach((player) => {
  player.addEventListener("play", () => {
    players.forEach((other) => {
      if (other !== player) other.pause();
    });
  });
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
