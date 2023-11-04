import {useRef, useState, useEffect} from 'react';
import {Row, Col} from 'react-bootstrap';
import GLOBALS from '../constants';
import btnLeft from '../assets/images/btnLeft.png';
import btnRight from '../assets/images/btnRight.png';
import btnUp from '../assets/images/btnUp.png';
import btnDown from '../assets/images/btnDown.png';


export default function BatControl( {setBatClicked, setBatDirection, setBatStep, stageWidth} ) {
    const [buttonDown, setButtonDown] = useState(0);
    const intervalId = useRef(null);

    const handleSingleClick = (event) => {
        const batD = event.currentTarget.getAttribute("data-batdirection");
        setBatDirection(batD);
        const batS = stageWidth / (GLOBALS.batTraverseTime * GLOBALS.batStepsPerSecond);
        setBatStep(batS);
        setBatClicked(1);
    }

    const startBatHoldDown = (event) => {
        const batD = event.currentTarget.getAttribute("data-batdirection");
        setBatDirection(batD);
        const batS = stageWidth / (GLOBALS.batTraverseTime * GLOBALS.batStepsPerSecond);
        setBatStep(batS);
        setButtonDown(1);
        if (intervalId.current) clearInterval(intervalId.current);
        intervalId.current = setInterval(() => {
            setBatClicked(1);
        }, 1000 / GLOBALS.batStepsPerSecond);
    }

    const stopBatHoldDown = () => {
        setButtonDown(0);
        clearInterval(intervalId.current);
    }

    useEffect( () => {
        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
        }
    }, []);

    return (
        <Row>
            <Col className="text-center">
                <span>Use these buttons or drag and drop to move the bat &emsp;</span>
                <button 
                    className="batControl" 
                    data-batdirection="LEFT" 
                    onClick={handleSingleClick}
                    onMouseDown={startBatHoldDown}
                    onTouchStart={startBatHoldDown}
                    onMouseLeave={stopBatHoldDown}
                    onMouseUp={stopBatHoldDown}
                    onTouchEnd={stopBatHoldDown}
                >
                    <img src={btnLeft} width="40" height="40" alt="Bat Left"/>
                </button>
                <button 
                    className="batControl" 
                    data-batdirection="RIGHT"
                    onClick={handleSingleClick}
                    onMouseDown={startBatHoldDown}
                    onTouchStart={startBatHoldDown}
                    onMouseLeave={stopBatHoldDown}
                    onMouseUp={stopBatHoldDown}
                    onTouchEnd={stopBatHoldDown}
                >
                    <img src={btnRight} width="40" height="40" alt="Bat Right"/>
                </button>
                <button 
                    className="batControl" 
                    data-batdirection="UP"
                    onClick={handleSingleClick}
                    onMouseDown={startBatHoldDown}
                    onTouchStart={startBatHoldDown}
                    onMouseLeave={stopBatHoldDown}
                    onMouseUp={stopBatHoldDown}
                    onTouchEnd={stopBatHoldDown}
                >
                    <img src={btnUp} width="40" height="40" alt="Bat Up"/>
                </button>
                <button 
                    className="batControl" 
                    data-batdirection="DOWN"
                    onClick={handleSingleClick}
                    onMouseDown={startBatHoldDown}
                    onTouchStart={startBatHoldDown}
                    onMouseLeave={stopBatHoldDown}
                    onMouseUp={stopBatHoldDown}
                    onTouchEnd={stopBatHoldDown}
                >
                    <img src={btnDown} width="40" height="40" alt="Bat Down"/>
                </button>
            </Col>
        </Row>
    )
}