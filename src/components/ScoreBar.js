import {Container, Row, Col, Button} from 'react-bootstrap';

function ScoreBar( { currentScore, ballCount, gameOver, setGameOver, startGame, setStartGame } ) {
    const handleStartGame = () => {
        setStartGame(1);
        setGameOver(0);
    }

    return (
        <Container>
            <Row>
                <Col className="text-center">
                    { !gameOver ? (
                        <p className="currentScore">Balls Remaining: {ballCount} Current-Score: {currentScore}</p>
                    ) :
                    ( 
                        <p className="currentScore">Game Over! --- Final Score: {currentScore} &emsp; &emsp;
                          <Button variant="success" onClick={handleStartGame}>Start Game</Button>
                        </p>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default ScoreBar;