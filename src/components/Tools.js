import {Row, Col} from 'react-bootstrap';
import SoundToggle from './SoundToggle';

export default function Tools() {
    return (
        <Row>
            <Col sm={2} style={{textAlign: 'right'}}>
                <SoundToggle />
            </Col>
            <Col sm={8} style={{textAlign: 'center'}}>
                Click the stage to move the bat to the cursor or drag and drop to move the bat
            </Col>
        </Row>
    )
}