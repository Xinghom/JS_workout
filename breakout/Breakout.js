/*
 * Author: Xinghang
 * File: Breakout.js
 * -----------------
 * This program implements the Breakout game.
 */

"use strict"; // "strict mode" Enabled

/* Constants */
const GWINDOW_WIDTH = 360;           /* Width of the graphics window      */
const GWINDOW_HEIGHT = 600;          /* Height of the graphics window     */
const N_ROWS = 10;                   /* Number of brick rows              */
const N_COLS = 10;                   /* Number of brick columns           */
const BRICK_ASPECT_RATIO = 4 / 1;    /* Width to height ratio of a brick  */
const BRICK_TO_BALL_RATIO = 3 / 2;   /* Ratio of brick width to ball size */
const BRICK_TO_PADDLE_RATIO = 2 / 3; /* Ratio of brick to paddle width    */
const BRICK_SEP = 2;                 /* Separation between bricks         */
const TOP_FRACTION = 0.1;            /* Fraction of window above bricks   */
const BOTTOM_FRACTION = 0.05;        /* Fraction of window below paddle   */
const N_BALLS = 3;                   /* Number of balls in a game         */
const TIME_STEP = 10;                /* Time step in milliseconds         */
const INITIAL_Y_VELOCITY = 3.0;      /* Starting y velocity downward      */
const MIN_X_VELOCITY = 1.0;          /* Minimum random x velocity         */
const MAX_X_VELOCITY = 3.0;          /* Maximum random x velocity         */
const GWINDOW_START_X = 0;
const GWINDOW_START_Y = 0;
const BRICKS_COLORS = ["Red", "Orange", "Green", "Cyan", "Blue"];
const SPEED_UP_RATE = 3.5;
const SLOW_DOWN_RATE = 0.02;
const MAX_SPEED = 7;
const MIN_SPEED = 0.4;
const RATIO_GRAVITY = 0.98;
/* Derived constants */

const BRICK_WIDTH = (GWINDOW_WIDTH - (N_COLS + 1) * BRICK_SEP) / N_COLS;
const BRICK_HEIGHT = BRICK_WIDTH / BRICK_ASPECT_RATIO;
const PADDLE_WIDTH = BRICK_WIDTH / BRICK_TO_PADDLE_RATIO;
const PADDLE_HEIGHT = BRICK_HEIGHT / BRICK_TO_PADDLE_RATIO;
const PADDLE_Y = (1 - BOTTOM_FRACTION) * GWINDOW_HEIGHT - PADDLE_HEIGHT;
const PADDLE_X_INIT = Math.floor(GWINDOW_WIDTH / 2 - PADDLE_WIDTH / 2);
const BALL_SIZE = BRICK_WIDTH / BRICK_TO_BALL_RATIO;
const BALL_RADIUS = BALL_SIZE / 2;
let V_XY_RATIO = 0;
let GAME_IS_OVER = false;

/* Main program */
function Breakout() {
  let gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT);

  setUpBricks(gw);
  let paddle = setUpPaddle(gw);
  var v = [0,0]; // vx, vy
  let ball = setUpBall(gw, v, paddle);

  // Ball animation - click to start/play
  let startText = GLabel("Click to Start", ball.getX() - BALL_SIZE, ball.getY() - BALL_SIZE);
  gw.add(startText);
  let clickAction = function(e) {
    if(v[0] === 0 && v[1] === 0 && !GAME_IS_OVER) {
      v[0] = randomReal(MIN_X_VELOCITY, MAX_X_VELOCITY); // vx
      v[1] = randomReal(MIN_X_VELOCITY, MAX_X_VELOCITY); // vy
      V_XY_RATIO = v[0] / v[1];
      if(randomChance()) v[0] = -v[0];
      animatedBall(gw, ball, v, paddle);
      gw.remove(startText);
    } else if (GAME_IS_OVER) { // GAME IS OVER
      GAME_IS_OVER = false;
      setUpBricks(gw);
      paddle = setUpPaddle(gw);
      ball = setUpBall(gw, v, paddle);
      gw.add(startText);
    }
  }
  gw.addEventListener("click", clickAction);
}

function setUpBricks(gw) {
  let start_y = GWINDOW_START_Y + GWINDOW_HEIGHT * TOP_FRACTION;
  for(let r = 0; r < N_ROWS; r++) {
    let start_x = GWINDOW_START_X + BRICK_SEP;
    for(let c = 0; c < N_COLS; c++) {
      let brick = GRect(start_x, start_y, BRICK_WIDTH, BRICK_HEIGHT);
      let color_index = Math.floor((r % (2 * BRICKS_COLORS.length)) / 2);
      // console.log(color_index);
      brick.setColor(BRICKS_COLORS[color_index]);
      brick.setFilled(true);
      gw.add(brick);
      start_x += BRICK_WIDTH + BRICK_SEP;
    }
    start_y += BRICK_HEIGHT + BRICK_SEP;
  }
}

