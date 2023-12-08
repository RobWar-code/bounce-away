import {Stage, Sprite} from '@pixi/react';
import '@pixi/events';
import {useState, useEffect} from 'react';
import MovingBall from './MovingBall'
import Basket from '../assets/images/basket.png';
import Bat from './Bat';

function GameStage( {
    currentScore, 
    setCurrentScore, 
    ballCount, 
    setBallCount,
    ballTraverseTime, 
    startGame, 
    setStartGame,
    stageWidth,
    setStageWidth,
    batMoved,
    setBatMoved,
    soundEnabled,
    traceOn,
    ballStepOn,
    ballStepUsed,
    setBallStepUsed,
    ballStepClicked,
    setBallStepClicked,
    setLastBallScore
} ) {
    const maxStageWidth = 1200;
    const stageHeight = 400;
    const [newBall, setNewBall] = useState(0);
    const [batX, setBatX] = useState(0);
    const [batY, setBatY] = useState(0);
    const [batStageClicked, setBatStageClicked] = useState(0);
    const [batCursorX, setBatCursorX] = useState(0);
    const [batCursorY, setBatCursorY] = useState(0);
    const [isBatDragging, setIsBatDragging] = useState(0);
    const [batVectorX, setBatVectorX] = useState(0);
    const [batVectorY, setBatVectorY] = useState(0);
    const [oldStageWidth, setOldStageWidth] = useState(1200);
    const [stageWidthAdjusted, setStageWidthAdjusted] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const {innerWidth} = window;
            setOldStageWidth(stageWidth);
            setStageWidthAdjusted(1);
            if (innerWidth < 1400) {
                let newWidth = document.getElementById("stageCol").offsetWidth - 4;
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

    }, [maxStageWidth, stageWidth, setStageWidth, setOldStageWidth, setStageWidthAdjusted]);

    const stageClicked = (event) => {
        let cursorX = event.clientX;
        let cursorY = event.clientY;
        let offsetX = Math.floor(event.target.getBoundingClientRect().left) + 2;
        let offsetY = Math.floor(event.target.getBoundingClientRect().top) + 2;
        let bx = cursorX - offsetX;
        let by = cursorY - offsetY;

        setBatStageClicked(1);
        setBatCursorX(bx);
        setBatCursorY(by);
    }
    
    return (
        <Stage 
            className="gameStage"
            width={stageWidth} 
            height={stageHeight} 
            options={{backgroundColor: 0xd0d060}} 
            onMouseDown={stageClicked}
        >
            <BasketSprite stageWidth={stageWidth} stageHeight={stageHeight} />
            <Bat 
                stageWidth={stageWidth} 
                stageHeight={stageHeight}
                oldStageWidth={oldStageWidth}
                stageWidthAdjusted={stageWidthAdjusted}
                setStageWidthAdjusted={setStageWidthAdjusted}
                batMoved={batMoved}
                setBatMoved={setBatMoved}
                batStageClicked={batStageClicked}
                setBatStageClicked={setBatStageClicked}
                batCursorX={batCursorX}
                batCursorY={batCursorY}
                batX={batX} 
                setBatX={setBatX} 
                batY={batY} 
                setBatY={setBatY}
                isBatDragging={isBatDragging}
                setIsBatDragging={setIsBatDragging}
                batVectorX={batVectorX}
                setBatVectorX={setBatVectorX}
                batVectorY={batVectorY}
                setBatVectorY={setBatVectorY}
                startGame={startGame}
            />
            <MovingBall 
                newBall={newBall} 
                setNewBall={setNewBall}
                batX={batX}
                batY={batY}
                isBatDragging={isBatDragging}
                batVectorX={batVectorX}
                batVectorY={batVectorY}
                soundEnabled={soundEnabled}
                traceOn={traceOn}
                ballStepOn={ballStepOn}
                ballStepUsed={ballStepUsed}
                setBallStepUsed={setBallStepUsed}
                ballStepClicked={ballStepClicked}
                setBallStepClicked={setBallStepClicked}
                stageWidth={stageWidth} 
                stageHeight={stageHeight} 
                setLastBallScore={setLastBallScore}
                currentScore={currentScore}
                setCurrentScore={setCurrentScore}
                ballCount={ballCount}
                setBallCount={setBallCount}
                ballTraverseTime={ballTraverseTime}
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