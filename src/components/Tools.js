import {Row, Col, Form} from 'react-bootstrap';
import SoundToggle from './SoundToggle';
import GLOBALS from '../constants';

export default function Tools({ballTraverseTime, setBallTraverseTime}) {

    function sliderChange(event) {
        const percent = event.target.value;
        console.log("Slider:", percent);
        const traverseTime = 0.5 * GLOBALS.fastBallTraverseTime + ((100 - percent)/100) * GLOBALS.fastBallTraverseTime;
        setBallTraverseTime(traverseTime);
    }

    return (
        <Row>
            <Col sm={2} style={{textAlign: 'right'}}>
                <SoundToggle />
            </Col>
            <Col sm={5} style={{textAlign: 'center'}}>
                Click the stage to move the bat to the cursor or drag and drop to move the bat
            </Col>
            <Col sm={5} style={{textAlign: 'center'}}>
                <p>Ball Start Speed</p>
                <span className="sliderText">Slow</span>
                <Form.Range className="speedSlider" defaultValue={50} onChange={sliderChange}/>
                <span className="sliderText">Fast</span>
            </Col>
        </Row>
    )
}