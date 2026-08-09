const showcaseSamples = [
  {
    id: "01",
    title: "Feeling stuck",
    category: "Emotional support",
    kind: "Spoken Hokkien input",
    prompt: "“I feel very sian. Life has no meaning.”",
    note: "A request for comfort when someone feels stuck.",
  },
  {
    id: "02",
    title: "A low mood",
    category: "Emotional support",
    kind: "Spoken Hokkien input",
    prompt: "“My mood is very low today.”",
    note: "A conversational check-in and request for reassurance.",
  },
  {
    id: "03",
    title: "Angry—play a song",
    category: "Mood-aware help",
    kind: "Spoken Hokkien input",
    prompt: "“I’m very angry. Can you recommend a song?”",
    note: "A practical recommendation inside an emotionally charged prompt.",
  },
  {
    id: "04",
    title: "Birthday pronunciation",
    category: "Language learning",
    kind: "Spoken Hokkien input",
    prompt: "“How do I pronounce ‘happy birthday’?”",
    note: "An example of spoken pronunciation help.",
  },
  {
    id: "05",
    title: "Ask for leave",
    category: "Writing help",
    kind: "Spoken Hokkien input",
    prompt: "“Help me write an email to ask for leave.”",
    note: "Turning a spoken request into practical workplace help.",
  },
  {
    id: "06",
    title: "Start a business",
    category: "Idea generation",
    kind: "Spoken Hokkien input",
    prompt: "“I want to start a business. What would you recommend?”",
    note: "Open-ended brainstorming in a familiar spoken language.",
  },
  {
    id: "07",
    title: "Tell me a joke",
    category: "Conversation",
    kind: "Spoken Hokkien input",
    prompt: "“Can you tell me a joke?”",
    note: "A lightweight test of conversational response generation.",
  },
  {
    id: "08",
    title: "Feeling bothered",
    category: "Everyday advice",
    kind: "Spoken Hokkien input",
    prompt: "“I’ve been very bothered lately. How can I feel less bothered?”",
    note: "Supportive, open-ended everyday advice.",
  },
  {
    id: "09",
    title: "A cheaper haircut",
    category: "Local practical help",
    kind: "Spoken Hokkien input",
    prompt: "“Where nearby can I get a cheaper haircut?”",
    note: "A hyperlocal request; factual usefulness still depends on access to current information.",
  },
  {
    id: "10",
    title: "From text to Hokkien",
    category: "Text instruction",
    kind: "English text input",
    prompt: "“Draft an email for me to request a day off at work.”",
    note: "Text input is supported too; the answer is still spoken in Hokkien.",
  },
].map((sample) => ({
  ...sample,
  input: sample.id === "10" ? null : `./assets/showcase/${sample.id}/input.wav`,
  native: `./assets/showcase/${sample.id}/native.wav`,
  gptaudio: `./assets/showcase/${sample.id}/gptaudio.wav`,
  qwen: `./assets/showcase/${sample.id}/qwen.wav`,
  gemini: `./assets/showcase/${sample.id}/gemini.wav`,
  glmvoice: `./assets/showcase/${sample.id}/glmvoice.wav`,
}));

const showcaseState = {
  selected: 0,
  activeAudio: null,
};

const showcaseList = document.querySelector("[data-showcase-list]");
const showcaseDetail = document.querySelector("[data-showcase-detail]");
const sourceRegion = document.querySelector("[data-source-audio]");
const responseRegion = document.querySelector("[data-response-pair]");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

function makeWaveform(target, count, seed) {
  let value = seed * 104729;
  for (let index = 0; index < count; index += 1) {
    value = (value * 48271) % 2147483647;
    const rhythm = Math.sin(index * 0.42) * 0.2 + Math.sin(index * 0.12) * 0.17;
    const random = (value / 2147483647) * 0.56;
    const bar = document.createElement("span");
    const height = Math.max(8, Math.min(96, (0.22 + random + rhythm) * 100));
    bar.style.setProperty("--height", `${height}%`);
    target.appendChild(bar);
  }
}

document.querySelectorAll(".signal-wave").forEach((wave, index) => {
  makeWaveform(wave, 24, index + 71);
});

function pauseActiveAudio(nextAudio) {
  if (showcaseState.activeAudio && showcaseState.activeAudio !== nextAudio) {
    showcaseState.activeAudio.pause();
  }
  showcaseState.activeAudio = nextAudio;
}

