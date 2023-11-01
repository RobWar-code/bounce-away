import {Row, Col} from 'react-bootstrap';
import GLOBALS from '../constants';
import btnLeft from '../assets/images/btnLeft.png';
import btnRight from '../assets/images/btnRight.png';
import btnUp from '../assets/images/btnUp.png';
import btnDown from '../assets/images/btnDown.png';


export default function BatControl( {setBatMoved, setBatDirection, setBatStep, stageWidth} ) {
    const handleBatControl = (event) => {
        const batD = event.currentTarget.getAttribute("data-batDirection");
        setBatDirection(batD);
        const batS = stageWidth / (GLOBALS.batTraverseTime * 60);
        setBatStep(batS);
        setBatMoved(1);
    }

    return (
        <Row>
            <Col className="text-center">
                <button className="batControl" data-batDirection="LEFT" onClick={handleBatControl}>
                    <img src={btnLeft} width="40" height="40" alt="Bat Left"/>
                </button>
                <button className="batControl" data-batDirection="RIGHT" onClick={handleBatControl}>
                    <img src={btnRight} width="40" height="40" alt="Bat Right"/>
                </button>
                <button className="batControl" data-batDirection="UP" onClick={handleBatControl}>
                    <img src={btnUp} width="40" height="40" alt="Bat Up"/>
                </button>
                <button className="batControl" data-batDirection="DOWN" onClick={handleBatControl}>
                    <img src={btnDown} width="40" height="40" alt="Bat Down"/>
                </button>
            </Col>
        </Row>
    )
}