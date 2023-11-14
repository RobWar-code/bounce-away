import {Container, Row, Col} from 'react-bootstrap';
import ScoreTable from '../components/ScoreTable.js';

export default function ScorePage( {scoreTable}) {
    return (
        <Container>
            <Row>
                {/* Note the use of camel case for css styles */}
                <Col className="score-page-title col-light" style={ {textAlign: 'center'} }>
                    <h1>Score Page</h1>
                </Col>
            </Row>
            <ScoreTable />
        </Container>
    )
}