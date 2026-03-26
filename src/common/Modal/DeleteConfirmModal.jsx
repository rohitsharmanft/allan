import React from "react";
import { Modal } from "antd";
import "./DeleteConfirmModal.css";
import GradientButton from "../GradientButton/GradientButton";

const DeleteConfirmModal = ({ open, onCancel, onConfirm,text }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      closable={false}
      className="delete-modal"
    >
      <h3 className="delete-text">{text}</h3>

      <div className="delete-actions">
        <GradientButton className="btn-yes" onClick={onConfirm} text={"Yes"}>
        </GradientButton>
        <GradientButton className="btn-no" onClick={onCancel} text={" No"}>
        </GradientButton>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;

