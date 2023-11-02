import {useRef, useState, useEffect} from 'react';
import { useApp } from '@pixi/react';
import {Row, Col} from 'react-bootstrap';
import GLOBALS from '../constants';
import btnLeft from '../assets/images/btnLeft.png';
import btnRight from '../assets/images/btnRight.png';
import btnUp from '../assets/images/btnUp.png';
import btnDown from '../assets/images/btnDown.png';


export default function BatControl( {setBatClicked, setBatDirection, setBatStep, stageWidth} ) {
    const app = useApp();
    const [buttonDown, setButtonDown] = useState(0);
    const holdRef = useRef();

    const handleBatClick = (event) => {
        const batD = event.currentTarget.getAttribute("data-batDirection");
        setBatDirection(batD);
        const batS = stageWidth / (GLOBALS.batTraverseTime * 60);
        setBatStep(batS);
        setBatClicked(1);
    }

    const startBatHoldDown = (event) => {
        const batD = event.currentTarget.getAttribute("data-batDirection");
        setBatDirection(batD);
        const batS = stageWidth / (GLOBALS.batTraverseTime * 60);
        setBatStep(batS);
        setBatClicked(1);
        holdRef.current = true;
        setButtonDown(1);
    }

    const stopBatHoldDown = () => {
        holdRef.current = false;
        setButtonDown(0);
    }

    useEffect( () => {
        const issueBatClick = () => {
            if (holdRef.current) {
                setBatClicked(1);
            }
        }

        app.ticker.add(issueBatClick);

        return ( () => {
            app.ticker.remove(issueBatClick);
        })

    });

    return (
        <Row>
            <Col className="text-center">
                <button 
                    className="batControl" 
                    data-batDirection="LEFT" 
                    onClick={handleBatClick}
                    onMouseDown={startBatHoldDown}
                    onMouseLeave={stopBatHoldDown}
                    onMouseUp={stopBatHoldDown}
                >
                    <img src={btnLeft} width="40" height="40" alt="Bat Left"/>
                </button>
                {/*
                <button className="batControl" data-batDirection="RIGHT" onClick={handleBatClick}>
                    <img src={btnRight} width="40" height="40" alt="Bat Right"/>
                </button>
                <button className="batControl" data-batDirection="UP" onClick={handleBatClick}>
                    <img src={btnUp} width="40" height="40" alt="Bat Up"/>
                </button>
                <button className="batControl" data-batDirection="DOWN" onClick={handleBatClick}>
                    <img src={btnDown} width="40" height="40" alt="Bat Down"/>
                </button>
                */}
            </Col>
        </Row>
    )
}