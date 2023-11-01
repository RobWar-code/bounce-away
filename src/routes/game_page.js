import {useState, useEffect} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import GLOBALS from '../constants';
import ScoreBar from '../components/ScoreBar';
import GameStage from '../components/GameStage';

export default function GamePage() {
    const [currentScore, setCurrentScore] = useState(0);
    const [ballCount, setBallCount] = useState(GLOBALS.ballsPerGame);
    const [scoreDone, setScoreDone] = useState(0);
    const [scoreTable, setScoreTable] = useState([]);
    const [gameOver, setGameOver] = useState(0);

    useEffect ( () => {
        if (ballCount <= 0) {
            setGameOver(1);
            setScoreTable(prevScoreTable => [...prevScoreTable, currentScore]);
        }
    }, [ballCount, setGameOver, currentScore])

    return (
        <>
            <ScoreBar currentScore={currentScore} ballCount={ballCount} gameOver={gameOver} />
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
                        />
                    </Col>
                </Row>
            </Container>
        </>
    )
}