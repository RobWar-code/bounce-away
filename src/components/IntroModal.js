import {Modal, Button} from 'react-bootstrap';

export default function IntroModal( {setIntroDue} ) {

    const handleIntroDue = () => {
        setIntroDue(0);
    }

    return (
       <Modal
            show="show" onHide={handleIntroDue}
        >
            <Modal.Dialog>
            <Modal.Header closeButton>
                <Modal.Title>Bounce-Away Introduction</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <h3>Welcome To Bounce-Away</h3>
                <p>
                    Use the bat at the centre of the stage to bounce the ball which appears
                    on the left into the net on the right.
                </p>
                <p>
                    You can use the feature buttons on the bottom-left to provide you with
                    some help. These reduce your score, but you can use them tactically to
                    get higher game score overall.
                </p>
                <p>
                    There is also a ball speed control on the bottom, which you can use.
                    The fast the ball goes the higher your score will be.
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={handleIntroDue}>Begin</Button>
            </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    )
}