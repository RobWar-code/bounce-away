import {Container, Row, Col} from 'react-bootstrap';

function ScoreBar( { currentScore, ballCount } ) {
    return (
        <Container>
            <Row>
                <Col className="text-center">
                    <p className="currentScore">Balls Remaining: {ballCount} Current-Score: {currentScore}</p>
                </Col>
            </Row>
        </Container>
    )
}

export default ScoreBar;