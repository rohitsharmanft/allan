import React, { useContext, useState, useRef } from "react";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "./IDVerification.css";
import logo from "../../../assets/images/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { create_subscription, verify_id_proofs } from "../../../api";
import { AppContext } from "../../../contexts/AppContexts";
import { toast } from "react-toastify";
import VerificationSuccess from "../VerificationSuccess/VerificationSuccess";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

const IDVerification = () => {
  const location = useLocation();
  const { email, id, planId } = location.state || {};
  const { token } = useContext(AppContext);
  const [idFile, setIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const idInputRef = useRef(null);
  const selfieInputRef = useRef(null);
  const [open, setOpen] = useState(false)
  console.log(id);
  console.log(planId)
  const navigate = useNavigate()

  const isFree = planId?.plan === "Free"
  console.log(isFree)

  const handleClose = () => {
    setOpen(false);
    isFree && navigate('/login')
    !isFree && handleSubscribe()
  }

  const handleIdFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIdFile(e.target.files[0]);
    }
  };

  const handleSelfieFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelfieFile(e.target.files[0]);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    console.log("planId:", planId);
    console.log("token:", token);
    try {
      const res = await axios.post(`${create_subscription}/${id}`, { planId });
      console.log("planId:", planId);
      console.log("token:", token);
      const { payfastUrl, payload } = res.data.data;
      console.log(res.data.data)
      console.log(JSON.stringify(payload, null, 2));

      const form = document.createElement("form");
      form.method = "POST";
      form.action = payfastUrl;

      Object.keys(payload).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = payload[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.log(err.response?.data);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idFile || !selfieFile) {
      toast.alert("Please upload both files");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('id', id)
    formData.append("idProof", idFile);
    formData.append("selfie", selfieFile);
    try {
      const response = await axios.post(verify_id_proofs, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data", }, });
      console.log("Verification response:", response.data);
      if (response.data.code === 200) {
        e.preventDefault();
        setOpen(true)
      }
    } catch (error) {
      toast.error(error.response?.data?.error_description);
      console.log(error.response?.data.error_description)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="verifyWrapper">
        <div className="verifyBox">
          <img src={logo} alt="Logo" className="verifyLogo" />
          <h2 className="verifyHeading">ID verification</h2>
          <p>For the safety and security of eveyone who uses our platform, we</p>
          <p>require the following documents.</p>
          <br />
          <form className="verifyForm" onSubmit={handleSubmit}>
            {/* ID Proof Upload */}
            <div className="uploadGroup">
              <label>Upload Copy ID(National ID,Driver's License or Passport)</label>
              <div className="uploadField">
                <input
                  type="text"
                  value={idFile ? idFile.name : ""}
                  placeholder="This can be Drivers License, Passport or National ID"
                  readOnly
                  className="uploadInput"
                />
                <Button
                  className="chooseBtn"
                  onClick={() => idInputRef.current?.click()}
                  disabled={loading}
                >
                  Choose File
                </Button>
                {/* Hidden real file input */}
                <input
                  type="file"
                  ref={idInputRef}
                  style={{ display: "none" }}
                  accept="image/*,.pdf"
                  onChange={handleIdFileChange}
                />
              </div>
              <p className="fileInfo">(PDF, PNG, JPEG, up to 5MB)</p>
            </div>

            {/* Selfie Upload */}
            <div className="uploadGroup">
              <label>Upload Selfie Holding ID(Selfie must show your ID details)</label>
              <div className="uploadField">
                <input
                  type="text"
                  value={selfieFile ? selfieFile.name : ""}
                  placeholder="Choose Selfie Photo"
                  readOnly
                  className="uploadInput"
                />
                <Button
                  className="chooseBtn"
                  onClick={() => selfieInputRef.current?.click()}
                  disabled={loading}
                >
                  Choose File
                </Button>
                <input
                  type="file"
                  ref={selfieInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleSelfieFileChange}
                />
              </div>
              <p className="fileInfo">(PNG, JPEG, up to 5MB)</p>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className="verifyBtn"
              loading={loading}
            // disabled={loading || !idFile || !selfieFile}
            >
              {isFree ? "Submit Details" : "Proceed to Payment"} <HiOutlineArrowLongRight className="btn-arrow" />
            </Button>     
          </form>
        </div>
      </div>
      <VerificationSuccess
        isOpen={open}
        onClose={handleClose}
      />
    </>
  );
};

export default IDVerification;
