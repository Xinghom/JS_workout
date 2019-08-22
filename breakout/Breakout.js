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
/* Derived constants */

const BRICK_WIDTH = (GWINDOW_WIDTH - (N_COLS + 1) * BRICK_SEP) / N_COLS;
const BRICK_HEIGHT = BRICK_WIDTH / BRICK_ASPECT_RATIO;
const PADDLE_WIDTH = BRICK_WIDTH / BRICK_TO_PADDLE_RATIO;
const PADDLE_HEIGHT = BRICK_HEIGHT / BRICK_TO_PADDLE_RATIO;
const PADDLE_Y = (1 - BOTTOM_FRACTION) * GWINDOW_HEIGHT - PADDLE_HEIGHT;
const PADDLE_X_INIT = Math.floor(GWINDOW_WIDTH / 2 - PADDLE_WIDTH / 2);
const BALL_SIZE = BRICK_WIDTH / BRICK_TO_BALL_RATIO;
const BALL_RADIUS = BALL_SIZE / 2;

/* Main program */

function Breakout() {
  let gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT);
  setUpBricks(gw);
  setUpPaddle(gw);
  var v = [0,0]; // vx, vy
  setUpBall(gw, v);
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
}

function setUpBall(gw, v) {
  let ball_x = GWINDOW_WIDTH / 2 - BALL_SIZE / 2;
  let ball_y = GWINDOW_HEIGHT / 2 - BALL_SIZE / 2;
  let ball = GOval(ball_x, ball_y, BALL_SIZE, BALL_SIZE);
  ball.setColor("Gray");
  ball.setFilled(true);
  gw.add(ball);
  
  let clickAction = function(e) {
    if(v[0] === 0 && v[1] === 0) {
      v[1] = INITIAL_Y_VELOCITY; // vx
      v[0] = randomReal(MIN_X_VELOCITY, MAX_X_VELOCITY); // vy
      animatedBall(ball, v);
    }
    return;
  }
  gw.addEventListener("click", clickAction);
}

function animatedBall(ball, v) {
  let moveAction = function(e) {
    let ball_center_x = ball.getX() + BALL_RADIUS;
    let ball_center_y = ball.getY() + BALL_RADIUS;
    if(isCollided(ball_center_x, ball_center_y, "left") || isCollided(ball_center_x, ball_center_y, "right")) {
      v[0] = -v[0];
    } 
    if (isCollided(ball_center_x, ball_center_y, "top") || isCollided(ball_center_x, ball_center_y, "bottom")) {
      v[1] = -v[1];
    }
    ball.move(v[0], v[1]);
  }
  let temp = setInterval(moveAction, TIME_STEP);
  console.log("return Value: "+ temp);
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