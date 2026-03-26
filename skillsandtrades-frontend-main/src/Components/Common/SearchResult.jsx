import React, { useEffect } from "react";
import "./SearchResult.css";
import { ArrowLeftOutlined, CloseOutlined } from "@ant-design/icons";
import GradientButton from "./GradientButton";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLongLeft } from "react-icons/hi2";

const SearchResult = ({ onClose, show }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <>
      <div className="Main-Container">
        <div className="search-model">
          <div className="modal-top" onClick={onClose}>
            <HiOutlineArrowLongLeft className="icon-btn" size={25} />
            <CloseOutlined className="icon-btn" />
          </div>
          <p className="search-subtitle">
            We have taken note of your search and we will advertise for skills
            and trades in that area. In the meantime try your search in a nearby
            location.
          </p>

          <div className="inside-box">
            <h2>No Search Result</h2>
            <p className="search-text">
              Not sure what to search for? Visit our Categories page to search
              by location after you pick a skill or trade
            </p>
          </div>
          <div className="btn-go-category">
            {show && (
              <GradientButton
                className="btn-go-category"
                text={"Go Back To Category "}
                onClick={() => navigate("/all-categories")}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResult;
