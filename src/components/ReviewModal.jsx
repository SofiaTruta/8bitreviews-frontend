import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ReviewModal = ({ show, handleReviewSubmission }) => {
  const [reviewFormData, setReviewFormData] = useState({
    score: '',
    review: ''
  });

  const handleReviewFormChange = (event) => {
    const { name, value } = event.target;
    setReviewFormData({
      ...reviewFormData,
      [name]: value
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
          placeholder="Enter score"
          name="score"
          value={reviewFormData.score}
          onChange={handleReviewFormChange}
          className="dark-mode"
        />
      </Form.Group>
      <Form.Group controlId="formReview" className="dark-mode">
        <Form.Label className="dark-mode">Review</Form.Label>
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
    <Button variant="secondary" onClick={show} className="dark-mode">
      Close
    </Button>
    <Button variant="primary" onClick={handleSubmit} className="dark-mode">
      Submit Review
    </Button>
  </Modal.Footer>
</Modal>
  );
};

export default ReviewModal;
