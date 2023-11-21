import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditReviewModal = ({ show, review_score, review_review, handleEditReviewSubmission, reviewId, user, game, date }) => {
    //it needs to receive teh data from the previous review as prop
    //set it as this state
  const [editReviewFormData, setEditReviewFormData] = useState({
    score: review_score,
    review: review_review,
    user: user,
    game: game, 
    date_submitted: date
  });

  const handleReviewFormChange = (event) => {
    const { name, value } = event.target;
    setEditReviewFormData({
      ...editReviewFormData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    handleEditReviewSubmission(reviewId, editReviewFormData);
  };

  return (
    <Modal show={show} onHide={show} className="dark-mode">
  <Modal.Header closeButton className="dark-mode">
    <Modal.Title>Edit Review</Modal.Title>
  </Modal.Header>
  <Modal.Body className="dark-mode">
    <Form className="dark-mode">
      <Form.Group controlId="formScore" className="dark-mode">
        <Form.Label className="dark-mode">Score</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter score"
          name="score"
          value={editReviewFormData.score}
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
          value={editReviewFormData.review}
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

export default EditReviewModal;
