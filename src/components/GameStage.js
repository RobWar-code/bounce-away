import {Stage, Sprite} from '@pixi/react';
import '@pixi/events';
import {useState, useEffect} from 'react';
import GLOBALS from '../constants';
import MovingBall from './MovingBall'
import Basket from '../assets/images/basket.png';
import Bat from './Bat';

function GameStage( {
    currentScore, 
    setCurrentScore, 
    ballCount, 
    setBallCount, 
    startGame, 
    setStartGame,
    stageWidth,
    setStageWidth,
    batMoved,
    setBatMoved
} ) {
    const maxStageWidth = 1200;
    const stageHeight = 400;
    const [newBall, setNewBall] = useState(0);
    const [batX, setBatX] = useState(0);
    const [batY, setBatY] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const {innerWidth} = window;
            if (innerWidth < 1400) {
                let newWidth = (innerWidth/1400) * maxStageWidth;
                setStageWidth(newWidth);
            }
            else {
                setStageWidth(maxStageWidth);
            }
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [maxStageWidth, setStageWidth]);

    const stageClicked = (event) => {
        let cursorX = event.clientX;
        let cursorY = event.clientY;
        let offsetX = Math.floor(event.target.getBoundingClientRect().left) + 2;
        let offsetY = Math.floor(event.target.getBoundingClientRect().top) + 2;
        let bx = cursorX - offsetX;
        let by = cursorY - offsetY;

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

        setBatX(bx);
        setBatY(by);
    }
    
    return (
        <Stage 
            width={stageWidth} 
            height={stageHeight} 
            options={{backgroundColor: 0xd0d060}} 
            onMouseDown={stageClicked}
        >
            <BasketSprite stageWidth={stageWidth} stageHeight={stageHeight} />
            <Bat 
                stageWidth={stageWidth} 
                stageHeight={stageHeight}
                batMoved={batMoved}
                setBatMoved={setBatMoved}
                batX={batX} 
                setBatX={setBatX} 
                batY={batY} 
                setBatY={setBatY}
                startGame={startGame}
            />
            <MovingBall 
                newBall={newBall} 
                setNewBall={setNewBall}
                batX={batX}
                batY={batY}
                stageWidth={stageWidth} 
                stageHeight={stageHeight} 
                currentScore={currentScore}
                setCurrentScore={setCurrentScore}
                ballCount={ballCount}
                setBallCount={setBallCount}
                startGame={startGame}
                setStartGame={setStartGame}
            />
        </Stage>
    )
}

const BasketSprite = ({stageWidth, stageHeight}) => {
    const basketWidth = 70;
    const basketHeight = 70;

    const basketRight = stageWidth - basketWidth;
    const basketTop = stageHeight/2 - basketHeight/2;

    return (
        <Sprite
            image={Basket}
            x={basketRight}
            y={basketTop}
            anchor={{x:0, y:0}}
        />
    )
}

export default GameStage;