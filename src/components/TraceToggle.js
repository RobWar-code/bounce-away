import {Button} from 'react-bootstrap';
import traceOnImg from '../assets/images/pathTraceOn.png';
import traceOffImg from '../assets/images/pathTraceOff.png';


export default function TraceToggle({traceOn, setTraceOn}) {

    function handleToggle() {
        traceOn ? setTraceOn(0) : setTraceOn(1);
    }

    return (
        <Button variant="success" onClick={handleToggle}>
            { traceOn ?
                <img src={traceOnImg} alt="Trace On" title="Trace Off" width="60" height="60" /> :
                <img src={traceOffImg} alt="Trace Off" title="Trace On" width="60" height="60" /> 
            }
        </Button>
    )
}