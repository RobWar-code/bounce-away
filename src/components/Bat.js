import {useEffect, useState, useRef} from "react";
import {Sprite} from '@pixi/react';
import '@pixi/events';
import bat from '../assets/images/bat.png';
import GLOBALS from '../constants';

export default function Bat( {
    stageWidth, 
    stageHeight,
    batMoved,
    setBatMoved,
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


    // Drag and Drop control for the bat

    // Start dragging
    function onDragStart(event) {
        const sprite = spriteRef.current;
        setBatMoved(1);
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
                let bx = newPosition.x;
                let by = newPosition.y;
                let [bx1, by1] = checkInBasket(bx,by);
                setBatX(bx1);
                setBatY(by1);
            }
        }
    }

    function checkInBasket(bx, by) {
        // Basket
        const basketTop = 0.5 * stageHeight - 0.5 * GLOBALS.basketHeight;
        const basketBottom = 0.5 * stageHeight + 0.5 * GLOBALS.basketHeight;
        const basketLeft = stageWidth - GLOBALS.basketWidth;

        // Left of Basket
        if (by + 0.5 * GLOBALS.batHeight > basketTop &&
            by - 0.5 * GLOBALS.batHeight < basketBottom &&
            bx + 0.5 * GLOBALS.batWidth > basketLeft &&
            bx < basketLeft + 0.5 * GLOBALS.basketWidth)
        {
            bx = basketLeft - 0.5 * GLOBALS.basketWidth;
        }

        // Top of Basket
        else if (by + 0.5 * GLOBALS.batHeight > basketTop && 
            by < basketTop + GLOBALS.basketHeight * 0.5 &&
            bx > basketLeft) {
            by = basketTop - 0.5 * GLOBALS.batHeight;
        }

        // Bottom of Basket
        else if (by - 0.5 * GLOBALS.batHeight < basketBottom &&
            by > basketBottom - GLOBALS.basketHeight * 0.5 &&
            bx > basketLeft) {
            by = basketBottom + 0.5 * GLOBALS.batHeight;
        }

        return [bx, by];
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

