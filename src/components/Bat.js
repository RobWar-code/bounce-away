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
    setBatY} ) {

    const [batStep, setBatStep] = useState(0);

    // Initial Position
    useEffect(() => {
        // Set initial position etc.
        if (!batMoved) {
            console.log("stageWidth", stageWidth);
            setBatX(0.5 * stageWidth);
            setBatY(stageHeight - 0.5 * GLOBALS.batHeight);
            setBatStep(determineBatStep(GLOBALS.batTraverseTime, stageWidth));
        }
    }, [batMoved, stageWidth, stageHeight, setBatX, setBatY, setBatStep])

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