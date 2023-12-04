import {Button} from 'react-bootstrap';

export default function BallStepToggle({ballStepOn, setBallStepOn}) {

    function handleToggle() {
        ballStepOn ? setBallStepOn(0) : setBallStepOn(1);
    }

    return (
        <Button variant="success" onClick={handleToggle}>
            { ballStepOn ?
                "BALL STEP ON" : "BALL STEP OFF"
            }
        </Button>
    )
}