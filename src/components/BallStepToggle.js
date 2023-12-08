import {Button} from 'react-bootstrap';
import ballStep from '../assets/images/ballStep.png';
import ballStepOff from '../assets/images/ballStepOff.png';

export default function BallStepToggle({ballStepOn, setBallStepOn, setBallStepUsed}) {

    function handleToggle() {
        if (ballStepOn) {
            setBallStepOn(0);
        }
        else {
            setBallStepOn(1);
            setBallStepUsed(1);
        }
    }

    return (
        <Button variant="success" className="tool-button" onClick={handleToggle}>
            { ballStepOn ?
                <img src={ballStep} alt="Ball Step On" title="Ball Step Mode On" width="60" height="60" />:
                <img src={ballStepOff} alt="Ball Step Off" title="Ball Step Mode Off" width="60" height="60" />
            }
        </Button>
    )
}