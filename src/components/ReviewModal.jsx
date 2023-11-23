import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ReviewModal = ({ show, handleReviewSubmission }) => {
  const [reviewFormData, setReviewFormData] = useState({
    score: '',
    review: ''
  });

  const handleReviewFormChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;

    if (name === 'score') {
      // force it to be between 1-5
      newValue = Math.min(Math.max(parseInt(value), 1), 5);
    }

    setReviewFormData({
      ...reviewFormData,
      [name]: newValue
    });
  };

  const handleSubmit = () => {
    handleReviewSubmission(reviewFormData);
  };

  return (
    <Modal show={show} onHide={show} className="dark-mode">
      <Modal.Header closeButton className="dark-mode">
        <Modal.Title>Add Review</Modal.Title>
      </Modal.Header>
      <Modal.Body className="dark-mode">
        <Form className="dark-mode">
          <Form.Group controlId="formScore" className="dark-mode">
            <Form.Label className="dark-mode">Score</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter score (1 - 5)"
              name="score"
              value={reviewFormData.score}
              onChange={handleReviewFormChange}
              className="dark-mode"
            />
          </Form.Group>
          <Form.Group controlId="formReview" className="dark-mode">
            <Form.Label className="dark-mode mt-3">Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter review"
              name="review"
              value={reviewFormData.review}
              onChange={handleReviewFormChange}
              className="dark-mode"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="dark-mode">
        <Button 
        variant="outline-secondary" className='retro-button mx-2'
        onClick={show} >
          Close
        </Button>
        <Button 
        variant="outline-secondary" className='retro-button mx-2'
        onClick={handleSubmit}>
          Submit Review
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewModal;
