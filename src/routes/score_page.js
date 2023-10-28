import {Container, Row, Col} from 'react-bootstrap'

export default function FrontPage() {
    return (
        <Container>
            <Row>
                {/* Note the use of camel case for css styles */}
                <Col style={ {textAlign: 'center'} }>
                    <h1>Score Page</h1>
                </Col>
            </Row>
        </Container>
    )
}