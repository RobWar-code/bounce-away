import {useState, useEffect} from 'react';
import {useOutletContext} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import GLOBALS from '../constants';
import ScoreBar from '../components/ScoreBar';
import GameStage from '../components/GameStage';
import Tools from '../components/Tools';

export default function GamePage() {
    const [justLaunched, setJustLaunched] = useState(1);
    const [currentScore, setCurrentScore] = useState(0);
    const [ballCount, setBallCount] = useState(0);
    const [gameOver, setGameOver] = useState(1);
    const [startGame, setStartGame] = useState(0);
    const [batMoved, setBatMoved] = useState(0);
    const [stageWidth, setStageWidth] = useState(1200);
    const [, setScoreTable] = useOutletContext();
    const [ballTraverseTime, setBallTraverseTime] = useState(GLOBALS.fastBallTraverseTime);
    const [soundEnabled, setSoundEnabled] = useState(
        JSON.parse(localStorage.getItem('soundEnabled')) || false
    );

    useEffect ( () => {
        if (ballCount <= 0 && !gameOver && !justLaunched) {
            setGameOver(1);
            setScoreTable(prevScoreTable => [...prevScoreTable, currentScore]);
        }
    }, [ballCount, gameOver, setGameOver, currentScore, justLaunched, setScoreTable])

    return (
        <>
            <ScoreBar
                currentScore={currentScore} 
                setCurrentScore={setCurrentScore}
                ballCount={ballCount} 
                setBallCount={setBallCount}
                gameOver={gameOver} 
                setGameOver={setGameOver}
                justLaunched={justLaunched}
                setJustLaunched={setJustLaunched}
                startGame={startGame} 
                setStartGame={setStartGame}
            />
            <Container>
                <Row>
                    {/* Note the use of camel case for css styles */}
                    <Col id="stageCol" style={ {textAlign: 'center'} }>
                        <GameStage
                            currentScore={currentScore}
                            setCurrentScore={setCurrentScore}
                            ballCount={ballCount}
                            setBallCount={setBallCount}
                            startGame={startGame}
                            setStartGame={setStartGame}
                            stageWidth={stageWidth}
                            setStageWidth={setStageWidth}
                            batMoved={batMoved}
                            setBatMoved={setBatMoved}
                            ballTraverseTime={ballTraverseTime}
                            soundEnabled={soundEnabled}
                        />
                    </Col>
                </Row>
                <Tools 
                    soundEnabled={soundEnabled}
                    setSoundEnabled={setSoundEnabled}
                    ballTraverseTime={ballTraverseTime}
                    setBallTraverseTime={setBallTraverseTime}
                />
            </Container>
        </>
    )
}