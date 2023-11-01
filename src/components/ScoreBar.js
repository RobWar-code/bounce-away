import {Container, Row, Col} from 'react-bootstrap';

function ScoreBar( { currentScore, ballCount, gameOver } ) {
    return (
        <Container>
            <Row>
                <Col className="text-center">
                    { !gameOver ? (
                        <p className="currentScore">Balls Remaining: {ballCount} Current-Score: {currentScore}</p>
                    ) :
                    ( 
                        <p className="currentScore">Game Over! --- Final Score: {currentScore} </p>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default ScoreBar;