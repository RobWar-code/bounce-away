import {Stage, Sprite} from '@pixi/react';
import {useState, useEffect} from 'react';
import MovingBall from './MovingBall'
import Basket from '../assets/images/basket.png';
import Bat from './Bat';

function GameStage( {scoreDone, setScoreDone, currentScore, setCurrentScore, ballCount, setBallCount} ) {
    const maxStageWidth = 1200;
    const stageHeight = 400;
    const [stageWidth, setStageWidth] = useState(maxStageWidth);
    const [newBall, setNewBall] = useState(1);
    const [batX, setBatX] = useState(0);
    const [batY, setBatY] = useState(0);
    const [doMove, setDoMove] = useState(0);
    const [batMoved, setBatMoved] = useState(0);
    const [motionDirection, setMotionDirection] = useState(0);

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

    }, [maxStageWidth]);

    return (
        <Stage width={stageWidth} height={stageHeight} options={{backgroundColor: 0xd0d060}}>
            <BasketSprite stageWidth={stageWidth} stageHeight={stageHeight} />
            <Bat 
                    stageWidth={stageWidth} 
                    stageHeight={stageHeight}
                    batMoved={batMoved}
                    setBatMoved={setBatMoved}
                    doMove={doMove} 
                    setDoMove={setDoMove} 
                    motionDirection={motionDirection} 
                    batX={batX} 
                    setBatX={setBatX} 
                    batY={batY} 
                    setBatY={setBatY}
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