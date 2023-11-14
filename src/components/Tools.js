import {Row, Col, Form} from 'react-bootstrap';
import SoundToggle from './SoundToggle';
import GLOBALS from '../constants';

export default function Tools({
    soundEnabled, 
    setSoundEnabled, 
    ballTraverseTime, 
    setBallTraverseTime
}) {

    function sliderChange(event) {
        const percent = event.target.value;
        console.log("Slider:", percent);
        const traverseTime = 0.5 * GLOBALS.fastBallTraverseTime + ((100 - percent)/100) * GLOBALS.fastBallTraverseTime;
        setBallTraverseTime(traverseTime);
    }

    return (
        <Row>
            <Col sm={12} md={4} className="text-center col-mid">
                <SoundToggle soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled}/>
            </Col>
            <Col sm={12} md={4} className="text-center col-light">
                Click the stage to move the bat to the cursor or drag and drop to move the bat
            </Col>
            <Col sm={12} md={4} className="text-center col-mid">
                <p className="sliderHead">Ball Start Speed</p>
                <span className="sliderText">Slow&emsp;</span>
                <Form.Range className="speedSlider" defaultValue={50} onChange={sliderChange}/>
                <span className="sliderText">&emsp;Fast</span>
            </Col>
        </Row>
    )
}