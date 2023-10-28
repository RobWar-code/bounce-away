import {useState} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import ScoreBar from '../components/ScoreBar';
import GameStage from '../components/GameStage';

export default function GamePage() {
    const [currentScore, setCurrentScore] = useState(0);
    const [scoreDone, setScoreDone] = useState(0);

    return (
        <>
            <ScoreBar currentScore={currentScore}/>
            <Container>
                <Row>
                    {/* Note the use of camel case for css styles */}
                    <Col style={ {textAlign: 'center'} }>
                        <GameStage
                            scoreDone={scoreDone}
                            setScoreDone={setScoreDone}
                            setCurrentScore={setCurrentScore}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    )
}