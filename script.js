// ======================
// ARIE VALENTINE SCRIPT
// (includes ALL fixes we made)
// - consent action capture fix ✅
// - photo next/prev counter + cache-bust ✅
// - meme cycling + fallback ✅
// - localStorage saved progress ✅
// ======================

const SECRET_PHRASE = "mamas"; // change if you want

// ✅ YOUR REAL FILES (matching case/spaces/extensions)
const PHOTOS = [
  { src: "assets/photos/photo 1.jpg", caption: "pretty girl energy 🖤" },
  { src: "assets/photos/photo 2.jpg", caption: "my favorite view." },
];

// You have spicy 1–10, but I see your list starts at spicy 1 and includes 2–10.
// We'll include all 1–10 so next/prev actually cycles.
const PRIVATE_PHOTOS = [
  { src: "assets/photos/spicy 1.jpg", caption: "for your eyes only 😌" },
  { src: "assets/photos/spicy 2.jpg", caption: "don’t act shy now." },
  { src: "assets/photos/spicy 3.jpg", caption: "i love you bad 🖤" },
  { src: "assets/photos/spicy 4.jpg", caption: "come closer." },
  { src: "assets/photos/spicy 5.jpg", caption: "yeah… this is yours." },
  { src: "assets/photos/spicy 6.jpg", caption: "locked in." },
  { src: "assets/photos/spicy 7.jpg", caption: "mamas please 😭" },
  { src: "assets/photos/spicy 8.jpg", caption: "you + me = trouble." },
  { src: "assets/photos/spicy 9.jpg", caption: "don’t blink." },
  { src: "assets/photos/spicy 10.jpg", caption: "okay… last one 😌" },
];

// You have ONE video: "spicy vid.mp4"
const PRIVATE_VIDEOS = [
  { src: "assets/video/spicy vid.mp4", caption: "press play when you’re alone 🖤" },
];

// Audio: your file is named "Arie note 2" (extension not shown in screenshot).
// Try .m4a first — if it doesn’t play, rename/convert to .mp3 and change this line.
const VOICE_NOTE = "assets/audio/Arie note 2.m4a";

// Memes: meme_01.JPG → meme_08.JPG (uppercase .JPG)
const MEMES = [
  { src: "assets/memes/meme_01.JPG", caption: "me when you text me back 😭" },
  { src: "assets/memes/meme_02.JPG", caption: "when you call me mamas" },
  { src: "assets/memes/meme_03.JPG", caption: "when you roll over in bed  and i see your boobies" },
  { src: "assets/memes/meme_04.JPG", caption: "I CHOOSE U" },
  { src: "assets/memes/meme_05.JPG", caption: "come here 🖤" },
  { src: "assets/memes/meme_06.JPG", caption: "no thoughts. just you." },
  { src: "assets/memes/meme_07.JPG", caption: "YOU'RE SOOOO PRETTYYY" },
  { src: "assets/memes/meme_08.JPG", caption: "I LOVE YOU GIRLLLL" },
];

// ---------- STORAGE KEYS ----------
const K = {
  PRIVATE_UNLOCKED: "arie_private_unlocked",
  PHOTOS_OPENED: "arie_photos_opened",
  VIDEO_PLAYED: "arie_video_played",
  AUDIO_PLAYED: "arie_audio_played",
};

// ---------- HELPERS ----------
function normalize(s){
  return (s || "").toLowerCase().replace(/\s+/g," ").trim();
}
function setFlag(key, val=true){ localStorage.setItem(key, val ? "1" : "0"); }
function getFlag(key){ return localStorage.getItem(key) === "1"; }

// ---------- SCREENS ----------
const screens = {
  intro: document.getElementById("screenIntro"),
  note: document.getElementById("screenNote"),
  ask: document.getElementById("screenAsk"),
  hub: document.getElementById("screenPrivateHub"),
  photos: document.getElementById("screenPhotos"),
  videos: document.getElementById("screenVideos"),
};

function showOnly(screenEl){
  Object.values(screens).forEach(el => el.classList.remove("active"));
  screenEl.classList.add("active");
  window.scrollTo(0,0);
}

// nav
document.getElementById("btnStart").addEventListener("click", () => showOnly(screens.note));
document.getElementById("btnToAsk").addEventListener("click", () => showOnly(screens.ask));
document.getElementById("btnToPrivate").addEventListener("click", () => showOnly(screens.hub));
document.getElementById("btnBackHome").addEventListener("click", () => showOnly(screens.ask));

// ---------- VALENTINE ASK ----------
const revealAskBtn = document.getElementById("revealAskBtn");
const askBlock = document.getElementById("askBlock");
const preAskLine = document.getElementById("preAskLine");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const yesMsg = document.getElementById("yesMsg");

let yesClicks = 0;
let noDodges = 0;

