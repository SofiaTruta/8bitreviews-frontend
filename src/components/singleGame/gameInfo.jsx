
import { Card, Container, Row, Col } from 'react-bootstrap';

const GameInfo = ({ singleGame }) => {
    return (
        <>
            <Container className="dark-mode my-4">
                {singleGame && (
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <h2>{singleGame.name}</h2>
                            <Card className="dark-mode static">
                                <Card.Img
                                    variant="top"
                                    src={singleGame.image_url}
                                    alt={singleGame.title}
                                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                                />
                                <Card.Body>
                                    <Card.Text>Genre: {singleGame.genres && singleGame.genres.join(', ')}</Card.Text>
                                    <Card.Text>
                                        Release Date: {new Date(singleGame.release_date).toLocaleDateString()}
                                    </Card.Text>
                                    <Card.Text>Description: {singleGame.description && singleGame.description
                                        .split('. ')
                                        .map((sentence, index) => <p key={index}>{sentence.trim()}.</p>)}</Card.Text>
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