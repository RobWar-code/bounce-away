import {Row, Col, Form, Button} from 'react-bootstrap';
import SoundToggle from './SoundToggle';
import TraceToggle from './TraceToggle';
import BallStepToggle from './BallStepToggle';
import moveBall from '../assets/images/moveBall.png';
import GLOBALS from '../constants';

export default function Tools({
    soundEnabled, 
    setSoundEnabled, 
    traceOn,
    setTraceOn,
    ballStepOn,
    setBallStepOn,
    setBallStepUsed,
    ballStepClicked,
    setBallStepClicked,
    ballTraverseTime, 
    setBallTraverseTime
}) {

    function sliderChange(event) {
        const percent = event.target.value;
        console.log("Slider:", percent);
        const traverseTime = 0.5 * GLOBALS.fastBallTraverseTime + ((100 - percent)/100) * GLOBALS.fastBallTraverseTime;
        setBallTraverseTime(traverseTime);
    }

    const handleBallStepClicked = () => {
        setBallStepClicked(1);
    }

    return (
        <Row>
            <Col sm={12} md={4} className="text-center col-mid">
                <SoundToggle soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled}/>
                <TraceToggle traceOn={traceOn} setTraceOn={setTraceOn} />
                <BallStepToggle ballStepOn={ballStepOn} setBallStepOn={setBallStepOn} setBallStepUsed={setBallStepUsed}/>
                {Boolean(ballStepOn) && (
                    <Button variant="success" className="tool-button" onClick={handleBallStepClicked} title="Let the ball move">
                        <img src={moveBall} alt="Move Ball" title="Move Ball One Step" width="60" height="60" />
                    </Button>
                )
                }
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