import { Container, Row, Col, Button } from 'react-bootstrap';
const AddReviewBtn = ({show}) => {

    return ( 
        <>
         <Container className="dark-mode m-4">
                        <Row className="justify-content-center">
                            <Col md={6} className='d-flex justify-content-center'>
                                <Button variant="outline-secondary" className='retro-button' onClick={show}>Add a Review</Button>
                            </Col>
                        </Row>
                    </Container>
        </>
     );
}
 
export default AddReviewBtn;