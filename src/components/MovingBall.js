import React, { useState, useEffect, useRef, useCallback} from 'react';
import { Sprite, Graphics, useApp } from '@pixi/react';
import dingSound from '../assets/sounds/ding.mp3';
import GLOBALS from "../constants";
import ball from '../assets/images/fastball.png';

function MovingBall( {
  newBall, 
  setNewBall, 
  batX, 
  batY,
  isBatDragging,
  batVectorX,
  batVectorY, 
  stageWidth, 
  stageHeight,
  currentScore,
  setCurrentScore,
  ballCount,
  setBallCount,
  ballTraverseTime,
  soundEnabled,
  traceOn,
  startGame,
  setStartGame
  } ){
  const app = useApp();
  const [x, setX] = useState(GLOBALS.ballDiameter / 2 + 1);
  const [y, setY] = useState(stageHeight / 2);
  const [vx, setVx] = useState(0);
  const [vy, setVy] = useState(0);
  const [ballMoved, setBallMoved] = useState(0);
  const [startBallTraverseTime, setStartBallTraverseTime] = useState(GLOBALS.fastBallTraverseTime);
  const ballRef = useRef();
  const ballRadius = GLOBALS.ballDiameter / 2;

// Helper Functions

  const doBounce = useCallback( (newX, newY, startVx, startVy) => {

    // Helper Functions

    const calculateReflection = (dx, dy, startVx, startVy) => {
      const bx = startVx;
      const by = startVy;
  
      // Normalize the normal vector
      const length = Math.sqrt(dx * dx + dy * dy);
      const Nx = dx / length;
      const Ny = dy / length;
    
      // Calculate the dot product
      const dotProduct = bx * Nx + by * Ny;
    
      // Calculate the reflection vector
      const Rx = bx - 2 * dotProduct * Nx;
      const Ry = by - 2 * dotProduct * Ny;
  
      return [Rx, Ry];
    }

    const doCornerBounce = (newX, newY, startVx, startVy) => {
  
      let newVx = startVx;
      let newVy = startVy;
      let nx = newX;
      let ny = newY;
      let didBounce = false;
      
      const arcRadius = 0.25 * GLOBALS.batHeight;
  
      let corner = 0;
      while (corner < 4 && !didBounce) {
        let cornerArcX;
        let cornerArcY;
        switch (corner) {
          case 0:
            // top left corner of bat
            cornerArcX = batX - 0.5 * GLOBALS.batWidth + 0.25 * GLOBALS.batHeight;
            cornerArcY = batY - 0.25 * GLOBALS.batHeight;
            break;
          case 1:
            // top right
            cornerArcX = batX + 0.5 * GLOBALS.batWidth - 0.25 * GLOBALS.batHeight;
            cornerArcY = batY - 0.25 * GLOBALS.batHeight;
            break;
          case 2:
            // bottom right
            cornerArcX = batX + 0.5 * GLOBALS.batWidth - 0.25 * GLOBALS.batHeight;
            cornerArcY = batY + 0.25 * GLOBALS.batHeight;
            break;
          case 3:
            // bottom left
            cornerArcX = batX - 0.5 * GLOBALS.batWidth + 0.25 * GLOBALS.batHeight;
            cornerArcY = batY + 0.25 * GLOBALS.batHeight;
            break;
          default:
            break;
        }
  
        // Get distance between centres of ball and arc
        const dx = cornerArcX - newX;
        const dy = cornerArcY - newY;
        const dl = Math.sqrt((dx * dx) + (dy * dy));
        let cornerBounce = false;
        // Check whether there is a point of contact
        if (
            dl <= (GLOBALS.ballRadius + arcRadius) &&
            dl >= (GLOBALS.ballRadius + arcRadius) * 0.2
        ) {
          // Check whether the contact distance is valid (or if its an overshoot)
          switch (corner) {
            case 0:
              if (dx > 0 && dy > 0) cornerBounce = true;
              break;
            case 1:
              if (dx < 0 && dy > 0) cornerBounce = true;
              break;
            case 2:
              if (dx < 0 && dy < 0) cornerBounce = true;
              break;
            case 3:
              if (dx > 0 && dy < 0) cornerBounce = true;
              break;
            default:
              console.log("Error in corner number");
              break;
          }
        }
        
        if (cornerBounce) {
            // Calculate the corner bounce
          let [nvx, nvy] = calculateReflection(dx, dy, newVx, newVy);
          newVx = nvx;
          newVy = nvy;
          let deX, deY;
          // Calculate the slope
          let gx = newVy/newVx;
          let gy = newVx/newVy;
          // Position on edge of bat
          // Find nearest edge
          switch (corner) {
            // Top Left
            case 0:
              deX = newX - (batX - 0.5 * GLOBALS.batWidth) - ballRadius;
              deY = newY - (batY - 0.5 * GLOBALS.batHeight) - ballRadius;
              if (newVx > 0 && newVy > 0) {
                newVx = -newVx;
                gx = newVy/newVx;
                gy = newVx/newVy;
              }
              if (newVx <= 0) {
                nx = newX - deX - 1;
                ny = newY + gx * deX;
              }
              else {
                ny = newY - deY - 1;
                nx = newX + gy * deY;
              }
              break;
            // Top Right
            case 1:
              deX = ballRadius + (batX + 0.5 * GLOBALS.batWidth) - newX;
              deY = newY - (batY - 0.5 * GLOBALS.batHeight) - ballRadius;
              if (newVx < 0 && newVy > 0) {
                newVx = -newVx;
                gx = newVy / newVx;
                gy = newVx / newVy;
              }
              if (newVx >= 0) {
                nx = newX + deX + 1;
                ny = newY + gx * deX;
              }
              else {
                ny = newY - deY - 1;
                nx = newX + gy * deY;
              }
              break;
            // Bottom Right
            case 2:
              deX = ballRadius + (batX + 0.5 * GLOBALS.batWidth) - newX;
              deY = ballRadius + (batY + 0.5 * GLOBALS.batHeight) - newY;
              if (newVx < 0 && newVy < 0) {
                newVx = -newVx;
                gx = newVy/newVx;
                gy = newVx/newVy;
              }
              if (newVx >= 0) {
                nx = newX + deX + 1;
                ny = newY + gx * deX;
              }
              else {
                ny = newY + deY + 1;
                nx = newX + gy * deY;
              }
              break
            // Bottom Left
            case 3:
              deX = newX - (batX - 0.5 * GLOBALS.batWidth) - ballRadius;
              deY = ballRadius + (batY + 0.5 * GLOBALS.batHeight) - newY;
              if (newVx > 0 && newVy < 0) {
                newVx = -newVx;
                gx = newVy/newVx;
                gy = newVx/newVy;
              }
              if (newVx <= 0) {
                nx = newX - deX - 1;
                ny = newY + gx * deX;
              }
              else {
                ny = newY + deY + 1;
                nx = newX + gy * deY;
              }
              break;
            default:
              console.log("Corner Adjustment - bad corner");
          }
          didBounce = true;
        }
        ++corner;
      }
      return [newVx, newVy, nx, ny, didBounce];
    }

    const isInBatEdge = (newX, newY, batX, batY) => {
      let bounceEdge = 0;
  
        // Bat - Top Edge
      if ((newX >= batX - 0.5 * GLOBALS.batWidth) && 
        (newX <= batX + 0.5 * GLOBALS.batWidth) && 
        (newY + ballRadius >= batY - 0.5 * GLOBALS.batHeight) &&
        (newY + ballRadius <= batY - 1)
      ) {
        bounceEdge = 1;
      }
      // Bottom Edge
      else if (
        (newX >= batX - 0.5 * GLOBALS.batWidth) && 
        (newX <= batX + 0.5 * GLOBALS.batWidth) &&
        (newY - ballRadius <= batY + 0.5 * GLOBALS.batHeight) &&
        (newY - ballRadius >= batY + 1)
      ) {
        bounceEdge = 3;
      }
      // Left Edge
      else if (
        (newY >= batY - 0.5 * GLOBALS.batHeight) &&
        (newY <= batY + 0.5 * GLOBALS.batHeight) &&
        (newX + 0.5 * ballRadius >= batX - 0.5 * GLOBALS.batWidth) &&
        (newX + 0.5 * ballRadius <= batX - 1)
      ) {
        bounceEdge = 4;
      }
      // Right Edge
      else if (
        (newY >= batY - 0.5 * GLOBALS.batHeight) &&
        (newY <= batY + 0.5 * GLOBALS.batHeight) &&
        (newX - 0.5 * ballRadius <= batX + 0.5 * GLOBALS.batWidth) &&
        (newX - 0.5 * ballRadius >= batX + 1)
      ) {
        bounceEdge = 2;
      }
      return bounceEdge;
    }
//  ----------------------------------------------------------------------------------------
// Main doBounce Function

    let bounced = false;
    // Check for curved corner bounces
    let batBounced = false;
    let [nvx, nvy, nx, ny, didBounce] = doCornerBounce(newX, newY, startVx, startVy);
    let newVx = nvx;
    let newVy = nvy;
    if (didBounce) {
      bounced = true;
      batBounced = true;
      newX = nx;
      newY = ny;
    }
    else {
      let bounceEdge = isInBatEdge(newX, newY, batX, batY);
      if (bounceEdge) {
        bounced = true;
        batBounced = true;
        if (bounceEdge === 1 || bounceEdge === 3) newVy = -vy;
        else newVx = -vx;
      }

      // Basket Bounce
      else if (
        // Left Edge
        (newY >= 0.5 * stageHeight - 0.5 * GLOBALS.basketHeight) &&
        (newY <= 0.5 * stageHeight + 0.5 * GLOBALS.basketHeight) &&
        (newX + ballRadius >= stageWidth - GLOBALS.basketWidth) &&
        (newX + ballRadius <= stageWidth - 0.5 * GLOBALS.basketWidth) 
      ){
        bounced = true;
        newVx = -newVx;
        newX = stageWidth - GLOBALS.basketWidth - ballRadius;
      }
      else if (
        (newX >= stageWidth - GLOBALS.basketWidth) &&
        (newX <= stageWidth) &&
        (newY - ballRadius <= 0.5 * stageHeight + 0.5 * GLOBALS.basketHeight) &&
        (newY - ballRadius >= 0.5 * stageHeight + 1)
      ) {
        // Bottom Edge
        bounced = true;
        newVy = -newVy;
        newY = 0.5 * stageHeight + GLOBALS.basketHeight * 0.5 + ballRadius;
      }
      // Stage Edges
      else {
        if ((newY - ballRadius) <= 0) { 
          bounced = true;
          newVy = -newVy;
          newY = ballRadius + 1;
        }
        else if ((newY + ballRadius) >= stageHeight) {
          bounced = true;
          newVy = -newVy;
          newY = stageHeight - ballRadius - 1;
        }
        else if ((newX - ballRadius) <= 0) {
          bounced = true;
          newVx = -newVx;
          newX = ballRadius;
        }
      }
    }

    if (batBounced) {
      if (isBatDragging) {
        // Add the bat vector
        newVx = newVx + batVectorX / 2;
        newVy = newVy + batVectorY / 2;
      }
      newX = newX + newVx;
      newY = newY + newVy;
    }
    
    return [newX, newY, newVx, newVy, bounced];

  }, [
    ballRadius, 
    batVectorX,
    batVectorY,
    batX,
    batY,
    isBatDragging,
    stageHeight,
    stageWidth,
    vx,
    vy
  ]);

  // Determine velocity and initial position (pixels per 60th/second - ticker)
  useEffect (() => {

    if (startGame === 1 || newBall === 1) {
      setStartBallTraverseTime(ballTraverseTime); // Used to calculate score
      let v = Math.sqrt(2) * stageWidth / (60 * ballTraverseTime);
      let ratioX = Math.random() * 0.5 + 0.25;
      let startVy = 0;
      Math.random() < 0.5 ? startVy = (-(1 - ratioX) * v) : startVy = ((1 - ratioX) * v);
      let startVx = (ratioX * v);
      setVx(startVx);
      setVy(startVy);
      ballRef.current.visible = true;
      setNewBall(0);
    }
  }, [newBall, stageWidth, setNewBall, startGame, setStartGame, setBallCount, ballTraverseTime]);

  useEffect(() => {
    const moveBall = () => {

      if (ballRef.current.visible) {
        if (startGame) setStartGame(0);
        let newX = x + vx; // vx is the speed, adjust as necessary
        let newY = y + vy;
        let startVx = vx;
        let startVy = vy;

        // Check for bounces
        let [endX, endY, newVx, newVy, bounced] = doBounce(newX, newY, startVx, startVy);

        setX(endX);
        setY(endY);
        setVx(newVx);
        setVy(newVy);

        // Check for ball in basket
        if (
          (newX >= stageWidth - GLOBALS.basketWidth) &&
          (newX <= stageWidth) &&
          (newY + ballRadius >= 0.5 * stageHeight - 0.5 * GLOBALS.basketHeight) &&
          (newY <= 0.5 * stageHeight) &&
          vy > 0
        ) {
          // Calculate score from ball speed
          // Get ratio of speeds relative to range of speeds
          let s = startBallTraverseTime;
          let g = GLOBALS.fastBallTraverseTime;
          let lo = g * 0.5;
          let hi = g + 0.5 * g;
          let r = hi - lo;
          let baseS = s - g * 0.5;
          let ratioS = baseS/r;
          // Set score
          let scoreRange = GLOBALS.baseScore;
          let score = Math.floor((1 - ratioS) * scoreRange + 0.5 * GLOBALS.baseScore);
          // Multiply for features
          if (!traceOn) score = score * 2

          let newScore = currentScore + score;
          setCurrentScore(newScore);
          setX(ballRadius + 1);
          setY(stageHeight / 2);
          let bCount = ballCount - 1;
          setBallCount(bCount);
          setBallMoved(0);
          setNewBall(1);
          if (soundEnabled) {
            let ding = new Audio(dingSound);
            ding.play();
          }
        }

        // Stop the ticker and hide the ball when it goes off the screen
        if (newX > stageWidth) {
          setBallMoved(0);
          let bCount = ballCount - 1;
          setX(ballRadius + 1);
          setY(stageHeight / 2);
          setBallCount(bCount);
          setBallMoved(0);
          setNewBall(1);
        }

        if (ballCount <= 0) {
          app.ticker.remove(moveBall);
          ballRef.current.visible = false;
        }
      }
    };
    
    app.ticker.add(moveBall);

    // Cleanup on unmount
    return () => {
      if (app && app.ticker) {
        app.ticker.remove(moveBall);
      }
    };
  }, [
    app, 
    app.ticker, 
    newBall,
    setNewBall, 
    ballMoved, 
    ballRadius, 
    x, 
    y, 
    vx, 
    vy, 
    doBounce,
    traceOn,
    batX, 
    batY,
    isBatDragging,
    batVectorX,
    batVectorY,
    soundEnabled, 
    stageWidth, 
    stageHeight, 
    setBallMoved,
    currentScore,
    setCurrentScore,
    ballCount,
    setBallCount,
    startGame,
    setStartGame,
    startBallTraverseTime,
    setStartBallTraverseTime
  ]);

  const drawTrace = useCallback((g) => {
    g.clear();
    g.lineStyle(3, 0x50a050, 1);

    let startX = x;
    let startY = y;
    let startVx = vx;
    let startVy = vy;

    let moveCount = 0;
    let endTrace = false;
    // Skip alternate traces
    while (moveCount < GLOBALS.numTraceMoves && !endTrace) {
      let newX = startX + startVx;
      let newY = startY + startVy;
      let [endX, endY, newVx, newVy, bounced] = doBounce(newX, newY, startVx, startVy);
      if (!bounced && moveCount % 2 === 0) {
        g.moveTo(startX, startY);
        g.lineTo(endX, endY);
      }
      // Check for in basket
      if (
        newVy > 0 &&
        endX >= stageWidth - GLOBALS.basketWidth &&
        endY >= GLOBALS.stageHeight * 0.5 - GLOBALS.basketHeight * 0.5 &&
        endY <= GLOBALS.stageHeight * 0.5
      ) {
        endTrace = true;
      }
      // Check for beyond stage right
      else if (endX >= stageWidth) {
        endTrace = true;
      }
      startX = endX;
      startY = endY;
      startVx = newVx;
      startVy = newVy;
      ++moveCount;
    }
  }, [x, y, vx, vy, stageWidth, doBounce])

  return (
    <>
    <Sprite ref={ballRef} x={x} y={y} image={ball} anchor={{x:0.5, y:0.5}}/>
    { traceOn === 1 && <Graphics draw={drawTrace} />}
    </>
  )
}

export default MovingBall;
