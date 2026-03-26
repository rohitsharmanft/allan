import React from "react";
import { Modal, Button } from "antd";
import { BsCheckCircleFill } from "react-icons/bs";
import "./VerificationSuccess.css";
import GradientButton from "../GradientButton";
import logo from "../../../assets/images/logo.png";

const VerificationSuccess = ({ isOpen, onClose, plan }) => {
  const isPaidPlan = plan && plan.toLowerCase() !== "free";

  return (
    <Modal
      open={isOpen}
      centered
      footer={null}
      closable={false}
      className="successModal"
      width={450}
    >
      <div className="successContent">
        <div className="successHeader">
          <img src={logo} alt="Skills & Trades" className="successLogo" />
        </div>
        <div className="successIcon">
          <BsCheckCircleFill />
        </div>
        <h2 className="successHeading">Submission Successful</h2>
        <p className="successDescription">
          {isPaidPlan
            ? "Payment and document upload completed successfully."
            : "Document upload completed successfully."}
          <br /><br />
       
        </p>

        <GradientButton text={"Continue"} onClick={onClose} className="okayBtn" />
      </div>
    </Modal>
  );
};

export default VerificationSuccess;
