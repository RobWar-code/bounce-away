import {useEffect, useRef, useCallback} from "react";
import {Sprite} from '@pixi/react';
import '@pixi/events';
import bat from '../assets/images/bat.png';
import GLOBALS from '../constants';

export default function Bat( {
    stageWidth, 
    stageHeight,
    oldStageWidth,
    stageWidthAdjusted,
    setStageWidthAdjusted,
    batMoved,
    setBatMoved,
    batStageClicked,
    setBatStageClicked,
    batCursorX,
    batCursorY,
    batX, 
    setBatX, 
    batY, 
    setBatY,
    isBatDragging,
    setIsBatDragging,
    batVectorX,
    setBatVectorX,
    batVectorY,
    setBatVectorY,
    startGame} ) {

    const spriteRef = useRef();

    // Check for a resize and adjust the position of the bat accordingly
    useEffect(() => {
        if (stageWidthAdjusted) {
            console.log("Adjusted");
            const bx = batX * stageWidth/oldStageWidth;
            setBatX(bx);
            setStageWidthAdjusted(0);
        }
    }, [stageWidth, oldStageWidth, batX, setBatX, stageWidthAdjusted, setStageWidthAdjusted])

    const checkInBasket = useCallback((bx, by) => {
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
    }, [stageWidth, stageHeight])

    // Initial Position
    useEffect(() => {
        // Set initial position etc.
        if (startGame || !batMoved) {
            setBatX(0.5 * stageWidth);
            setBatY(0.5 * stageHeight);
        }
    }, [startGame, batMoved, stageWidth, stageHeight, setBatX, setBatY])

    // Stage Clicked to Move Bat
    useEffect(() => {
        if (batStageClicked) {
            let bx = batCursorX;
            let by = batCursorY;

            // Check whether on edge
            // Left
            if (bx - GLOBALS.batWidth * 0.5 < 0) {
                bx = GLOBALS.batWidth * 0.5;
            }
            // Top
            if (by - GLOBALS.batHeight * 0.5 < 0) {
                by = GLOBALS.batHeight * 0.5;
            }
            // Bottom
            if (by + GLOBALS.batHeight * 0.5 > stageHeight) {
                by = stageHeight - GLOBALS.batHeight * 0.5;
            }
            // Right
            if (bx + GLOBALS.batWidth * 0.5 > stageWidth) {
                bx = stageWidth - GLOBALS.batWidth * 0.5;
            }

            let [bx1, by1] = checkInBasket(bx, by);
            setBatX(bx1);
            setBatY(by1);

            setBatStageClicked(0);

        }

    }, [
        setBatX, 
        setBatY, 
        batCursorX, 
        batCursorY, 
        batStageClicked, 
        setBatStageClicked,
        checkInBasket,
        stageHeight,
        stageWidth
    ])

    // Drag and Drop control for the bat

    // Start dragging
    function onDragStart(event) {
        const sprite = spriteRef.current;
        setBatMoved(1);
        if (sprite && sprite.containsPoint(event.data.global)) {
            setIsBatDragging(1);
            // Store the position where the sprite was grabbed
            sprite.data = event.data;
            sprite.dragging = true;
        }
    }

    // End dragging
    function onDragEnd() {
        setIsBatDragging(0);
        const sprite = spriteRef.current;
        if (sprite) {
        sprite.dragging = false;
        sprite.data = null;
        }
    }

    // Handle dragging
    function onDragMove() {
        if (isBatDragging) {
            const sprite = spriteRef.current;
            if (sprite && sprite.dragging) {
                const newPosition = sprite.data.getLocalPosition(sprite.parent);
                let bx = newPosition.x;
                let by = newPosition.y;
                let [bx1, by1] = checkInBasket(bx,by);
                // Calculate Bat Vector
                let vx = bx - batX;
                let vy = by - batY;
                setBatVectorX(vx);
                setBatVectorY(vy);
                setBatX(bx1);
                setBatY(by1);
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