revealAskBtn.addEventListener("click", () => {
  preAskLine.textContent = "okay… don’t laugh 😭";
  askBlock.style.display = "block";
  revealAskBtn.style.display = "none";
});

yesBtn.addEventListener("click", () => {
  yesClicks++;
  yesMsg.style.display = "block";
  const lines = [
    "YAY 🖤 i’m smiling so hard.",
    "okay wait… you’re sure?? 🥺",
    "i love you. like… a lot.",
    "locked in 😈"
  ];
  yesMsg.textContent = lines[Math.min(yesClicks - 1, lines.length - 1)];
  yesBtn.style.transform = `scale(${1 + Math.min(yesClicks, 6) * 0.03})`;
});

function rand(min, max){ return Math.random() * (max - min) + min; }
function moveNoButton(){
  const pad = 10;
  const bw = noBtn.offsetWidth, bh = noBtn.offsetHeight;
  const maxX = window.innerWidth - bw - pad;
  const maxY = window.innerHeight - bh - pad;

  const x = rand(pad, Math.max(pad, maxX));
  const y = rand(pad + 80, Math.max(pad + 80, maxY));

  noBtn.style.position = "fixed";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.zIndex = 9999;
}

noBtn.addEventListener("pointerenter", () => {
  noDodges++;
  moveNoButton();
  if(noDodges === 3) preAskLine.textContent = "are you sureeee? 😌";
  if(noDodges === 6) preAskLine.textContent = "okay the no button is shy.";
  if(noDodges === 9) { preAskLine.textContent = "no left the chat 😈"; noBtn.style.display = "none"; }
});

// ---------- PRIVATE HUB ----------
const phraseInput = document.getElementById("phraseInput");
const phraseBtn = document.getElementById("phraseBtn");
const phraseMsg = document.getElementById("phraseMsg");
const privateButtons = document.getElementById("privateButtons");

const btnPhotos = document.getElementById("btnPhotos");
const btnVideos = document.getElementById("btnVideos");
const btnAudio  = document.getElementById("btnAudio");

const statusPhotos = document.getElementById("statusPhotos");
const statusVideos = document.getElementById("statusVideos");
const statusAudio  = document.getElementById("statusAudio");

function renderHub(){
  const unlocked = getFlag(K.PRIVATE_UNLOCKED);
  privateButtons.style.display = unlocked ? "block" : "none";

  btnPhotos.disabled = !unlocked;
  btnVideos.disabled = !unlocked;
  btnAudio.disabled  = !unlocked;

  statusPhotos.textContent = getFlag(K.PHOTOS_OPENED) ? "✅" : (unlocked ? "🔓" : "🔒");
  statusVideos.textContent = getFlag(K.VIDEO_PLAYED) ? "✅" : (unlocked ? "🔓" : "🔒");
  statusAudio.textContent  = getFlag(K.AUDIO_PLAYED) ? "✅" : (unlocked ? "🔓" : "🔒");
}

function unlockPrivate(){
  setFlag(K.PRIVATE_UNLOCKED, true);
  phraseMsg.textContent = "okay… come here 🖤";
  renderHub();
}

phraseBtn.addEventListener("click", () => {
  const v = normalize(phraseInput.value);
  if (v === normalize(SECRET_PHRASE)) unlockPrivate();
  else phraseMsg.textContent = "mm… not quite. try again.";
});

phraseInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") phraseBtn.click();
});

// ---------- CONSENT MODAL (FIXED) ----------
const consentModal = document.getElementById("consentModal");
const consentYes = document.getElementById("consentYes");
const consentNo  = document.getElementById("consentNo");

let consentAction = null;

function openConsent(nextFn){
  consentAction = nextFn;
  consentModal.style.display = "flex";
}
function closeConsent(){
  consentModal.style.display = "none";
  consentAction = null;
}

consentYes.addEventListener("click", () => {
  const next = consentAction; // ✅ capture BEFORE close
  closeConsent();
  if (typeof next === "function") next();
});

consentNo.addEventListener("click", () => {
  closeConsent();
  showOnly(screens.hub);
});

consentModal.addEventListener("click", (e) => {
  if (e.target === consentModal) {
    closeConsent();
    showOnly(screens.hub);
  }
});

// ---------- PHOTOS ----------
const photoEl = document.getElementById("spicyPhoto");
const capEl = document.getElementById("spicyCaption");
const prevBtn = document.getElementById("prevPhoto");
const nextBtn = document.getElementById("nextPhoto");
const backPhotos = document.getElementById("btnPhotosBack");
const panicPhotos = document.getElementById("btnPanicFromPhotos");

let photoIndex = 0;

// Use private photos as the spicy gallery; if empty, fallback to normal photos
const ACTIVE_PHOTOS = PRIVATE_PHOTOS.length ? PRIVATE_PHOTOS : PHOTOS;