function setUpPaddle(gw) {
  let paddle_x = PADDLE_X_INIT;
  let paddle = GRect(paddle_x, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT);
  paddle.setColor("Black");
  paddle.setFilled(true);
  gw.add(paddle);
  let mouseMoveAction = function(e) {
    paddle_x = e.getX() - PADDLE_WIDTH / 2;
    if(paddle_x < 0) {
      paddle_x = 0;
    } else if (paddle_x > GWINDOW_WIDTH - PADDLE_WIDTH) {
      paddle_x = GWINDOW_WIDTH - PADDLE_WIDTH;
    }
    paddle.setLocation(paddle_x, PADDLE_Y);
  };
  gw.addEventListener("mousemove", mouseMoveAction);

  let doubleClickAction = function(e) {
    ultimatePaddle(gw, paddle);
  }
  gw.addEventListener("dblclick", doubleClickAction);

  return paddle;
}

function setUpBall(gw, v, paddle) {
  let ball_x = GWINDOW_WIDTH / 2 - BALL_SIZE / 2;
  let ball_y = GWINDOW_HEIGHT / 2 - BALL_SIZE / 2;
  let ball = GOval(ball_x, ball_y, BALL_SIZE, BALL_SIZE);
  ball.setColor("Gray");
  ball.setFilled(true);
  gw.add(ball);
  return ball;
}

function animatedBall(gw, ball, v, paddle) {
  let moveAction = function(e) {
    let ball_center_x = ball.getX() + BALL_RADIUS;
    let ball_center_y = ball.getY() + BALL_RADIUS;

    addGravity(v);

    let collidedObj = getCollidingObject(gw, ball);
    if(collidedObj) {
      if(collidedObj !== paddle) {
        v[1] = -v[1];
        gw.remove(collidedObj);
        
        // Win
        if(killedTheGame(gw)) {
          window.alert("Winner Winner Chicken Dinner!! ^.-");
          clearInterval(timer);
          v[0] = 0;
          v[1] = 0;
          gw.clear();
          GAME_IS_OVER = true;
        }
      } else {
        if(v[1] > 0)
          v[1] = -v[1];
          speedUpBall(v, "vertical");
      }
    }

    if(isCollided(ball_center_x, ball_center_y, "left") || isCollided(ball_center_x, ball_center_y, "right")) {
      v[0] = -v[0];
    } 
    if (isCollided(ball_center_x, ball_center_y, "top")) {
      v[1] = -v[1];
    }

    // Game Over
    if (isCollided(ball_center_x, ball_center_y, "bottom")) {
      window.alert("GAME OVER >.< Click it to replay");
      clearInterval(timer);
      v[0] = 0;
      v[1] = 0;
      gw.clear();
      GAME_IS_OVER = true;
    }
    console.log("v:" + v[0] + "  " + v[1]);
    ball.move(v[0], v[1]);
  }
  let timer = setInterval(moveAction, TIME_STEP);
}

function isCollided(x, y, boundary) {
  if(boundary === "left") {
    return x <= 0 + BALL_RADIUS;
  } else if(boundary === "right") {
    return x >= GWINDOW_WIDTH - BALL_RADIUS;
  } else if(boundary === "top") {
    return y <= 0 + BALL_RADIUS;
  } else if(boundary === "bottom") {
    return y >= GWINDOW_HEIGHT - BALL_RADIUS;
  }
  console.exception(boundary + " is invalid input for isCollided()");
  return false;
}

function addTextOnGWINDOW(gw, t, x, y) {
  let text = GLabel(t, x, y);
  gw.add(text);
  return text;
}

function getCollidingObject(gw, ball) {
  let top = [ball.getX()+BALL_RADIUS, ball.getY()-1]; 
  let bottom = [ball.getX()+BALL_RADIUS, ball.getY()+BALL_SIZE+1];
  let left = [ball.getX()-1, ball.getY()+BALL_RADIUS];
  let right = [ball.getX()+BALL_SIZE, ball.getY()+BALL_RADIUS+1];
  return gw.getElementAt(top[0], top[1]) !== null ? gw.getElementAt(top[0], top[1])
      :  gw.getElementAt(bottom[0], bottom[1]) !== null ? gw.getElementAt(bottom[0], bottom[1])
      :  gw.getElementAt(left[0], left[1]) !== null ? gw.getElementAt(left[0], left[1])
      :  gw.getElementAt(right[0], right[1]) !== null ? gw.getElementAt(right[0], right[1])
      :  null;
}

function speedUpBall(v, dir) {
  //speed up x
  if(dir === "horizontal") {
    if(v[0] < 0) 
      v[0] -= SPEED_UP_RATE;
    else 
      v[0] += SPEED_UP_RATE;
  }

  //speed up y
  if(dir === "vertical") {
    if(v[1] < 0) 
      v[1] -= SPEED_UP_RATE;
    else 
      v[1] += SPEED_UP_RATE;
  }
}

function addGravity(v) {
  //slow down vy
  if(v[1] < 0 && Math.abs(v[1]) >= MIN_SPEED) 
    v[1] = v[1] * RATIO_GRAVITY;
  else if(v[1] > 0 && v[1] <= MAX_SPEED)
    v[1] = v[1] * (2 - RATIO_GRAVITY);
}

function killedTheGame(gw) {
  return gw.getElementCount() === 2;
}

function ultimatePaddle(gw, paddle) {
  paddle.setLocation(2, PADDLE_Y);
  paddle.setSize(GWINDOW_WIDTH - 4, PADDLE_HEIGHT);
}