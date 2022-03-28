import React from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

export default function Modal({
  modalText, onBack, onNext
}) {
  return (
    <div className="modal">
      <span className="modal-text">{modalText}</span>
      <div className="modal-buttons">
        <button className="modal-button" onClick={onBack}>Back</button>
        <button className="modal-button" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}

Modal.propTypes = {
  modalText: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
};
