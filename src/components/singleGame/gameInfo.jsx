
import { Card, Container, Row, Col } from 'react-bootstrap';

const GameInfo = ({ singleGame }) => {
    return (
        <>
            <Container className=" dark-mode mt-4">
                {singleGame && (
                    <Row>
                        <Col>
                            <h2>{singleGame.name}</h2>
                            <Card className='dark-mode'>
                                <Card.Img variant="top" src={singleGame.image_url} alt={singleGame.title} />
                                <Card.Body >
                                    <Card.Text>Description: {singleGame.description}</Card.Text>
                                    <Card.Text>Genre: {singleGame.genres && singleGame.genres.join(', ')}</Card.Text>
                                    <Card.Text>Release Date: {new Date(singleGame.release_date).toLocaleDateString()}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    );
}

export default GameInfo;