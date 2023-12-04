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
  setStartGame,
  ballStepOn,
  ballStepClicked,
  setBallStepClicked
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

  const doBounce = useCallback( (oldBallX, oldBallY, newX, newY, startVx, startVy) => {

    // Helper Functions
    const lineCircleIntersects = (lineSpec, radius, centreX, centreY) => {
      const ax = lineSpec[0].x;
      const ay = lineSpec[0].y;
      const bx = lineSpec[1].x;
      const by = lineSpec[1].y;
      const r = radius;
      const cx = centreX;
      const cy = centreY;
  
      // Get the gradient of the line
      const m = (by - ay)/(bx - ax)
      const baseY = ay - m * ax;
      // Derive the factors of the quadratic
      const a = m ** 2 + 1;
      const b = -2 * cx + 2 * m * (ay - m * ax - cy);
      const c = (ay - m * ax - cy) ** 2 + cx ** 2 - r ** 2;
  
      // Derive the values of x for ax^2 + bx + c
      // Calculate discriminant
      const discriminant = b * b - 4 * a * c;
  
      if (discriminant < 0) {
          // No intersection
          return [];
      }
      
      // Find x coordinates of intersections
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      
      // Find y coordinates of intersections
      const y1 = m * x1 + baseY;
      const y2 = m * x2 + baseY;
      
      // Determine whether the intersect is within the line segment
      let do1 = false;
      if (
          ((ax <= bx && x1 >= ax && x1 <= bx) ||
          (ax > bx && x1 <= ax && x1 >= bx)) &&
          ((ay <= by && y1 >= ay && y1 <= by) ||
          (ay > by && y1 <= ay && y1 >= by))
      ) {
          do1 = true;
      }
      let do2 = false;
      if (discriminant > 0) {
          if (
              ((ax <= bx && x2 >= ax && x2 <= bx) ||
              (ax > bx && x2 <= ax && x2 >= bx)) &&
              ((ay <= by && y2 >= ay && y2 <= by) ||
              (ay > by && y2 <= ay && y2 >= by))
          ) {
              do2 = true;
          }
      }
      if (discriminant === 0 && do1) {
          // One intersection
          return [{ x: x1, y: y1 }];
      }
  
      // Two intersections
      if (do2 && do1) {
          return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
      }
      else if (do1) {
          return [{x: x1, y: y1}];
      }
      else if (do2) {
          return [{x: x2, y: y2}];
      }
      else return [];
    }
  
    const radialVectorPoints = (cx, cy, r, dx, dy) => {

      // derive the first vector at right angles to dx,dy
      const dx1 = dy;
      const dy1 = -dx;
      // normalise the vectors and adjust for r
      let x1 = r * dx1 / Math.sqrt(dx1 ** 2 + dy1 ** 2);
      let y1 = r * dy1 / Math.sqrt(dx1 ** 2 + dy1 ** 2);
      x1 = x1 + cx;
      y1 = y1 + cy;
  
      // The second point
      const dx2 = -dy
      const dy2 = dx
      // normalise the vectors and adjust for r
      let x2 = r * dx2 / Math.sqrt(dx2 ** 2 + dy2 ** 2);
      let y2 = r * dy2 / Math.sqrt(dx2 ** 2 + dy2 ** 2);
      x2 = x2 + cx;
      y2 = y2 + cy;
  
      return [{x: x1, y: y1}, {x: x2, y: y2}]
    }
  
    const findNearestLineCircleIntersectToPoint = (lineSpec, c3x, c3y, r3, c1x, c1y, corner)  => {
      let found = 0;
      let p1x, p1y;
      let i1 = lineCircleIntersects(lineSpec, r3, c3x, c3y);
      if (i1.length !== 0) {
          // Get the range for corner
          let a1x,a2y;
          switch (corner) {
              case 0:
                  a1x = c3x - r3;
                  a2y = c3y - r3;
                  break;
              case 1:
                  a1x = c3x + r3;
                  a2y = c3y - r3;
                  break;
              case 2:
                  a1x = c3x + r3;
                  a2y = c3y + r3;
                  break;
              case 3:
                  a1x = c3x - r3;
                  a2y = c3y + r3;
                  break;
              default:
                  console.log("erroneous corner number", corner);
                  break;
          }
          // Determine whether either of the intersects lie on the arc and is nearest to c1
          let i1x, i1y;
          for (let j = 0; j < i1.length; j++) {
              i1x = i1[j].x;
              i1y = i1[j].y;
              console.log("i1x, i1y:", i1x, i1y);
              if ((corner === 0 && i1x >= a1x && i1x <= c3x && i1y <= c3y && i1y >= a2y) ||
                  (corner === 1 && i1x <= a1x && i1x >= c3x && i1y <= c3y && i1y >= a2y) ||
                  (corner === 2 && i1x <= a1x && i1x >= c3x && i1y >= c3y && i1y <= a2y) ||
                  (corner === 3 && i1x >= a1x && i1x <= c3x && i1y >= c3y && i1y <= a2y)
              ){
                  if (i1.length === 0 || j === 0 || (j === 1 && found === 0)) {
                      found = 1;
                      p1x = i1x;
                      p1y = i1y;
                      console.log("p1x, p1y in test loop", p1x, p1y);
                  }
                  else {
                      ++found;
                  }
                  
              }
          }
          if (found === 2) {
              // Find the nearest intersect to c1
              let dc1x = p1x - c1x;
              let dc1y = p1y - c1y;
              let dc1 = dc1x ** 2 + dc1y ** 2;
              let dc2x = i1x - c1x;
              let dc2y = i1y - c1y;
              let dc2 = dc2x ** 2 + dc2y ** 2;
              if (dc2 < dc1) {
                  p1x = i1x;
                  p1y = i1y;
              }
          }
      }
      console.log("found, p1x, p1y", found, p1x, p1y);
      return [found, p1x, p1y];
    }

    const movingCircleToArcContactPosition = (c1x, c1y, r, c2x, c2y, c3x, c3y, r3, corner)  => {
      // Get the vector between C1, C2
      const d1x = c2x - c1x;
      const d1y = c2y - c1y;
      // normalise
      const v1x = d1x / Math.sqrt(d1x ** 2 + d1y ** 2);
      const v1y = d1y / Math.sqrt(d1y ** 2 + d1x ** 2);
  
      // Get radial vector points
      let rs = [];
      rs[0] = radialVectorPoints(c1x, c1y, r, v1x, v1y);
      rs[1] = radialVectorPoints(c2x, c2y, r, v1x, v1y);
  
      // Determine the trajectories and their intersects of C3
      let found = 0;
      let i1x, i1y, p1y, p1x, v1;
      let rp = [];
      for(let i = 0; i < 2; i++) {
          let l1 = [{}, {}];
          l1[0].x = rs[0][i].x;
          l1[0].y = rs[0][i].y;
          l1[1].x = rs[1][i].x;
          l1[1].y = rs[1][i].y;
  
          let [gotPoint, p1x, p1y] = findNearestLineCircleIntersectToPoint(l1, c3x, c3y, r3, c1x, c1y, corner);
          if (gotPoint) {
              let h = {};
              h.p1x = p1x;
              h.p1y = p1y;
              h.v1 = i;
              rp.push(h);
              ++found;
          }
      }
      if (found === 2) {
          i1x = rp[0].p1x;
          i1y = rp[0].p1x;
          p1x = rp[1].p1x;
          p1y = rp[1].p1y;
          // Find the nearest of the two points to c1
          let dc1x = i1x - c1x;
          let dc1y = i1y - c1y;
          let dc1 = dc1x ** 2 + dc1y ** 2;
          let dc2x = p1x - c1x;
          let dc2y = p1y - c1y;
          let dc2 = dc2x ** 2 + dc2y ** 2;
          if (dc1 < dc2) {
              p1x = i1x;
              p1y = i1y;
              v1 = rp[0].v1;
          }
          else {
              v1 = rp[1].v1;
          }
      }
      else if (found === 1) {
          p1x = rp[0].p1x;
          p1y = rp[0].p1y;
          v1 = rp[0].v1;
      }
      if (found) {
  
          // Find the position of the circle that intersects p1 and on the same vector as p1 from c1
          // since the centres of the circles and their radial points form a parallelogram we can simply
          // adjust the coordinates of the centre accordingly.
          const c4x = c1x + (p1x - rs[0][v1].x);
          const c4y = c1y + (p1y - rs[0][v1].y);
  
          // Adjust position of c4 along the normal from c3 to yield c5
          // get the normal
          let n1x = c4x - c3x;
          let n1y = c4y - c3y;
          let rd = Math.sqrt(n1x ** 2 + n1y ** 2)
          let overlap = r + r3 - rd;
          let c5x = c4x + overlap * n1x/rd;
          let c5y = c4y + overlap * n1y/rd;
          let p5x = c5x - r * n1x/rd;
          let p5y = c5y - r * n1y/rd;
          // Check whether the point of contact is within the arc
          if (
              (corner === 0 && p5x >= c3x - r3 && p5x <= c3x && p5y <= c3y && p5y >= c3y - r3) ||
              (corner === 1 && p5x >= c3x && p5x < c3x + r3 && p5y <= c3y && p5y >= c3y - r3) ||
              (corner === 2 && p5x >= c3x && p5x < c3x + r3 && p5y >= c3y && p5y <= c3y + r3) ||
              (corner === 3 && p5x >= c3x - r3 && p5x <= c3x && p5y >= c3y && p5y <= c3y + r3))
          {
              let hit = true;
              return [hit, c5x, c5y, p5x, p5y];
          }
          else {
              return [false, c5x, c5y, p5x, p5y];
          }
      }
      else return [false, 0, 0, 0, 0];
    }
  
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

    const doBatEdgeBounce = (oldBallX, oldBallY, batX, batY, ballVx, ballVy, batVx, batVy) => {
      let newBallX = oldBallX + ballVx;
      let newBallY = oldBallY + ballVy;

      // Determine the relative vectors of the bat and the ball
      let dvx = ballVx - batVx;
      let dvy = ballVy - batVy;

      let newBallVy = ballVy;
      let newBallVx = ballVx;

      // We have to allow for the ball travelling rapidly and possibly passing through two sides
      // so that unless we know its prior position we cannot distinguish between a ball bounced
      // from the second side and the one passing through the first. So we must test the prior
      // position

      const ballRadius = GLOBALS.ballRadius;
      const batHeight = GLOBALS.batHeight;
      const batWidth = GLOBALS.batWidth;


      const batTopEdgeY = batY - batHeight / 2;
      const leftBatTopEdge = batX - batWidth / 2 + batHeight / 4;
      const rightBatTopEdge = batX + batWidth / 2 - batHeight / 4;
      const batBottomEdgeY =  batY + batHeight / 2;
      const leftBatBottomEdge = batX - batWidth / 2 + batHeight / 4;
      const rightBatBottomEdge = batX + batWidth / 2 - batHeight / 4;
      const batLeftEdgeX = batX - batWidth / 2;
      const topBatLeftEdge = batY - batHeight / 2 + batHeight / 4;
      const bottomBatLeftEdge = batY + batHeight / 2 - batHeight / 4;
      const batRightEdgeX = batX + batWidth / 2;
      const topBatRightEdge = batY - batHeight / 2 + batHeight / 4;
      const bottomBatRightEdge = batY + batHeight / 2 - batHeight / 4;
      const r = ballRadius;

      let bounced = false;
      let dx, ix, iy, px, py;
      let dy = newBallY - batTopEdgeY;
      if (dvy > 0 && (oldBallY + ballRadius < batTopEdgeY) && dy >= -ballRadius && dy < 100 &&
        newBallX >= leftBatTopEdge && newBallX <= rightBatTopEdge) {
        bounced = true;
        console.log("Got top edge bounce", dvy);
        // Determine the ball centre intersect
        ix = newBallX + dvx/dvy * (-dy); // Allowing for whether approaching or retreating from the edge
        // Determine the ball edge intersect
        px = ix - dvx/dvy * r;
        // Set the ball on the px point
        newBallX = px;
        newBallY = batTopEdgeY - r - 1;
        // Set the new ball vector (assuming no x vector is imparted)
        newBallVy = -ballVy + batVy;
        
      }
      else {
        // Bottom Edge
        let dy = newBallY - batBottomEdgeY;
        if (dvy < 0 && (oldBallY - ballRadius > batBottomEdgeY) && dy <= ballRadius && dy > -batHeight && 
          newBallX >= leftBatBottomEdge && newBallX <= rightBatBottomEdge) {
          bounced = true;
          // Determine the ball centre intersect
          ix = newBallX + dvx/dvy * dy;
          // Determine the ball edge intersect
          px = ix - dvx/dvy * r;
          // Set the ball on the px point
          newBallX = px;
          newBallY = batBottomEdgeY + r + 1;
          // Set the new ball vector
          newBallVy = -ballVy + batVy;
        }
        else {
          dx = newBallX - batRightEdgeX;
          if (dvx < 0 && (oldBallX - ballRadius > batRightEdgeX) && dx <= ballRadius && dx > -batWidth &&
            newBallY >= topBatRightEdge && newBallY < bottomBatRightEdge) {
            bounced = true;
            // Determine the ball intersect
            iy = newBallY + dvy/dvx * (-dx);
            // Determine the ball edge intersect
            py = iy - dvy/dvx * r;
            // Set the ball on the py point
            newBallY = py;
            newBallX = batRightEdgeX + r;
            // Set the new vector
            newBallVx = -ballVx + batVx;
          }
            
          else {
            // Left Edge
            dx = newBallX - batLeftEdgeX;
            if (dvx > 0 && (oldBallX + ballRadius < batLeftEdgeX) && dx >= -ballRadius && dx < batWidth &&
              newBallY >= topBatLeftEdge && newBallY <= bottomBatLeftEdge) {
              bounced = true;
              // Determine the ball intersect
              iy = newBallY + dvy/dvx * dx;
              // Determine the ball edge intersect
              py = iy - dvy/dvx * r;
              // Set the ball on the py point
              newBallY = py;
              newBallX = batLeftEdgeX - r;
              // Set the vector
              newBallVx = -ballVx + batVx;
            }
          }
        }
      }
      return [newBallX, newBallY, newBallVx, newBallVy, bounced];
    }

    const doCornerBounce = (oldX, oldY, newX, newY, startVx, startVy) => {
  
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

        let [cornerBounce, px, py, hx, hy] = movingCircleToArcContactPosition(oldX, oldY, GLOBALS.ballRadius, newX, newY, cornerArcX, cornerArcY, arcRadius, corner);
        console.log("OldX, OldY: ", oldX, oldY);
        console.log("CornerBounce", cornerBounce, px, py, hx, hy);
        
        if (cornerBounce) {
          // Get distance between centres of ball and arc
          const dx = px - cornerArcX;
          const dy = py - cornerArcY;
            // Calculate the corner bounce
          let [nvx, nvy] = calculateReflection(dx, dy, newVx, newVy);
          newVx = nvx;
          newVy = nvy;
          nx = px;
          ny = py;
          didBounce = true;
        }
        ++corner;
      }
      return [newVx, newVy, nx, ny, didBounce];
    }

// End Helper Functions
//  ----------------------------------------------------------------------------------------
// Main movingBall Function
    let bounced = false;

    // Check for curved corner bounces
    let batBounced = false;
    let [nvx, nvy, nx, ny, didBounce] = doCornerBounce(oldBallX, oldBallY, newX, newY, startVx, startVy);
    let newVx = nvx;
    let newVy = nvy;
    if (didBounce) {
      bounced = true;
      batBounced = true;
      newX = nx;
      newY = ny;
    }
    else {
      [newX, newY, newVx, newVy, bounced] = doBatEdgeBounce(oldBallX, 
        oldBallY, batX, batY, startVx, startVy, batVectorX, batVectorY);

      if (bounced) {
        batBounced = true;
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
      /*
      if (isBatDragging) {
        // Add the bat vector
        newVx = newVx + batVectorX / 2;
        newVy = newVy + batVectorY / 2;
      }
      */
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
    stageHeight,
    stageWidth
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
      console.log("Ball Step On:", ballStepOn, ballStepClicked);
      if (ballStepOn && !ballStepClicked) {
        return;
      }
      setBallStepClicked(0);

      if (ballRef.current.visible) {
        if (startGame) setStartGame(0);
        let newX = x + vx; // vx is the speed, adjust as necessary
        let newY = y + vy;
        let startVx = vx;
        let startVy = vy;

        // Check for bounces
        let [endX, endY, newVx, newVy, bounced] = doBounce(x, y, newX, newY, startVx, startVy);

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
    ballStepOn,
    ballStepClicked,
    setBallStepClicked,
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
      let [endX, endY, newVx, newVy, bounced] = doBounce(startX, startY, newX, newY, startVx, startVy);
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
