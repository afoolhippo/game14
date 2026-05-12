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

const RESULT_WIN_IMAGE = "assets/result_win.png";
const RESULT_LOSE_IMAGE = "assets/result_lose.png";

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
    bgm: "assets/bgm_nasu.mp3",
    speed: 1.4,
    attackDamage: 7,
    attackRate: 0.035,
    cooldown: 80,
    evadeRate: 0
  },
  {
    name: "TOMATO",
    sprite: "assets/tomato_sheet.png",
    bg: "assets/stage_tomato.png",
    bgm: "assets/bgm_tomato.mp3",
    speed: 1.75,
    attackDamage: 9,
    attackRate: 0.045,
    cooldown: 65,
    evadeRate: 0.01
  },
  {
    name: "TOOTH",
    sprite: "assets/tooth_sheet.png",
    bg: "assets/stage_tooth.png",
    bgm: "assets/bgm_tooth.mp3",
    speed: 2.8,
    attackDamage: 15,
    attackRate: 0.075,
    cooldown: 42,
    evadeRate: 0.035
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
let running = false;
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

  screen.classList.add("active");
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

  RESULT_WIN_IMAGE,
  RESULT_LOSE_IMAGE,

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

function getCurrentStage() {
  return stages[stageIndex];
}

function loadStage() {
  const s = getCurrentStage();

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
  running = false;
  battleActive = false;
  dashCooldown = false;

  player.hp = 100;
  enemy.hp = 100;

  player.x = 40;
  enemy.x = 250;

  player.y = GROUND_Y;
  enemy.y = GROUND_Y;

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

  enemy.cooldown = getCurrentStage().cooldown;

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
    running = true;

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

/* ---------- */
/* PLAYER */
/* ---------- */

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

/* ---------- */
/* ENEMY */
/* ---------- */

function updateEnemy() {
  if (
    gameOver ||
    !battleActive
  ) return;

  const s = getCurrentStage();

  if (enemy.cooldown > 0) {
    enemy.cooldown--;
  }

  const dist = player.x - enemy.x;
  const absDist = Math.abs(dist);

  enemy.facing = dist > 0 ? 1 : -1;

  if (
    s.evadeRate > 0 &&
    Math.random() < s.evadeRate &&
    absDist < 120 &&
    !enemy.attacking &&
    !enemy.hit
  ) {
    enemy.x -= enemy.facing * 34;
    enemy.anim = "walk";
  }

  if (absDist > 95) {
    enemy.x += dist > 0 ? s.speed : -s.speed;

    if (
      !enemy.attacking &&
      !enemy.hit
    ) {
      enemy.anim = "walk";
    }
  } else {
    if (
      !enemy.attacking &&
      !enemy.hit &&
      enemy.cooldown <= 0
    ) {
      if (Math.random() < s.attackRate) {
        enemyAttack();
        enemy.cooldown = s.cooldown;
      }
    }

    if (
      !enemy.hit &&
      !enemy.attacking
    ) {
      enemy.anim = "idle";
    }
  }

  enemy.x = Math.max(
    0,
    Math.min(
      canvas.width - 80,
      enemy.x
    )
  );
}

/* ---------- */
/* HIT */
/* ---------- */

function attackHit(attacker, target, damage, knock) {
  const dist = Math.abs(attacker.x - target.x);

  if (dist < 108) {
    playSe(seHit);

    hitStop();

    shake(
      attacker.special
        ? 6
        : 3
    );

    target.hp -= damage;

    target.hp = Math.max(
      0,
      target.hp
    );

    target.hit = true;
    target.anim = "hit";

    target.x += attacker.facing * knock;

    target.x = Math.max(
      0,
      Math.min(
        canvas.width - 80,
        target.x
      )
    );

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

/* ---------- */
/* PUNCH */
/* ---------- */

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

/* ---------- */
/* DASH */
/* ---------- */

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

    player.x = Math.max(
      0,
      Math.min(
        canvas.width - 80,
        player.x
      )
    );
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

/* ---------- */
/* ENEMY ATTACK */
/* ---------- */

function enemyAttack() {
  if (
    enemy.attacking ||
    enemy.hit ||
    gameOver ||
    !battleActive
  ) return;

  const s = getCurrentStage();

  enemy.attacking = true;
  enemy.anim = "attack";

  setTimeout(() => {
    attackHit(
      enemy,
      player,
      s.attackDamage,
      stageIndex === 2 ? 30 : 18
    );
  }, 130);

  setTimeout(() => {
    enemy.attacking = false;

    if (!gameOver) {
      enemy.anim = "idle";
    }
  }, 430);
}

/* ---------- */
/* HP */
/* ---------- */

function updateBars() {
  playerHpEl.style.width = player.hp + "%";
  enemyHpEl.style.width = enemy.hp + "%";
}

/* ---------- */
/* HIT STOP */
/* ---------- */

function hitStop() {
  stopFrame = 4;
}

/* ---------- */
/* SHAKE */
/* ---------- */

function shake(power) {
  canvas.style.transform =
    `translate(
      ${Math.random() * power - power / 2}px,
      ${Math.random() * power - power / 2}px
    )`;

  setTimeout(() => {
    canvas.style.transform = "translate(0,0)";
  }, 80);
}

/* ---------- */
/* FINISH */
/* ---------- */

function finishGame(win) {
  if (gameOver) return;

  gameOver = true;
  running = false;
  battleActive = false;

  keys.left = false;
  keys.right = false;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  stopBgm();

  player.hit = false;
  enemy.hit = false;

  player.attacking = false;
  enemy.attacking = false;

  player.special = false;
  enemy.special = false;

  player.frame = 0;
  enemy.frame = 0;

  if (win) {
    player.anim = "win";
    enemy.anim = "down";

    playSe(seWin);

    showMessage(
      stageIndex >= stages.length - 1
        ? "ALL CLEAR!!"
        : "YOU WIN!!",
      1800
    );

    setTimeout(() => {
      stageIndex++;

      if (stageIndex >= stages.length) {
        resultTitle.textContent =
          "ALL CLEAR!!";

        resultText.textContent =
          "全3ステージクリア！";

        resultImage.src =
          RESULT_WIN_IMAGE;

        showScreen(resultScreen);
      } else {
        resetGame();
      }
    }, 2200);
  } else {
    player.anim = "down";
    enemy.anim = "win";

    playSe(seLose);

    showMessage(
      "YOU LOSE...",
      1500
    );

    resultTitle.textContent =
      "YOU LOSE...";

    resultText.textContent =
      `STAGE ${stageIndex + 1}`;

    resultImage.src =
      RESULT_LOSE_IMAGE;

    setTimeout(() => {
      showScreen(resultScreen);
    }, 2000);
  }
}

/* ---------- */
/* LOOP */
/* ---------- */

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

/* ---------- */
/* HOLD BUTTON */
/* ---------- */

function bindHoldButton(btn, key) {
  btn.addEventListener(
    "touchstart",
    e => {
      e.preventDefault();
      keys[key] = true;
    },
    { passive: false }
  );

  btn.addEventListener(
    "touchend",
    e => {
      e.preventDefault();
      keys[key] = false;
    },
    { passive: false }
  );

  btn.addEventListener(
    "touchcancel",
    e => {
      e.preventDefault();
      keys[key] = false;
    },
    { passive: false }
  );

  btn.addEventListener(
    "mousedown",
    () => {
      keys[key] = true;
    }
  );

  btn.addEventListener(
    "mouseup",
    () => {
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

/* ---------- */
/* ACTION */
/* ---------- */

punchBtn.addEventListener("click", playerPunch);
dashBtn.addEventListener("click", playerDash);

/* ---------- */
/* TITLE */
/* ---------- */

startBtn.addEventListener("click", startGame);

document
  .getElementById("titleLogo")
  .addEventListener("click", startGame);

/* ---------- */
/* RESULT BUTTON */
/* ---------- */

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
    playSe(seSelect);

    location.href =
      "https://afoolhippo.github.io/home/?skipTitle=1";
  }
);

backBtn.addEventListener(
  "click",
  () => {
    playSe(seSelect);

    gameOver = true;
    running = false;
    battleActive = false;

    keys.left = false;
    keys.right = false;

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    stopBgm();

    showScreen(titleScreen);
  }
);

/* ---------- */
/* SHARE */
/* ---------- */

shareBtn.addEventListener(
  "click",
  () => {
    playSe(seSelect);

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

/* ---------- */
/* INIT */
/* ---------- */

showScreen(titleScreen);
titleScreen.classList.remove("active");

preloadAssets().then(() => {
  updateLoadingProgress(
    preloadList.length,
    preloadList.length
  );

  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.style.display = "none";
  