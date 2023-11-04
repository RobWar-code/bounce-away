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
  stageWidth, 
  stageHeight,
  currentScore,
  setCurrentScore,
  ballCount,
  setBallCount,
  startGame,
  setStartGame} ){
  const app = useApp();
  const [x, setX] = useState(GLOBALS.ballDiameter / 2 + 1);
  const [y, setY] = useState(stageHeight / 2);
  const [vx, setVx] = useState(0);
  const [vy, setVy] = useState(0);
  const [ballMoved, setBallMoved] = useState(0);
  const [bounced, setBounced] = useState(0);
  const ballRef = useRef();
  const ballRadius = GLOBALS.ballDiameter / 2;

 
  // Determine velocity and initial position (pixels per 60th/second - ticker)
  useEffect (() => {
    if (startGame) {
      setBallCount(GLOBALS.ballsPerGame);
    }

    if (startGame === 1 || newBall === 1) {
      let v = Math.sqrt(2) * stageWidth / (60 * GLOBALS.fastBallTraverseTime);
      let ratioX = Math.random() * 0.5 + 0.25;
      let startVy = 0;
      Math.random() < 0.5 ? startVy = (-(1 - ratioX) * v) : startVy = ((1 - ratioX) * v);
      let startVx = (ratioX * v);
      setVx(startVx);
      setVy(startVy);
      console.log("startVx:", startVx, "startVy:", startVy);
      ballRef.current.visible = true;
      setNewBall(0);
    }
  }, [newBall, stageWidth, setNewBall, startGame, setStartGame, setBallCount]);

  useEffect(() => {
    const moveBall = () => {
      const ding = new Audio(dingSound);

      if (ballRef.current.visible) {
        console.log("MoveBall");
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
          (newY <= 0.5 * stageHeight)
        ) {
          let newScore = currentScore + 10;
          setCurrentScore(newScore);
          setX(ballRadius + 1);
          setY(stageHeight / 2);
          let bCount = ballCount - 1;
          setBallCount(bCount);
          setBallMoved(0);
          setNewBall(1);
          ding.play();
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

      if (bounced) {
        setBounced(0);
        return [newX, newY];
      }

      // Top Edge
      if ((newX >= batX - 0.5 * GLOBALS.batWidth) && 
        (newX <= batX + 0.5 * GLOBALS.batWidth) && 
        (newY + ballRadius >= batY - 0.5 * GLOBALS.batHeight) &&
        (newY + ballRadius <= batY - 1)
      ) {
        setVy(-vy);
        setBounced(1);
        newY = batY - 0.5 * GLOBALS.batHeight - ballRadius;
      }
      // Bottom Edge
      else if (
        (newX >= batX - 0.5 * GLOBALS.batWidth) && 
        (newX <= batX + 0.5 * GLOBALS.batWidth) &&
        (newY - ballRadius <= batY + 0.5 * GLOBALS.batHeight) &&
        (newY - ballRadius >= batY + 1)
      ) {
        setVy(-vy);
        setBounced(1);
        newY = batY + 0.5 * GLOBALS.batHeight + ballRadius;
      }
      // Left Edge
      else if (
        (newY >= batY - 0.5 * GLOBALS.batHeight) &&
        (newY <= batY + 0.5 * GLOBALS.batHeight) &&
        (newX + 0.5 * ballRadius >= batX - 0.5 * GLOBALS.batWidth) &&
        (newX + 0.5 * ballRadius <= batX - 1)
      ) {
        setVx(-vx);
        setBounced(1);
        newX = batX - 0.5 * GLOBALS.batWidth - ballRadius;
      }
      // Right Edge
      else if (
        (newY >= batY - 0.5 * GLOBALS.batHeight) &&
        (newY <= batY + 0.5 * GLOBALS.batHeight) &&
        (newX - 0.5 * ballRadius <= batX + 0.5 * GLOBALS.batWidth) &&
        (newX - 0.5 * ballRadius >= batX + 1)
      ) {
        setVx(-vx);
        setBounced(1);
        newX = batX + 0.5 * GLOBALS.batWidth + ballRadius;
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
        setBounced(1);
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
        setBounced(1);
        newY = 0.5 * stageHeight + GLOBALS.basketHeight + ballRadius;
      }
      // Stage Edges
      else {
        if ((newY - ballRadius) <= 0) { 
          setVy(-vy);
          newY = ballRadius;
        }
        else if ((newY + ballRadius) >= stageHeight - 1) {
          setVy(-vy);
          newY = stageHeight - ballRadius;
        }
        else if ((newX - ballRadius) <= 0) {
          setVx(-vx);
          newX = ballRadius;
        }
      }

      return [newX, newY];
    }

    console.log("Start ball")
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
    bounced,
    setBounced,
    x, 
    y, 
    vx, 
    vy, 
    batX, 
    batY, 
    stageWidth, 
    stageHeight, 
    setBallMoved,
    currentScore,
    setCurrentScore,
    ballCount,
    setBallCount,
    startGame,
    setStartGame
  ]);

  return <Sprite ref={ballRef} x={x} y={y} image={ball} anchor={{x:0.5, y:0.5}}/>;
}

export default MovingBall;
