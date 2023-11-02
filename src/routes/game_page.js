import {useState, useEffect} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {AppProvider} from '@pixi/react';
import GLOBALS from '../constants';
import ScoreBar from '../components/ScoreBar';
import GameStage from '../components/GameStage';
import BatControl from '../components/BatControl';

export default function GamePage() {
    const [currentScore, setCurrentScore] = useState(0);
    const [ballCount, setBallCount] = useState(GLOBALS.ballsPerGame);
    const [scoreDone, setScoreDone] = useState(0);
    const [scoreTable, setScoreTable] = useState([]);
    const [gameOver, setGameOver] = useState(0);
    const [startGame, setStartGame] = useState(0);
    const [batStep, setBatStep] = useState(2);
    const [batDirection, setBatDirection] = useState("UP");
    const [batMoved, setBatMoved] = useState(0);
    const [batClicked, setBatClicked] = useState(0);
    const [stageWidth, setStageWidth] = useState(1200);


    useEffect ( () => {
        if (ballCount <= 0) {
            setGameOver(1);
            setScoreTable(prevScoreTable => [...prevScoreTable, currentScore]);
        }
    }, [ballCount, setGameOver, currentScore])

    return (
        <>
            <ScoreBar 
                currentScore={currentScore} 
                ballCount={ballCount} 
                gameOver={gameOver} 
                setGameOver={setGameOver}
                startGame={startGame} 
                setStartGame={setStartGame}
            />
            <Container>
                <Row>
                    {/* Note the use of camel case for css styles */}
                    <Col style={ {textAlign: 'center'} }>
                        <GameStage
                            scoreDone={scoreDone}
                            setScoreDone={setScoreDone}
                            currentScore={currentScore}
                            setCurrentScore={setCurrentScore}
                            ballCount={ballCount}
                            setBallCount={setBallCount}
                            startGame={startGame}
                            setStartGame={setStartGame}
                            stageWidth={stageWidth}
                            setStageWidth={setStageWidth}
                            batClicked={batClicked}
                            setBatClicked={setBatClicked}
                            batMoved={batMoved}
                            setBatMoved={setBatMoved}
                            batDirection={batDirection}
                            batStep={batStep}
                        />
                    </Col>
                </Row>
                <AppProvider>
                <BatControl 
                    setBatClicked={setBatClicked} 
                    setBatStep={setBatStep} 
                    setBatDirection={setBatDirection} 
                    stageWidth={stageWidth}
                />
                </AppProvider>
            </Container>
        </>
    )
}