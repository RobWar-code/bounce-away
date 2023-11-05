import {useEffect, useState, useRef} from "react";
import {Sprite} from '@pixi/react';
import '@pixi/events';
import GLOBALS from '../constants';
import bat from '../assets/images/bat.png';

export default function Bat( {
    stageWidth, 
    stageHeight,
    batMoved,
    setBatMoved,
    batClicked,
    setBatClicked,
    batDirection, 
    batStep,
    batX, 
    setBatX, 
    batY, 
    setBatY,
    startGame} ) {

    const spriteRef = useRef();
    const [isDragging, setIsDragging] = useState(false);

    // Initial Position
    useEffect(() => {
        // Set initial position etc.
        if (startGame || !batMoved) {
            setBatX(0.5 * stageWidth);
            setBatY(0.5 * stageHeight);
        }
    }, [startGame, batMoved, stageWidth, stageHeight, setBatX, setBatY])

    // Bat Move Button Clicked
    useEffect(() => {
        if (batClicked) {
            let bsx = 0;
            let bsy = 0;
            switch (batDirection) {
                case "LEFT":
                    bsx = -batStep;
                    break;
                case "RIGHT":
                    bsx = batStep;
                    break;
                case "UP":
                    bsy = -batStep;
                    break;
                case "DOWN":
                    bsy = batStep;
                    break;
                default:
                    console.log("Bat direction error - should be LEFT, RIGHT, UP, DOWN");
            }
            let newX = batX + bsx;
            let newY = batY + bsy;

            // Adjust X
            if (newX - GLOBALS.batWidth * 0.5 < 0) {
                newX = GLOBALS.batWidth * 0.5;
            }
            else if (newX + GLOBALS.batWidth * 0.5 >= stageWidth) {
                newX = stageWidth - GLOBALS.batWidth - 1;
            }
            else if (
                batDirection === "RIGHT" &&
                newY + GLOBALS.batHeight * 0.5 >= stageHeight * 0.5 - GLOBALS.basketHeight * 0.5 &&
                newY - GLOBALS.batHeight * 0.5 <= stageHeight * 0.5 + GLOBALS.basketHeight * 0.5 &&
                newX + GLOBALS.batWidth * 0.5 >= stageWidth - GLOBALS.basketWidth
            ) {
                newX = stageWidth - GLOBALS.basketWidth - 0.5 * GLOBALS.batWidth;
            }

            // Adjust Y
            if (newY - GLOBALS.batHeight * 0.5 <= 0) {
                newY = GLOBALS.batHeight * 0.5;
            }
            else if (newY + GLOBALS.batHeight * 0.5 >= stageHeight) {
                newY = stageHeight - GLOBALS.batHeight * 0.5;
            }
            // X in basket range
            else if (
                newX + 0.5 * GLOBALS.batWidth >= stageWidth - GLOBALS.basketWidth
            ) {
                if (
                    batDirection === "DOWN" &&
                    newY + GLOBALS.batHeight * 0.5 >= stageHeight * 0.5 - GLOBALS.basketHeight * 0.5 - 1 &&
                    newY + GLOBALS.batHeight * 0.5 <= stageHeight * 0.5
                ) {
                    newY = stageHeight * 0.5 - GLOBALS.basketHeight * 0.5 - GLOBALS.batHeight * 0.5 - 1;
                }
                else if (
                    batDirection === "UP" &&
                    newY - GLOBALS.batHeight * 0.5 <= stageHeight * 0.5 + GLOBALS.basketHeight * 0.5 + 1 &&
                    newY - GLOBALS.batHeight * 0.5 >= stageHeight * 0.5
                ) {
                    newY = stageHeight * 0.5 + GLOBALS.basketHeight * 0.5 + GLOBALS.batHeight * 0.5 + 1;
                }
            }
            setBatX(newX);
            setBatY(newY);
            setBatMoved(1);
            setBatClicked(0);
        }
    }, [setBatMoved, batClicked, setBatClicked, batDirection, batStep, batX, setBatX, batY, setBatY, stageWidth, stageHeight]);

    // Drag and Drop control for the bat

    // Start dragging
    function onDragStart(event) {
        const sprite = spriteRef.current;
        if (sprite && sprite.containsPoint(event.data.global)) {
            setIsDragging(true);
            // Store the position where the sprite was grabbed
            sprite.data = event.data;
            sprite.dragging = true;
        }
    }

    // End dragging
    function onDragEnd() {
        setIsDragging(false);
        const sprite = spriteRef.current;
        if (sprite) {
        sprite.dragging = false;
        sprite.data = null;
        }
    }

    // Handle dragging
    function onDragMove() {
        if (isDragging) {
        const sprite = spriteRef.current;
        if (sprite && sprite.dragging) {
            const newPosition = sprite.data.getLocalPosition(sprite.parent);
            setBatX(newPosition.x);
            setBatY(newPosition.y);
        }
        }
    }


    return (
        <Sprite
          ref={spriteRef}
          image={bat}
          x={batX} 
          y={batY}
          anchor={0.5}
          eventMode={'dynamic'}
          pointerdown={onDragStart}
          pointerup={onDragEnd}
          pointerupoutside={onDragEnd}
          pointermove={onDragMove}
        />
    )
}