function createAudioPlayer(src, label, seed, featured = false) {
  const wrapper = document.createElement("div");
  wrapper.className = "audio-player";

  const button = document.createElement("button");
  button.className = "play-button";
  button.type = "button";
  button.setAttribute("aria-label", `Play ${label}`);
  button.innerHTML = '<span aria-hidden="true">▶</span>';

  const main = document.createElement("div");
  main.className = "player-main";
  main.setAttribute("role", "button");
  main.tabIndex = 0;
  main.setAttribute("aria-label", `Seek through ${label}`);

  const wave = document.createElement("div");
  wave.className = "waveform";
  wave.setAttribute("aria-hidden", "true");
  makeWaveform(wave, 64, seed);

  const seek = document.createElement("div");
  seek.className = "seek-track";
  seek.setAttribute("aria-hidden", "true");
  const progress = document.createElement("span");
  seek.appendChild(progress);
  main.append(wave, seek);

  const time = document.createElement("time");
  time.className = "player-time";
  time.textContent = "00:00 / 00:00";

  const audio = document.createElement("audio");
  audio.preload = "metadata";
  audio.src = src;

  const seekToPointer = (event) => {
    if (!audio.duration) return;
    const bounds = main.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    audio.currentTime = ratio * audio.duration;
  };

  button.addEventListener("click", () => {
    pauseActiveAudio(audio);
    if (audio.paused) audio.play();
    else audio.pause();
  });
  main.addEventListener("click", seekToPointer);
  main.addEventListener("keydown", (event) => {
    if (!audio.duration || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + (event.key === "ArrowRight" ? 5 : -5)));
  });
  audio.addEventListener("play", () => {
    button.querySelector("span").textContent = "Ⅱ";
    wrapper.classList.add("is-playing");
  });
  audio.addEventListener("pause", () => {
    button.querySelector("span").textContent = "▶";
    wrapper.classList.remove("is-playing");
  });
  audio.addEventListener("loadedmetadata", () => {
    time.textContent = `00:00 / ${formatTime(audio.duration)}`;
  });
  audio.addEventListener("timeupdate", () => {
    const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
    progress.style.width = `${ratio * 100}%`;
    time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  });
  audio.addEventListener("ended", () => { audio.currentTime = 0; });

  if (featured) wrapper.dataset.featured = "true";
  wrapper.append(button, main, time, audio);
  return wrapper;
}

function renderShowcaseList() {
  if (!showcaseList) return;
  showcaseList.innerHTML = "";
  showcaseSamples.forEach((sample, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = `showcase-button${index === showcaseState.selected ? " is-active" : ""}`;
    button.setAttribute("aria-pressed", String(index === showcaseState.selected));

    const number = document.createElement("span");
    number.className = "showcase-number";
    number.textContent = sample.id;
    const copy = document.createElement("span");
    copy.className = "showcase-button-copy";
    const title = document.createElement("strong");
    title.textContent = sample.title;
    const category = document.createElement("small");
    category.textContent = sample.category;
    copy.append(title, category);
    const arrow = document.createElement("span");
    arrow.className = "showcase-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = index === showcaseState.selected ? "→" : "";
    button.append(number, copy, arrow);
    button.addEventListener("click", () => selectSample(index));
    item.appendChild(button);
    showcaseList.appendChild(item);
  });
}

function createResponseRow(name, note, src, seed, featured = false) {
  const row = document.createElement("section");
  row.className = `response-row${featured ? " is-native" : ""}`;
  const heading = document.createElement("div");
  heading.className = "response-name";
  const strong = document.createElement("strong");
  strong.textContent = name;
  const description = document.createElement("span");
  description.textContent = note;
  heading.append(strong, description);
  row.append(heading, createAudioPlayer(src, `${name} response`, seed, featured));
  return row;
}

function renderShowcaseDetail() {
  if (!showcaseDetail || !sourceRegion || !responseRegion) return;
  showcaseState.activeAudio?.pause();
  showcaseState.activeAudio = null;
  const sample = showcaseSamples[showcaseState.selected];

  showcaseDetail.querySelector(".showcase-kind").textContent = sample.kind;
  showcaseDetail.querySelector(".showcase-count").textContent = `${sample.id} / ${String(showcaseSamples.length).padStart(2, "0")}`;
  showcaseDetail.querySelector(".showcase-prompt h3").textContent = sample.prompt;
  showcaseDetail.querySelector(".prompt-note").textContent = sample.note;

  sourceRegion.innerHTML = "";
  if (sample.input) {
    sourceRegion.appendChild(createAudioPlayer(sample.input, `${sample.title} source prompt`, Number(sample.id) + 40));
  }

  responseRegion.innerHTML = "";
  responseRegion.append(
    createResponseRow("Myna-Hokkien", "This open-source release", sample.native, Number(sample.id) * 11 + 1, true),
    createResponseRow("GPT Audio", "External comparison", sample.gptaudio, Number(sample.id) * 11 + 2),
    createResponseRow("Qwen3.5-Omni-Plus", "External comparison", sample.qwen, Number(sample.id) * 11 + 3),
    createResponseRow("Gemini", "External comparison", sample.gemini, Number(sample.id) * 11 + 4),
    createResponseRow("GLM-Voice", "External comparison", sample.glmvoice, Number(sample.id) * 11 + 5)
  );
}

function selectSample(index) {
  showcaseState.selected = index;
  renderShowcaseList();
  renderShowcaseDetail();
}

const header = document.querySelector("[data-header]");
const progressBar = document.querySelector(".page-progress span");
function handleScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}
window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  siteNav?.classList.toggle("is-open", !open);
});
siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  });
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealItems = document.querySelectorAll(".article-section .article-copy, .showcase-workspace, .listen-key");
  revealItems.forEach((item) => item.classList.add("reveal"));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -45px" });
  revealItems.forEach((item) => observer.observe(item));
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
renderShowcaseList();
renderShowcaseDetail();
