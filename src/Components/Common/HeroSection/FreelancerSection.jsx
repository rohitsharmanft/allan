import React, { useContext } from "react";
import freelancer1 from "../../../assets/images/freelance1.jpg";
import f3 from "../../../assets/images/f3.jpg";
import freelancer2 from "../../../assets/images/freelance2.jpg";
import freelancer3 from "../../../assets/images/freelance3.jpg";
import "./FreelancerSection.css";
import { useNavigate } from "react-router-dom";
import SectionCard from "../SectionCard";
import { AppContext } from "../../../contexts/AppContexts";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

const FreelancerSection = () => {
  const navigate = useNavigate();
  const { userType } = useContext(AppContext);

  const handleMemberAction = () => {
    if (!userType) {
      navigate("/member-resource-login");
      return;
    }
  };

  const handleClientAction = () => {
    if (!userType || userType === "client") {
      localStorage.setItem("activeMenu", "Member Quote");
      navigate("/client-job-listing");
    } else {
      navigate("/signup");
    }
  };

  return (
    <>
      <div className="freelance">
        <SectionCard
          title="Freelancers, Professionals and Skilled Individuals"
          description={
            <>
              Are you struggling to find clients or showcase your expertise?
              <br />
              Every day, thousands of local and international clients visit
              Skills & Trades looking for professionals like you. By joining our
              freelancer platform, you’ll gain visibility, build trust with
              verified reviews, and unlock global projects.
            </>
          }
          highlight="Sign up today, deliver your best work, and grow your reputation worldwide."
          buttonText={userType ? null : "Sign up"}
          imageSrc={f3}
          onClick={handleMemberAction}
        />

        
        <div className="sme-section">
          {/* <SectionCard
            title="SMEs and Trades Companies"
            description={
              <>
                Is your business struggling to attract new clients or expand
                beyond your local market?
                <br />
                On our Skills & Trades platform, trades companies and SMEs are
                listed in a powerful business directory where clients actively
                search for trusted service providers.
              </>
            }
            highlight="Showcase your services, connect with clients, and turn visibility into growth."
            buttonText={userType ? null : "Sign up"}
            imageSrc={freelancer2}
            onClick={handleMemberAction}
            reverse
            className="sme"
          /> */}
          <div className="sme-container">
            <div className="sme_image">
              <img src={freelancer2} alt="SMEs and Trades Companies" />
            </div>
            <div className="sme-content">
              <h1>SMEs and Trades Companies</h1>
              <p className="desc">
                Is your business struggling to attract new clients or expand
                beyond your local market?
                <br />
                On our Skills & Trades platform, trades companies and SMEs are
                listed in a powerful business directory where clients actively
                search for trusted service providers.
              </p>
              <p className="highlight">
                Showcase your services, connect with clients, and turn
                visibility into growth.
              </p>
              {!userType && (
                <button className="signup_btn" onClick={handleMemberAction}>
                  Sign up
                  <span className="arroww">
                    <HiOutlineArrowLongRight />
                  </span>
                </button>
              )}
            </div>
          </div>

        </div>

        <SectionCard
          title="Clients And Employers"
          description={
            <>
              Do you need the right expertise for a project but don’t know where
              to start?
              <br />
              Skills & Trades makes it simple to find skilled professionals and
              trade companies you can trust.
            </>
          }
          highlight="And if you need personalized support, our team is ready to assist you in finding the perfect match."
          buttonText={userType === "member" ? null : "Post a Project & Get Quotations"}
          imageSrc={freelancer3}
          onClick={handleClientAction}
        />
      </div>

      {/* Optional: small explanation for developers / team */}
      {/* <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', marginTop: '1rem' }}>
        Button flow: No userType → signup/login • Client → job listing • Member → button hidden
      </p> */}
    </>
  );
};

export default FreelancerSection;
