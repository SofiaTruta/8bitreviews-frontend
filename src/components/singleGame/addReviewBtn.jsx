import { Container, Row, Col, Button } from 'react-bootstrap';
const AddReviewBtn = ({show}) => {

    return ( 
        <>
         <Container className="dark-mode mt-4">
                        <Row>
                            <Col>
                                <Button variant="primary" onClick={show}>Add a Review</Button>
                            </Col>
                        </Row>
                    </Container>
        </>
     );
}
 
export default AddReviewBtn;