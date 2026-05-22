const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

/* ---------- */
/* SCREEN */
/* ---------- */

const loadingScreen = document.getElementById("loadingScreen");
const titleScreen = document.getElementById("titleScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

/* ---------- */
/* LOADING UI */
/* ---------- */

const loadingFill = document.getElementById("loadingFill");
const loadingCount = document.getElementById("loadingCount");

/* ---------- */
/* BUTTON */
/* ---------- */

const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const homeBtn = document.getElementById("homeBtn");
const shareBtn = document.getElementById("shareBtn");
const backBtn = document.getElementById("backBtn");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const punchBtn = document.getElementById("punchBtn");
const dashBtn = document.getElementById("dashBtn");

/* ---------- */
/* HUD */
/* ---------- */

const playerHpEl = document.getElementById("playerHp");
const enemyHpEl = document.getElementById("enemyHp");
const timerEl = document.getElementById("timer");
const battleMessage = document.getElementById("battleMessage");
const enemyName = document.getElementById("enemyName");

/* ---------- */
/* RESULT */
/* ---------- */

const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const resultImage = document.getElementById("resultImage");

/* ---------- */
/* AUDIO */
/* ---------- */

const seSelect = new Audio("assets/se_select.mp3");
const sePunch = new Audio("assets/se_punch.mp3");
const seHit = new Audio("assets/se_hit.mp3");
const seFight = new Audio("assets/se_fight.mp3");
const seRound1 = new Audio("assets/se_round1.mp3");
const seRound2 = new Audio("assets/se_round2.mp3");
const seRound3 = new Audio("assets/se_round3.mp3");
const seWin = new Audio("assets/se_win.mp3");
const seLose = new Audio("assets/se_lose.mp3");

const bgm = new Audio();
bgm.loop = true;

seSelect.volume = 0.45;
sePunch.volume = 0.28;
seHit.volume = 0.42;
seFight.volume = 0.55;

seRound1.volume = 0.55;
seRound2.volume = 0.55;
seRound3.volume = 0.55;

seWin.volume = 0.6;
seLose.volume = 0.6;

bgm.volume = 0.32;

/* ---------- */
/* IMAGE */
/* ---------- */

const hippoSheet = new Image();
hippoSheet.src = "assets/hippo_sheet.png";

const stageImg = new Image();
const enemySheet = new Image();

/* ---------- */
/* STAGE */
/* ---------- */

const stages = [
  {
    name: "NASU",
    sprite: "assets/nasu_sheet.png",
    bg: "assets/stage_nasu.png",
    bgm: "assets/bgm_nasu.mp3"
  },
  {
    name: "TOMATO",
    sprite: "assets/tomato_sheet.png",
    bg: "assets/stage_tomato.png",
    bgm: "assets/bgm_tomato.mp3"
  },
  {
    name: "TOOTH",
    sprite: "assets/tooth_sheet.png",
    bg: "assets/stage_tooth.png",
    bgm: "assets/bgm_tooth.mp3"
  }
];

let stageIndex = 0;

/* ---------- */
/* SHEET */
/* ---------- */

const COLS = 4;
const ROWS = 3;
const SCALE = 0.38;
const GROUND_Y = 470;

const FRAME_DOWN = 8;
const FRAME_WIN = 11;

/* ---------- */
/* GAME */
/* ---------- */

let timer = 45;
let gameOver = true;
let battleActive = false;
let timerInterval = null;
let animCounter = 0;
let stopFrame = 0;
let dashCooldown = false;
let messageToken = 0;

/* ---------- */
/* PLAYER */
/* ---------- */

const player = {
  x: 40,
  y: GROUND_Y,
  hp: 100,
  facing: 1,
  attacking: false,
  special: false,
  hit: false,
  frame: 0,
  anim: "idle"
};

/* ---------- */
/* ENEMY */
/* ---------- */

const enemy = {
  x: 250,
  y: GROUND_Y,
  hp: 100,
  facing: -1,
  attacking: false,
  special: false,
  hit: false,
  frame: 0,
  anim: "idle",
  cooldown: 0
};

/* ---------- */
/* ANIMATION */
/* ---------- */

const animations = {
  idle: [0, 1],
  walk: [2, 3],
  attack: [5],
  special: [6],
  hit: [7],
  down: [FRAME_DOWN],
  win: [FRAME_WIN]
};

const keys = {
  left: false,
  right: false
};

/* ---------- */
/* SCREEN */
/* ---------- */

function showScreen(screen) {
  titleScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  resultScreen.classList.remove("active");

  const resultButtons = document.querySelector(".resultButtons");

  if (resultButtons) {
    resultButtons.classList.remove("show");
  }

  screen.classList.add("active");

  if (screen === resultScreen && resultButtons) {
    setTimeout(() => {
      resultButtons.classList.add("show");
    }, 1500);
  }
}

/* ---------- */
/* AUDIO HELPERS */
/* ---------- */

function playSe(se) {
  se.currentTime = 0;
  se.play().catch(() => {});
}

function stopBgm() {
  bgm.pause();
  bgm.currentTime = 0;
}

function startBgm() {
  bgm.currentTime = 0;
  bgm.play().catch(() => {});
}

/* ---------- */
/* LOADING */
/* ---------- */

const preloadList = [
  "assets/title.png",

  "assets/hippo_sheet.png",
  "assets/nasu_sheet.png",
  "assets/tomato_sheet.png",
  "assets/tooth_sheet.png",

  "assets/stage_nasu.png",
  "assets/stage_tomato.png",
  "assets/stage_tooth.png",

  "assets/result_win.png",
  "assets/result_lose.png",

  "assets/bgm_nasu.mp3",
  "assets/bgm_tomato.mp3",
  "assets/bgm_tooth.mp3",

  "assets/se_select.mp3",
  "assets/se_punch.mp3",
  "assets/se_hit.mp3",
  "assets/se_fight.mp3",
  "assets/se_round1.mp3",
  "assets/se_round2.mp3",
  "assets/se_round3.mp3",
  "assets/se_win.mp3",
  "assets/se_lose.mp3"
];

function updateLoadingProgress(done, total) {
  const percent = Math.floor((done / total) * 100);

  if (loadingFill) {
    loadingFill.style.width = percent + "%";
  }

  if (loadingCount) {
    loadingCount.textContent = `${percent}%`;
  }
}

function preloadAssets() {
  let loaded = 0;
  const total = preloadList.length;

  updateLoadingProgress(0, total);

  return Promise.all(
    preloadList.map(src => {
      return new Promise(resolve => {
        let finished = false;

        const finish = () => {
          if (finished) return;

          finished = true;
          loaded++;

          updateLoadingProgress(loaded, total);
          resolve();
        };

        if (src.endsWith(".mp3")) {
          const audio = new Audio();

          audio.src = src;
          audio.preload = "auto";

          audio.addEventListener("loadeddata", finish, { once: true });
          audio.addEventListener("canplay", finish, { once: true });
          audio.addEventListener("error", finish, { once: true });

          setTimeout(finish, 1200);

          audio.load();
        } else {
          const img = new Image();

          img.onload = finish;
          img.onerror = finish;

          img.src = src;
        }
      });
    })
  );
}

/* ---------- */
/* STAGE */
/* ---------- */

function loadStage() {
  const s = stages[stageIndex];

  enemyName.textContent = s.name;

  enemySheet.src = s.sprite;
  stageImg.src = s.bg;
  bgm.src = s.bgm;
}

/* ---------- */
/* START */
/* ---------- */

function startGame() {
  playSe(seSelect);

  stageIndex = 0;

  showScreen(gameScreen);

  resetGame();
}

/* ---------- */
/* RESET */
/* ---------- */

function resetGame() {
  loadStage();

  timer = 45;
  timerEl.textContent = timer;

  gameOver = false;
  battleActive = false;
  dashCooldown = false;

  player.hp = 100;
  enemy.hp = 100;

  player.x = 40;
  enemy.x = 250;

  player.facing = 1;
  enemy.facing = -1;

  player.attacking = false;
  enemy.attacking = false;

  player.special = false;
  enemy.special = false;

  player.hit = false;
  enemy.hit = false;

  player.frame = 0;
  enemy.frame = 0;

  player.anim = "idle";
  enemy.anim = "idle";

  enemy.cooldown = 80;

  keys.left = false;
  keys.right = false;

  updateBars();

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  stopBgm();

  const roundSe = [
    seRound1,
    seRound2,
    seRound3
  ][stageIndex];

  playSe(roundSe);

  showMessage(
    `ROUND ${stageIndex + 1}`,
    1200
  );

  setTimeout(() => {
    if (gameOver) return;

    playSe(seFight);

    showMessage(
      "FIGHT!!",
      900
    );
  }, 1300);

  setTimeout(() => {
    if (gameOver) return;

    battleActive = true;

    startBgm();

    timerInterval = setInterval(() => {
      if (!battleActive || gameOver) return;

      timer--;
      timerEl.textContent = timer;

      if (timer <= 0) {
        finishGame(false);
      }
    }, 1000);
  }, 2300);
}

/* ---------- */
/* MESSAGE */
/* ---------- */

function showMessage(text, duration) {
  messageToken++;

  const currentToken = messageToken;

  battleMessage.textContent = text;

  setTimeout(() => {
    if (
      currentToken === messageToken &&
      !gameOver
    ) {
      battleMessage.textContent = "";
    }
  }, duration);
}

/* ---------- */
/* DRAW */
/* ---------- */

function drawBackground() {
  if (!stageImg.complete) return;

  ctx.drawImage(
    stageImg,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

function drawCharacter(character, image, flip = false) {
  if (!image.complete) return;

  const frames = animations[character.anim];
  const frameIndex = frames[character.frame % frames.length];

  const frameW = image.width / COLS;
  const frameH = image.height / ROWS;

  const sx = (frameIndex % COLS) * frameW;
  const sy = Math.floor(frameIndex / COLS) * frameH;

  const drawW = frameW * SCALE;
  const drawH = frameH * SCALE;

  const drawX = character.x;
  const drawY = character.y - drawH;

  ctx.save();

  if (flip) {
    ctx.scale(-1, 1);

    ctx.drawImage(
      image,
      sx,
      sy,
      frameW,
      frameH,
      -drawX - drawW,
      drawY,
      drawW,
      drawH
    );
  } else {
    ctx.drawImage(
      image,
      sx,
      sy,
      frameW,
      frameH,
      drawX,
      drawY,
      drawW,
      drawH
    );
  }

  ctx.restore();
}

function updatePlayer() {
  if (
    gameOver ||
    !battleActive
  ) return;

  let moving = false;

  if (keys.left) {
    player.x -= 4;
    player.facing = -1;
    moving = true;
  }

  if (keys.right) {
    player.x += 4;
    player.facing = 1;
    moving = true;
  }

  player.x = Math.max(
    0,
    Math.min(
      canvas.width - 80,
      player.x
    )
  );

  if (
    moving &&
    !player.attacking &&
    !player.special &&
    !player.hit
  ) {
    player.anim = "walk";
  } else if (
    !player.attacking &&
    !player.special &&
    !player.hit
  ) {
    player.anim = "idle";
  }
}

function updateEnemy() {
  if (
    gameOver ||
    !battleActive
  ) return;

  if (enemy.cooldown > 0) {
    enemy.cooldown--;
  }

  const dist = player.x - enemy.x;
  const absDist = Math.abs(dist);

  if (absDist > 95) {
    enemy.x += dist > 0 ? 1.6 : -1.6;
    enemy.facing = dist > 0 ? 1 : -1;

    if (
      !enemy.attacking &&
      !enemy.hit
    ) {
      enemy.anim = "walk";
    }
  } else {
    enemy.facing = dist > 0 ? 1 : -1;

    if (
      !enemy.attacking &&
      !enemy.hit &&
      enemy.cooldown <= 0
    ) {
      if (Math.random() < 0.04) {
        enemyAttack();
        enemy.cooldown = 70;
      }
    }

    if (
      !enemy.hit &&
      !enemy.attacking
    ) {
      enemy.anim = "idle";
    }
  }
}

function attackHit(attacker, target, damage, knock) {
  const dist = Math.abs(attacker.x - target.x);

  if (dist < 108) {
    playSe(seHit);

    target.hp -= damage;

    target.hp = Math.max(
      0,
      target.hp
    );

    target.hit = true;
    target.anim = "hit";

    target.x += attacker.facing * knock;

    updateBars();

    setTimeout(() => {
      target.hit = false;

      if (
        target.hp > 0 &&
        !gameOver
      ) {
        target.anim = "idle";
      }
    }, 240);

    if (target.hp <= 0) {
      target.anim = "down";

      finishGame(
        attacker === player
      );
    }
  }
}

function playerPunch() {
  if (
    player.attacking ||
    player.special ||
    gameOver ||
    !battleActive
  ) return;

  playSe(sePunch);

  player.attacking = true;
  player.anim = "attack";

  setTimeout(() => {
    attackHit(
      player,
      enemy,
      6,
      15
    );
  }, 110);

  setTimeout(() => {
    player.attacking = false;

    if (!gameOver) {
      player.anim = "idle";
    }
  }, 420);
}

function playerDash() {
  if (
    dashCooldown ||
    player.attacking ||
    player.special ||
    gameOver ||
    !battleActive
  ) return;

  dashCooldown = true;

  player.special = true;
  player.anim = "special";

  const rush = setInterval(() => {
    player.x += player.facing * 12;
  }, 16);

  setTimeout(() => {
    clearInterval(rush);

    attackHit(
      player,
      enemy,
      22,
      42
    );
  }, 180);

  setTimeout(() => {
    player.special = false;

    if (!gameOver) {
      player.anim = "idle";
    }
  }, 520);

  setTimeout(() => {
    dashCooldown = false;
  }, 3000);
}

function enemyAttack() {
  if (
    enemy.attacking ||
    enemy.hit ||
    gameOver ||
    !battleActive
  ) return;

  enemy.attacking = true;
  enemy.anim = "attack";

  setTimeout(() => {
    attackHit(
      enemy,
      player,
      8,
      18
    );
  }, 130);

  setTimeout(() => {
    enemy.attacking = false;

    if (!gameOver) {
      enemy.anim = "idle";
    }
  }, 430);
}

function updateBars() {
  playerHpEl.style.width = player.hp + "%";
  enemyHpEl.style.width = enemy.hp + "%";
}

function finishGame(win) {
  if (gameOver) return;

  gameOver = true;
  battleActive = false;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  stopBgm();

  if (win) {
    player.anim = "win";
    enemy.anim = "down";

    playSe(seWin);

    setTimeout(() => {
      stageIndex++;

      if (stageIndex >= stages.length) {
        resultTitle.textContent =
          "ALL CLEAR!!";

        resultText.textContent =
          "全3ステージクリア！";

        resultImage.src =
          "assets/result_win.png";

        showScreen(resultScreen);
      } else {
        resetGame();
      }
    }, 2200);
  } else {
    player.anim = "down";
    enemy.anim = "win";

    playSe(seLose);

    resultTitle.textContent =
      "YOU LOSE...";

    resultText.textContent =
      `STAGE ${stageIndex + 1}`;

    resultImage.src =
      "assets/result_lose.png";

    setTimeout(() => {
      showScreen(resultScreen);
    }, 2000);
  }
}

function gameLoop() {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  if (
    gameScreen.classList.contains("active")
  ) {
    if (stopFrame > 0) {
      stopFrame--;
    } else {
      updatePlayer();
      updateEnemy();

      animCounter++;

      if (animCounter % 18 === 0) {
        player.frame++;
        enemy.frame++;
      }
    }

    drawBackground();

    drawCharacter(
      player,
      hippoSheet,
      player.facing === -1
    );

    drawCharacter(
      enemy,
      enemySheet,
      enemy.facing === -1
    );
  }

  requestAnimationFrame(gameLoop);
}

function bindHoldButton(btn, key) {

  btn.addEventListener(
    "touchstart",
    e => {
      e.preventDefault();
      e.stopPropagation();

      keys[key] = true;
    },
    { passive: false }
  );

  btn.addEventListener(
    "touchend",
    e => {
      e.preventDefault();
      e.stopPropagation();

      keys[key] = false;
    },
    { passive: false }
  );

  btn.addEventListener(
    "touchcancel",
    e => {
      e.preventDefault();
      e.stopPropagation();

      keys[key] = false;
    },
    { passive: false }
  );

  btn.addEventListener(
    "click",
    e => {
      e.preventDefault();
      e.stopPropagation();
    },
    { passive: false }
  );

  btn.addEventListener(
    "mousedown",
    e => {
      e.preventDefault();
      e.stopPropagation();

      keys[key] = true;
    }
  );

  btn.addEventListener(
    "mouseup",
    e => {
      e.preventDefault();
      e.stopPropagation();

      keys[key] = false;
    }
  );

  btn.addEventListener(
    "mouseleave",
    () => {
      keys[key] = false;
    }
  );
}

bindHoldButton(leftBtn, "left");
bindHoldButton(rightBtn, "right");

punchBtn.addEventListener("click", playerPunch);
dashBtn.addEventListener("click", playerDash);

startBtn.addEventListener("click", startGame);

document
  .getElementById("titleLogo")
  .addEventListener("click", startGame);

retryBtn.addEventListener(
  "click",
  () => {
    playSe(seSelect);

    stageIndex = 0;

    stopBgm();

    showScreen(titleScreen);
  }
);

homeBtn.addEventListener(
  "click",
  () => {
    location.href =
      "https://afoolhippo.github.io/home/?skipTitle=1";
  }
);

backBtn.addEventListener(
  "click",
  () => {
    gameOver = true;
    battleActive = false;

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    stopBgm();

    showScreen(titleScreen);
  }
);

shareBtn.addEventListener(
  "click",
  () => {
    let text = "";

    if (stageIndex >= stages.length) {
      text =
`カバ、全員ぶっとばした！🦛🥊🍆🍅🦷
ALL CLEAR!!
無料ブラウザゲーム「カバファイト」
https://afoolhippo.github.io/game14/
#カバファイト #カバゲーセン`;
    } else {
      text =
`カバ、やられた…🦛🥊
到達ステージ：${stageIndex + 1}
無料ブラウザゲーム「カバファイト」
https://afoolhippo.github.io/game14/
#カバファイト #カバゲーセン`;
    }

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }
);

showScreen(titleScreen);
titleScreen.classList.remove("active");

preloadAssets().then(() => {
  setTimeout(() => {
    loadingScreen.style.display = "none";
    showScreen(titleScreen);
  }, 250);
});

setTimeout(() => {
  if (
    loadingScreen &&
    loadingScreen.style.display !== "none"
  ) {
    loadingScreen.style.display = "none";
    showScreen(titleScreen);
  }
}, 3500);

gameLoop();