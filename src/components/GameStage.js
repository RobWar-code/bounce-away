import {Stage, Sprite} from '@pixi/react';
import {useState, useEffect} from 'react';
import MovingBall from '../components/MovingBall'
import Basket from '../assets/images/basket.png';

function GameStage( {scoreDone, setScoreDone, setCurrentScore} ) {
    const maxStageWidth = 1200;
    const stageHeight = 400;
    const [stageWidth, setStageWidth] = useState(maxStageWidth);
    const [newBall, setNewBall] = useState(1);

    useEffect(() => {
        if (scoreDone === 0) {
            setCurrentScore(20);
            setScoreDone(1);
        }
    }, [scoreDone, setCurrentScore, setScoreDone]);

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

    }, [maxStageWidth]);

    return (
        <Stage width={stageWidth} height={stageHeight} options={{backgroundColor: 0xd0d060}}>
            <BasketSprite stageWidth={stageWidth} stageHeight={stageHeight} />
            <MovingBall 
                newBall={newBall} 
                setNewBall={setNewBall} 
                stageWidth={stageWidth} 
                stageHeight={stageHeight} 
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