const canvas =
  document.getElementById(
    "gameCanvas"
  );

const ctx =
  canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

/* ---------- */
/* SCREEN */
/* ---------- */

const titleScreen =
  document.getElementById(
    "titleScreen"
  );

const gameScreen =
  document.getElementById(
    "gameScreen"
  );

const resultScreen =
  document.getElementById(
    "resultScreen"
  );

/* ---------- */
/* BUTTON */
/* ---------- */

const startBtn =
  document.getElementById(
    "startBtn"
  );

const retryBtn =
  document.getElementById(
    "retryBtn"
  );

const homeBtn =
  document.getElementById(
    "homeBtn"
  );

const shareBtn =
  document.getElementById(
    "shareBtn"
  );

const backBtn =
  document.getElementById(
    "backBtn"
  );

/* ---------- */
/* HUD */
/* ---------- */

const playerHpEl =
  document.getElementById(
    "playerHp"
  );

const enemyHpEl =
  document.getElementById(
    "enemyHp"
  );

const timerEl =
  document.getElementById(
    "timer"
  );

const battleMessage =
  document.getElementById(
    "battleMessage"
  );

const enemyName =
  document.getElementById(
    "enemyName"
  );

/* ---------- */
/* RESULT */
/* ---------- */

const resultTitle =
  document.getElementById(
    "resultTitle"
  );

const resultText =
  document.getElementById(
    "resultText"
  );

const resultImage =
  document.getElementById(
    "resultImage"
  );

/* ---------- */
/* AUDIO */
/* ---------- */

const seSelect =
  new Audio(
    "assets/se_select.mp3"
  );

const sePunch =
  new Audio(
    "assets/se_punch.mp3"
  );

const seHit =
  new Audio(
    "assets/se_hit.mp3"
  );

const seFight =
  new Audio(
    "assets/se_fight.mp3"
  );

const seRound1 =
  new Audio(
    "assets/se_round1.mp3"
  );

const seRound2 =
  new Audio(
    "assets/se_round2.mp3"
  );

const seRound3 =
  new Audio(
    "assets/se_round3.mp3"
  );

const seWin =
  new Audio(
    "assets/se_win.mp3"
  );

const seLose =
  new Audio(
    "assets/se_lose.mp3"
  );

/* ---------- */
/* BGM */
/* ---------- */

const bgm =
  new Audio();

bgm.loop = true;

bgm.volume = 0.25;

/* ---------- */
/* IMAGE */
/* ---------- */

const hippoSheet =
  new Image();

hippoSheet.src =
  "assets/hippo_sheet.png";

const stageImg =
  new Image();

const enemySheet =
  new Image();

/* ---------- */
/* STAGE */
/* ---------- */

