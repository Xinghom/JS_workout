/*
 * Author: Xinghang
 * File: Breakout.js
 * -----------------
 * This program implements the Breakout game.
 */

"use strict";

/* Constants */

const GWINDOW_WIDTH = 360;           /* Width of the graphics window      */
const GWINDOW_HEIGHT = 600;          /* Height of the graphics window     */
const N_ROWS = 10;                   /* Number of brick rows              */
const N_COLS = 10;                   /* Number of brick columns           */
const BRICK_ASPECT_RATIO = 4 / 1;    /* Width to height ratio of a brick  */
const BRICK_TO_BALL_RATIO = 3 / 2;   /* Ratio of brick width to ball size */
const BRICK_TO_PADDLE_RATIO = 2 / 3; /* Ratio of brick to paddle width    */
const BRICK_SEP = 3;                 /* Separation between bricks         */
const TOP_FRACTION = 0.1;            /* Fraction of window above bricks   */
const BOTTOM_FRACTION = 0.05;        /* Fraction of window below paddle   */
const N_BALLS = 3;                   /* Number of balls in a game         */
const TIME_STEP = 10;                /* Time step in milliseconds         */
const INITIAL_Y_VELOCITY = 3.0;      /* Starting y velocity downward      */
const MIN_X_VELOCITY = 1.0;          /* Minimum random x velocity         */
const MAX_X_VELOCITY = 3.0;          /* Maximum random x velocity         */
const GWINDOW_START_X = 0;
const GWINDOW_START_Y = 0;

var BRICKS_COLORS = ["Red", "Orange", "Pink", "Green", "Blue"];
/* Derived constants */

const BRICK_WIDTH = (GWINDOW_WIDTH - (N_COLS + 1) * BRICK_SEP) / N_COLS;
const BRICK_HEIGHT = BRICK_WIDTH / BRICK_ASPECT_RATIO;
const PADDLE_WIDTH = BRICK_WIDTH / BRICK_TO_PADDLE_RATIO;
const PADDLE_HEIGHT = BRICK_HEIGHT / BRICK_TO_PADDLE_RATIO;
const PADDLE_Y = (1 - BOTTOM_FRACTION) * GWINDOW_HEIGHT - PADDLE_HEIGHT;
const BALL_SIZE = BRICK_WIDTH / BRICK_TO_BALL_RATIO;

/* Main program */

function Breakout() {
  let gw = GWindow(GWINDOW_WIDTH, GWINDOW_HEIGHT);
  setUpBricks(gw);
  
}

function setUpBricks(gw) {
  let start_y = GWINDOW_START_Y + GWINDOW_HEIGHT * TOP_FRACTION;
  for(let r = 0; r < N_ROWS; r++) {
    let start_x = GWINDOW_START_X + BRICK_SEP;
    for(let c = 0; c < N_COLS; c++) {
      let brick = GRect(start_x, start_y, BRICK_WIDTH, BRICK_HEIGHT);
      let color_index = Math.floor((r % (2*BRICKS_COLORS.length)) / 2);
      // console.log(color_index);
      brick.setColor(BRICKS_COLORS[color_index]);
      brick.setFilled(true);
      gw.add(brick);
      start_x += BRICK_WIDTH + BRICK_SEP;
    }
    start_y += BRICK_HEIGHT + BRICK_SEP;
  }
}