function renderPhoto(){
  const item = ACTIVE_PHOTOS[photoIndex];
  capEl.textContent = `${item.caption || ""}  (${photoIndex + 1}/${ACTIVE_PHOTOS.length})`;
  photoEl.src = item.src + `?v=${Date.now()}`; // ✅ cache-bust so it visibly changes
  photoEl.onerror = () => {
    console.warn("photo failed:", item.src);
    capEl.textContent = "couldn’t load this file — check the exact filename/case.";
  };
}

function openPhotos(){
  setFlag(K.PHOTOS_OPENED, true);
  renderHub();
  showOnly(screens.photos);
  renderPhoto();
}

prevBtn.addEventListener("click", () => {
  photoIndex = (photoIndex - 1 + ACTIVE_PHOTOS.length) % ACTIVE_PHOTOS.length;
  renderPhoto();
});

nextBtn.addEventListener("click", () => {
  photoIndex = (photoIndex + 1) % ACTIVE_PHOTOS.length;
  renderPhoto();
});

backPhotos.addEventListener("click", () => showOnly(screens.hub));
panicPhotos.addEventListener("click", () => showOnly(screens.ask));

// ---------- VIDEOS ----------
const btnVid1 = document.getElementById("btnVid1");
const btnVid2 = document.getElementById("btnVid2");
const videoPlayer = document.getElementById("videoPlayer");
const videoCaption = document.getElementById("videoCaption");
const backVideos = document.getElementById("btnVideosBack");
const panicVideos = document.getElementById("btnPanicFromVideos");

function loadVideo(i){
  const item = PRIVATE_VIDEOS[i];
  videoPlayer.src = item.src;
  videoCaption.textContent = item.caption || "";
}

function openVideos(){
  showOnly(screens.videos);
  loadVideo(0);
}

// You only have 1 video → hide video 2 button automatically
if (PRIVATE_VIDEOS.length < 2) {
  btnVid2.style.display = "none";
  btnVid1.textContent = "spicy vid";
}

btnVid1.addEventListener("click", () => loadVideo(0));
btnVid2.addEventListener("click", () => {
  if (PRIVATE_VIDEOS.length >= 2) loadVideo(1);
});

videoPlayer.addEventListener("play", () => {
  setFlag(K.VIDEO_PLAYED, true);
  renderHub();
});

backVideos.addEventListener("click", () => {
  videoPlayer.pause();
  showOnly(screens.hub);
});

panicVideos.addEventListener("click", () => {
  videoPlayer.pause();
  showOnly(screens.ask);
});

// ---------- AUDIO ----------
const audioModal = document.getElementById("audioModal");
const audioPlayer = document.getElementById("audioPlayer");
const audioClose = document.getElementById("audioClose");

function openAudio(){
  audioPlayer.src = VOICE_NOTE;
  audioModal.style.display = "flex";
}
function closeAudio(){
  audioPlayer.pause();
  audioModal.style.display = "none";
}

audioPlayer.addEventListener("play", () => {
  setFlag(K.AUDIO_PLAYED, true);
  renderHub();
});

audioClose.addEventListener("click", closeAudio);
audioModal.addEventListener("click", (e) => {
  if (e.target === audioModal) closeAudio();
});

// hub buttons (with consent)
btnPhotos.addEventListener("click", () => openConsent(openPhotos));
btnVideos.addEventListener("click", () => openConsent(openVideos));
btnAudio.addEventListener("click", openAudio);

// ---------- MEMES (cycling + fallback) ----------
const memeBtn = document.getElementById("memeBtn");
const memeModal = document.getElementById("memeModal");
const memeImg = document.getElementById("memeImg");
const memeCap = document.getElementById("memeCap");
const memeNext = document.getElementById("memeNext");
const memeClose = document.getElementById("memeClose");

let memeIndex = 0;

function showMemeAt(i){
  if (!MEMES.length) return;
  memeIndex = (i + MEMES.length) % MEMES.length;
  const pick = MEMES[memeIndex];

  memeImg.src = pick.src + `?v=${Date.now()}`; // ✅ cache-bust
  memeCap.textContent = `${pick.caption || ""}  (${memeIndex + 1}/${MEMES.length})`;
  memeModal.style.display = "flex";

  memeImg.onerror = () => {
    console.warn("meme failed:", pick.src);
    showMemeAt(memeIndex + 1);
  };
}

function openMeme(){
  const start = Math.floor(Math.random() * MEMES.length);
  showMemeAt(start);
}
function nextMeme(){ showMemeAt(memeIndex + 1); }
function closeMeme(){ memeModal.style.display = "none"; }

memeBtn.addEventListener("click", openMeme);
memeNext.addEventListener("click", nextMeme);
memeClose.addEventListener("click", closeMeme);

memeModal.addEventListener("click", (e) => {
  if (e.target === memeModal) closeMeme();
});

// ---------- INIT ----------
renderHub();
