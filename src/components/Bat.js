import {useEffect, useState} from "react";
import {Sprite} from '@pixi/react';
import GLOBALS from '../constants';
import bat from '../assets/images/bat.png';

export default function Bat( {
    stageWidth, 
    stageHeight,
    batMoved,
    setBatMoved,
    doMove, 
    setDoMove, 
    motionDirection, 
    batX, 
    setBatX, 
    batY, 
    setBatY,
    startGame} ) {

    const [batStep, setBatStep] = useState(0);

    // Initial Position
    useEffect(() => {
        // Set initial position etc.
        if (startGame || !batMoved) {
            console.log("stageWidth", stageWidth);
            setBatX(0.5 * stageWidth);
            setBatY(0.5 * stageHeight);
            setBatStep(determineBatStep(GLOBALS.batTraverseTime, stageWidth));
        }
    }, [startGame, batMoved, stageWidth, stageHeight, setBatX, setBatY, setBatStep])

    return (
        <Sprite
          image={bat}
          x={batX} 
          y={batY}
          anchor={0.5}
        />
    )
}

function determineBatStep(traverseTime, stageWidth) {
    let batStep = stageWidth / (traverseTime / 60);
    return batStep;
}