const stages = [

  {

    name: "NASU",

    sprite:
      "assets/nasu_sheet.png",

    bg:
      "assets/stage_nasu.png",

    bgm:
      "assets/bgm_nasu.mp3",

    result:
      "assets/result_lose.png"
  },

  {

    name: "TOMATO",

    sprite:
      "assets/tomato_sheet.png",

    bg:
      "assets/stage_tomato.png",

    bgm:
      "assets/bgm_tomato.mp3",

    result:
      "assets/result_lose2.png"
  },

  {

    name: "TOOTH",

    sprite:
      "assets/tooth_sheet.png",

    bg:
      "assets/stage_tooth.png",

    bgm:
      "assets/bgm_tooth.mp3",

    result:
      "assets/result_lose3.png"
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

/* ---------- */
/* GAME */
/* ---------- */

let timer = 30;

let gameOver = true;

let running = false;

let timerInterval = null;

let animCounter = 0;

/* ---------- */
/* PLAYER */
/* ---------- */

const player = {

  x: 60,

  y: GROUND_Y,

  hp: 100,

  vy: 0,

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

  x: 220,

  y: GROUND_Y,

  hp: 100,

  vy: 0,

  facing: -1,

  attacking: false,

  special: false,

  hit: false,

  frame: 0,

  anim: "idle"
};

/* ---------- */
/* ANIM */
/* ---------- */

const animations = {

  idle: [0,1],

  walk: [2],

  attack: [5],

  special: [6],

  hit: [7],

  down: [8],

  win: [11]
};

const keys = {

  left: false,

  right: false
};

/* ---------- */
/* SCREEN */
/* ---------- */

function showScreen(screen){

  titleScreen.classList.remove(
    "active"
  );

  gameScreen.classList.remove(
    "active"
  );

  resultScreen.classList.remove(
    "active"
  );

  screen.classList.add(
    "active"
  );
}

/* ---------- */
/* STAGE */
/* ---------- */

function loadStage(){

  const s =
    stages[stageIndex];

  enemyName.textContent =
    s.name;

  enemySheet.src =
    s.sprite;

  stageImg.src =
    s.bg;

  bgm.src =
    s.bgm;

  bgm.play();
}

/* ---------- */
/* START */
/* ---------- */

function startGame(){

  seSelect.currentTime = 0;

  seSelect.play();

  showScreen(
    gameScreen
  );

  resetGame();
}

/* ---------- */
/* RESET */
/* ---------- */

function resetGame(){

  loadStage();

  timer = 30;

  timerEl.textContent =
    timer;

  running = true;

  gameOver = false;

  player.hp = 100;

  enemy.hp = 100;

  player.x = 60;

  enemy.x = 220;

  player.anim = "idle";

  enemy.anim = "idle";

  updateBars();

  if(timerInterval){

    clearInterval(
      timerInterval
    );
  }

  const roundSe = [

    seRound1,
    seRound2,
    seRound3

  ][stageIndex];

  roundSe.play();

  showMessage(
    `ROUND ${stageIndex+1}`,
    1200
  );

  setTimeout(()=>{

    seFight.play();

    showMessage(
      "FIGHT!!",
      900
    );

  },1300);

  timerInterval =
    setInterval(()=>{

      if(gameOver) return;

      timer--;

      timerEl.textContent =
        timer;

      if(timer <= 0){

        finishGame(
          false
        );
      }

    },1000);
}

/* ---------- */
/* MESSAGE */
/* ---------- */

function showMessage(
  text,
  duration
){

  battleMessage.textContent =
    text;

  setTimeout(()=>{

    if(!gameOver){

      battleMessage.textContent =
        "";
    }

  },duration);
}

/* ---------- */
/* BG */
/* ---------- */

function drawBackground(){

  if(
    !stageImg.complete
  ) return;

  ctx.drawImage(
    stageImg,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

/* ---------- */
/* DRAW */
/* ---------- */

function drawCharacter(
  character,
  image,
  flip=false
){

  if(
    !image.complete
  ) return;

  const frames =
    animations[
      character.anim
    ];

  const frameIndex =
    frames[
      character.frame %
      frames.length
    ];

  const frameW =
    image.width / COLS;

  const frameH =
    image.height / ROWS;

  const sx =
    (frameIndex % COLS)
    * frameW;

  const sy =
    Math.floor(
      frameIndex / COLS
    ) * frameH;

  const drawW =
    frameW * SCALE;

  const drawH =
    frameH * SCALE;

  const drawX =
    character.x;

  const drawY =
    character.y - drawH;

  ctx.save();

  if(flip){

    ctx.scale(-1,1);

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

  }else{

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
/* UPDATE */
/* ---------- */

function updatePlayer(){

  if(gameOver) return;

  let moving = false;

  if(keys.left){

    player.x -= 4;

    player.facing = -1;

    moving = true;
  }

  if(keys.right){

    player.x += 4;

    player.facing = 1;

    moving = true;
  }

  if(
    moving &&
    !player.attacking &&
    !player.special &&
    !player.hit
  ){

    player.anim = "walk";

  }else if(
    !player.attacking &&
    !player.special &&
    !player.hit
  ){

    player.anim = "idle";
  }

  player.x =
    Math.max(
      0,
      Math.min(
        canvas.width - 100,
        player.x
      )
    );
}

/* ---------- */
/* ENEMY */
/* ---------- */

function updateEnemy(){

  if(gameOver) return;

  const dist =
    player.x - enemy.x;

  if(
    Math.abs(dist) > 90
  ){

    enemy.x +=
      dist > 0
      ? 1.4
      : -1.4;

    enemy.facing =
      dist > 0
      ? 1
      : -1;

    if(
      !enemy.attacking &&
      !enemy.hit
    ){

      enemy.anim = "walk";
    }

  }else{

    if(
      !enemy.attacking &&
      Math.random() < 0.025
    ){

      enemyAttack();
    }

    if(
      !enemy.hit &&
      !enemy.attacking
    ){

      enemy.anim = "idle";
    }
  }
}

/* ---------- */
/* HIT */
/* ---------- */

function attackHit(
  attacker,
  target,
  damage,
  knock
){

  const dist =
    Math.abs(
      attacker.x -
      target.x
    );

  if(dist < 110){

    seHit.currentTime = 0;

    seHit.play();

    hitStop();

    shake(
      attacker.special
      ? 5
      : 2
    );

    target.hp -= damage;

    target.hp =
      Math.max(
        0,
        target.hp
      );

    target.hit = true;

    target.anim = "hit";

    target.x +=
      attacker.facing *
      knock;

    updateBars();

    setTimeout(()=>{

      target.hit = false;

      if(
        target.hp > 0
      ){

        target.anim = "idle";
      }

    },220);

    if(
      target.hp <= 0
    ){

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

function playerPunch(){

  if(
    player.attacking ||
    player.special ||
    gameOver
  ) return;

  sePunch.currentTime = 0;

  sePunch.play();

  player.attacking = true;

  player.anim = "attack";

  setTimeout(()=>{

    attackHit(
      player,
      enemy,
      12,
      18
    );

  },90);

  setTimeout(()=>{

    player.attacking = false;

    if(!gameOver){

      player.anim = "idle";
    }

  },320);
}

/* ---------- */
/* DASH */
/* ---------- */

let dashCooldown = false;

function playerDash(){

  if(
    dashCooldown ||
    player.attacking ||
    player.special ||
    gameOver
  ) return;

  dashCooldown = true;

  player.special = true;

  player.anim = "special";

  const rush =
    setInterval(()=>{

      player.x +=
        player.facing * 10;

    },16);

  setTimeout(()=>{

    clearInterval(
      rush
    );

    attackHit(
      player,
      enemy,
      22,
      42
    );

  },180);

  setTimeout(()=>{

    player.special = false;

    player.anim = "idle";

  },500);

  setTimeout(()=>{

    dashCooldown = false;

  },1500);
}

/* ---------- */
/* ENEMY ATTACK */
/* ---------- */

function enemyAttack(){

  enemy.attacking = true;

  enemy.anim = "attack";

  setTimeout(()=>{

    attackHit(
      enemy,
      player,
      10,
      16
    );

  },120);

  setTimeout(()=>{

    enemy.attacking = false;

    if(!gameOver){

      enemy.anim = "idle";
    }

  },350);
}

/* ---------- */
/* HP */
/* ---------- */

function updateBars(){

  playerHpEl.style.width =
    player.hp + "%";

  enemyHpEl.style.width =
    enemy.hp + "%";
}

/* ---------- */
/* HIT STOP */
/* ---------- */

let stopFrame = 0;

function hitStop(){

  stopFrame = 3;
}

/* ---------- */
/* SHAKE */
/* ---------- */

function shake(power){

  canvas.style.transform =

    `translate(
      ${Math.random()*power-power/2}px,
      ${Math.random()*power-power/2}px
    )`;

  setTimeout(()=>{

    canvas.style.transform =
      "translate(0,0)";

  },70);
}

/* ---------- */
/* FINISH */
/* ---------- */

function finishGame(win){

  if(gameOver) return;

  gameOver = true;

  running = false;

  clearInterval(
    timerInterval
  );

  bgm.pause();

  if(win){

    player.anim = "win";

    enemy.anim = "down";

    showMessage(
      "YOU WIN!!",
      1500
    );

    setTimeout(()=>{

      stageIndex++;

      if(
        stageIndex >=
        stages.length
      ){

        seWin.play();

        resultTitle.textContent =
          "CLEAR!!";

        resultText.textContent =
          "全3ステージクリア！";

        resultImage.src =
          "assets/result_win.png";

        showScreen(
          resultScreen
        );

      }else{

        resetGame();
      }

    },1800);

  }else{

    player.anim = "down";

    enemy.anim = "win";

    seLose.play();

    resultTitle.textContent =
      "YOU LOSE...";

    resultText.textContent =
      `STAGE ${stageIndex+1}`;

    resultImage.src =
      stages[
        stageIndex
      ].result;

    setTimeout(()=>{

      showScreen(
        resultScreen
      );

    },1400);
  }
}

/* ---------- */
/* LOOP */
/* ---------- */

function gameLoop(){

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  if(
    gameScreen.classList.contains(
      "active"
    )
  ){

    if(stopFrame > 0){

      stopFrame--;

    }else{

      updatePlayer();

      updateEnemy();

      animCounter++;

      if(
        animCounter % 18 === 0
      ){

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

  requestAnimationFrame(
    gameLoop
  );
}

/* ---------- */
/* BUTTON */
/* ---------- */

function bindHoldButton(
  btn,
  key
){

  btn.addEventListener(
    "touchstart",
    e=>{

      e.preventDefault();

      keys[key] = true;
    }
  );

  btn.addEventListener(
    "touchend",
    e=>{

      e.preventDefault();

      keys[key] = false;
    }
  );

  btn.addEventListener(
    "mousedown",
    ()=>{

      keys[key] = true;
    }
  );

  btn.addEventListener(
    "mouseup",
    ()=>{

      keys[key] = false;
    }
  );
}

bindHoldButton(

  document.getElementById(
    "leftBtn"
  ),

  "left"
);

bindHoldButton(

  document.getElementById(
    "rightBtn"
  ),

  "right"
);

/* ---------- */
/* ACTION */
/* ---------- */

document
  .getElementById(
    "punchBtn"
  )
  .addEventListener(
    "click",
    playerPunch
  );

document
  .getElementById(
    "dashBtn"
  )
  .addEventListener(
    "click",
    playerDash
  );

/* ---------- */
/* TITLE */
/* ---------- */

startBtn.addEventListener(
  "click",
  startGame
);

document
  .getElementById(
    "titleLogo"
  )
  .addEventListener(
    "click",
    startGame
  );

retryBtn.addEventListener(
  "click",
  ()=>{

    stageIndex = 0;

    startGame();
  }
);

homeBtn.addEventListener(
  "click",
  ()=>{

    location.href =
      "https://afoolhippo.github.io/home/?skipTitle=1";
  }
);

backBtn.addEventListener(
  "click",
  ()=>{

    gameOver = true;

    running = false;

    bgm.pause();

    showScreen(
      titleScreen
    );
  }
);

/* ---------- */
/* SHARE */
/* ---------- */

shareBtn.addEventListener(
  "click",
  ()=>{

    let text = "";

    if(stageIndex >= 3){

      text =
`カバ、全員ぶっとばした！🦛🥊🍆🍅🦷
全3ステージクリア！
無料ブラウザゲーム「カバファイト」
https://afoolhippo.github.io/game14/
#カバファイト #カバゲーセン`;

    }else{

      text =
`カバ、やられた…🦛🥊
到達ステージ：${stageIndex+1}
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

showScreen(
  titleScreen
);

gameLoop();