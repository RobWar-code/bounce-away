import {Row, Col} from 'react-boostrap';
import btnLeft from '../assets/images/btnLeft.png';
import btnRight from '../assets/images/btnRight.png';
import btnUp from '../assets/images/btnUp.png';
import btnDown from '../assets/images/btnDown.png';


export default function BatControl( {} ) {
    return (
        <Row>
            <Col className="text-center">
                <button className="batControl"><img src={btnLeft} width="40" height="40"/></button>
                <button className="batControl"><img src={btnRight} width="40" height="40"/></button>
                <button className="batControl"><img src={btnUp} width="40" height="40"/></button>
                <button className="batControl"><img src={btnDown} width="40" height="40"/></button>
            </Col>
        </Row>
    )
}