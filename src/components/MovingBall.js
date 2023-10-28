import React, { useState, useEffect, useRef } from 'react';
import { Sprite, useApp } from '@pixi/react';
import ball from '../assets/images/fastball.png';

function MovingBall( {newBall, setNewBall, stageWidth, stageHeight} ) {
  const app = useApp();
  const [x, setX] = useState(0);
  const [y, setY] = useState(stageHeight / 2);
  const [vx, setVx] = useState(0);
  const [vy, setVy] = useState(0);
  const [ballMoved, setBallMoved] = useState(0);
  const ballRef = useRef();
  const ballRadius = 15;

  // Determine velocity and initial position (pixels per 60th/second - ticker)
  useEffect (() => {
    if (newBall === 1) {
      let v = Math.sqrt(2) * stageWidth / (60 * 3.5);
      let ratioX = Math.random() * 0.5 + 0.25;
      let startVy = 0;
      Math.random() < 0.5 ? startVy = (-(1 - ratioX) * v) : startVy = ((1 - ratioX) * v);
      let startVx = (ratioX * v);
      setVx(startVx);
      setVy(startVy);
      console.log("startVx:", startVx, "startVy:", startVy);
      setNewBall(0);
    }
  }, [newBall, stageWidth, setNewBall]);

  useEffect(() => {
    const moveBall = () => {
      if (ballRef.current) {
        const newX = x + vx; // vx is the speed, adjust as necessary
        const newY = y + vy;
        if ((newY - ballRadius) <= 0 || (newY + ballRadius) >= stageHeight - 1) {
          setVy(-vy);
        }
        else if ((newX - ballRadius) <= 0 && ballMoved) {
          setVx(-vx);
        }

        setX(newX);
        setY(newY);
        if (x > ballRadius && !ballMoved) {
          setBallMoved(1);
        }

        // Stop the ticker and hide the ball when it goes off the screen
        if (newX > stageWidth) {
          setBallMoved(0);
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
  }, [app, app.ticker, newBall, ballMoved, x, y, vx, vy, stageWidth, stageHeight, setBallMoved]);

  return <Sprite ref={ballRef} x={x} y={y} image={ball} anchor={{x:0.5, y:0.5}}/>;
}

export default MovingBall;
