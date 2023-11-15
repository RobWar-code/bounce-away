import React, { useState, useEffect, useRef } from 'react';
import { Sprite, useApp } from '@pixi/react';
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

        // Check for bounces
        [newX, newY] = doBounce(newX, newY);

        setX(newX);
        setY(newY);

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

    const doBounce = (newX, newY) => {

      // Check for curved corner bounces
      let batBounced = false;
      let [nvx, nvy, nx, ny, didBounce] = doCornerBounce(newX, newY);
      let newVx = nvx;
      let newVy = nvy;
      if (didBounce) {
        batBounced = true;
        newX = nx;
        newY = ny;
      }
      else {
        let bounceEdge = isInBatEdge(newX, newY, batX, batY);
        if (bounceEdge) {
          batBounced = true;
          if (bounceEdge === 1 || bounceEdge === 3) newVy = -vy;
          else newVx = -vx;
        }

        // Basket
        else if (
          // Left Edge
          (newY >= 0.5 * stageHeight - 0.5 * GLOBALS.basketHeight) &&
          (newY <= 0.5 * stageHeight + 0.5 * GLOBALS.basketHeight) &&
          (newX + ballRadius >= stageWidth - GLOBALS.basketWidth) &&
          (newX + ballRadius <= stageWidth - 0.5 * GLOBALS.basketWidth) 
        ){
          setVx(-vx);
          newX = stageWidth - GLOBALS.basketWidth - ballRadius;
        }
        else if (
          (newX >= stageWidth - GLOBALS.basketWidth) &&
          (newX <= stageWidth) &&
          (newY - ballRadius <= 0.5 * stageHeight + 0.5 * GLOBALS.basketHeight) &&
          (newY - ballRadius >= 0.5 * stageHeight + 1)
        ) {
          // Bottom Edge
          setVy(-vy);
          newY = 0.5 * stageHeight + GLOBALS.basketHeight + ballRadius;
        }
        // Stage Edges
        else {
          if ((newY - ballRadius) <= 0) { 
            setVy(-vy);
            newY = ballRadius + 1;
          }
          else if ((newY + ballRadius) >= stageHeight) {
            setVy(-vy);
            newY = stageHeight - ballRadius - 1;
          }
          else if ((newX - ballRadius) <= 0) {
            setVx(-vx);
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
        newX = newX + 2 * newVx;
        newY = newY + 2 * newVy;
        setVx(newVx);
        setVy(newVy);
      }
      return [newX, newY];
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

    const doCornerBounce = (newX, newY) => {

      let newVx = vx;
      let newVy = vy;
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
        // Check whether there is a point of contact
        if (
            dl <= (GLOBALS.ballRadius + arcRadius) &&
            dl >= (GLOBALS.ballRadius + arcRadius) * 0.9
        ) {
            // Calculate the corner bounce
          let [nvx, nvy] = calculateReflection(dx, dy, cornerArcX, cornerArcY, arcRadius, newX, newY);
          newVx = nvx;
          newVy = nvy;
          // Position on edge of corner
          let rx = Math.abs(dx/dl) * (ballRadius + 0.25 * GLOBALS.batHeight);
          let ry = Math.abs(dx/dl) * (ballRadius + 0.25 * GLOBALS.batHeight);
          switch (corner) {
            case 0:
              nx = cornerArcX - rx;
              ny = cornerArcY - ry;
              break;
            case 1:
              nx = cornerArcX + rx;
              ny = cornerArcY - ry;
              break;
            case 2:
              nx = cornerArcX + rx;
              ny = cornerArcY + ry;
              break
            case 3:
              nx = cornerArcX - rx;
              ny = cornerArcY + ry;
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

    const calculateReflection = (dx, dy, cornerArcX, cornerArcY, arcRadius, newX, newY) => {
      const bx = vx;
      const by = vy;

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

  return <Sprite ref={ballRef} x={x} y={y} image={ball} anchor={{x:0.5, y:0.5}}/>;
}

export default MovingBall;
