import {Stage, Sprite} from '@pixi/react';
import {useState, useEffect} from 'react';
import MovingBall from './MovingBall'
import Basket from '../assets/images/basket.png';
import Bat from './Bat';

function GameStage( {
    scoreDone, 
    setScoreDone, 
    currentScore, 
    setCurrentScore, 
    ballCount, 
    setBallCount, 
    startGame, 
    setStartGame,
    stageWidth,
    setStageWidth,
    batStep,
    batDirection,
    batMoved,
    setBatMoved,
    batClicked,
    setBatClicked
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
                console.log("newWidth:", newWidth);
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

    return (
        <Stage width={stageWidth} height={stageHeight} options={{backgroundColor: 0xd0d060}}>
            <BasketSprite stageWidth={stageWidth} stageHeight={stageHeight} />
            <Bat 
                    stageWidth={stageWidth} 
                    stageHeight={stageHeight}
                    batMoved={batMoved}
                    setBatMoved={setBatMoved}
                    batClicked={batClicked}
                    setBatClicked={setBatClicked}
                    batStep={batStep}
                    batDirection={batDirection}
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