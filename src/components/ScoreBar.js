import {Container, Row, Col} from 'react-bootstrap';

function ScoreBar( { currentScore } ) {
    return (
        <Container>
            <Row>
                <Col className="text-center">
                    <p className="currentScore">Current-Score: {currentScore}</p>
                </Col>
            </Row>
        </Container>
    )
}

export default ScoreBar;