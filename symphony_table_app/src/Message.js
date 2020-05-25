import React from "react";
import PropTypes from "prop-types";

const Message = ({ msg, onCloseBtnClk }) => {
  return (
    <div className="alert" role="alert">
      {msg}
      <button
        type="button"
        className="alert_close"
        aria-label="Close"
        onClick={onCloseBtnClk}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

Message.propTypes = {
  msg: PropTypes.string.isRequired,
};

export default Message;
