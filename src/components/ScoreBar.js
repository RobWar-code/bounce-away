import {Container, Row, Col, Button} from 'react-bootstrap';
import GLOBALS from '../constants';

function ScoreBar( { 
    justLaunched, 
    setJustLaunched, 
    currentScore, 
    setCurrentScore, 
    ballCount, 
    setBallCount,
    gameOver, 
    setGameOver, 
    startGame, 
    setStartGame } ) {
        
    const handleJustLaunched = () => {
        setBallCount(GLOBALS.ballsPerGame)
        setJustLaunched(0);
        setStartGame(1);
        setGameOver(0);
    }

    const handleStartGame = () => {
        setBallCount(GLOBALS.ballsPerGame)
        setStartGame(1);
        setGameOver(0);
        setCurrentScore(0);
    }

    return (
        <Container>
            <Row>
                { justLaunched ? (
                    <>
                    <Col sm={12} md={6} className="text-center currentScore col-light">
                        Bounce Away!
                    </Col>
                    <Col sm={12} md={6} className="text-center currentScore col-exlight">
                        <Button variant="success" className="start-button" onClick={handleJustLaunched}>Start Game</Button>
                    </Col>
                    </>
                ) :
                !gameOver ? (
                    <>
                    <Col sm={12} md={6} className="text-center currentScore col-light">
                        Balls Remaining: {ballCount}
                    </Col> 
                    <Col sm={12} md={6} className="text-center currentScore col-exlight">
                        Current-Score: {currentScore}
                    </Col>
                    </>
                ) :
                ( 
                    <>
                    <Col sm={12} md={6} className="currentScore text-center col-light">
                        Game Over! --- Final Score: {currentScore}
                    </Col>
                    <Col sm={12} md={6} className="currentScore text-center col-exlight">
                        <Button variant="success" className="start-button" onClick={handleStartGame}>Start Game</Button>
                    </Col>
                    </>
                )}
            </Row>
        </Container>
    )
}

export default ScoreBar;