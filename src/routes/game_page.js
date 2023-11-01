import {useState} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import ScoreBar from '../components/ScoreBar';
import GameStage from '../components/GameStage';

export default function GamePage() {
    const [currentScore, setCurrentScore] = useState(0);
    const [ballCount, setBallCount] = useState(5);
    const [scoreDone, setScoreDone] = useState(0);

    return (
        <>
            <ScoreBar currentScore={currentScore} ballCount={ballCount}/>
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