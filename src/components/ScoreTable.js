import {useEffect, useState} from 'react';
import {useOutletContext} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';

export default function ScoreTable() {
    const [scoreTable,] = useOutletContext();
    const [highScore, setHighScore] = useState(0);

    useEffect( () => {
        if (scoreTable.length > 0) {
            let newHighScore = Math.max(...scoreTable);
            setHighScore(newHighScore);
        }
    }, [scoreTable]);

    return (
        <>
        <Row className={["scoreHeading", "scoreTable"]}>
            <Col xs={1} />
            <Col xs={5} className="col-light">
                <p>Game Number</p>
            </Col>
            <Col xs={5} className="col-mid">
                <p>Score</p>
            </Col>
        </Row>
        {scoreTable.map((scoreItem, index) => {
            return (
                <Row className="scoreTable" key={index}>
                    <Col xs={1} />
                    <Col xs={5} className="col-light">{index + 1}</Col>
                    <Col xs={5} className="col-mid">{scoreItem}</Col>
                    <Col xs={1} />
                </Row>
            )
        })}
        <Row>
            <Col className="text-center col-light high-score-col">
                <p className="scoreTable">High Score: {highScore}</p>
            </Col>
        </Row>
        </>
    )
}