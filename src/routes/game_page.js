import {useState, useEffect} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
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
                            batStep={batStep}
                            batDirection={batDirection}
                            batMoved={batMoved}
                            setBatMoved={setBatMoved}
                        />
                    </Col>
                </Row>
                <BatControl 
                    setBatMoved={setBatMoved} 
                    setBatStep={setBatStep} 
                    setBatDirection={setBatDirection} 
                    stageWidth={stageWidth}
                />
            </Container>
        </>
    )
}