import React, { useEffect, useState } from "react";
import "./HowItWorks.css";
import img1 from "../../../assets/images/image24.jpg";
import img2 from "../../../assets/images/img-hi.jpg";
import w2 from "../../../assets/images/w2.jpg";
import k1 from "../../../assets/images/k1.jpg";
import Footer from "../../../Components/Common/Footer/Footer";
import Header from "../../../Components/Common/Header/Header";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import st from "../../../assets/icons/st.png";

const HowItWorks = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    }
  }, [hash]);

  // Steps for "How to Join Skills and Trades"
  const steps = [
    {
      number: 1,
      title: "Sign Up and Create Your Profile",
      description:
        "Go to the Sign Up page, enter your details, and start your membership application. As a member, your profile will appear in thousands of searches made daily on our website.",
    },
    {
      number: 2,
      title: "Pay Your Membership Fee",
      description:
        "Choose your plan:\nBasic — R350/year\nPremium — R700/year\nPayments can be made easily by credit or debit card.\nCheck the Membership Overview for full benefits.",
    },
    {
      number: 3,
      title: "Confirm Email & Upload Documents",
      description:
        "After payment, you'll receive a confirmation email and receipt. You will also receive an email to complete your profile with such details as photos, social media links (for Basic and Premium Membership). \nThe more details you provide, the better your chances of getting assignments.",
    },
    {
      number: 4,
      title: "Sign up is Complete!",
      description:
        "Once your profile is approved, it goes live for clients and employers to find you. If anything is missing, we’ll contact you to update it.",
    },
    {
      number: 5,
      title: "Best Results, Positive Outcome",
      description:
        "Deliver top-quality service, earn reviews from satisfied clients, and boost your profile ranking. Track profile views and reviews anytime through your dashboard.",
    },
  ];

  // Accordion steps for Clients Section
  const [openIndex, setOpenIndex] = useState(null);
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const clientSteps = [
    {
      number: 1,
      title: "Search for a Reliable Skilled Person or Company",
      content:
        "Enter the skill or profession that you are looking for and the city/ town/ suburb into the boxes at the top of the page, then click ‘Search’. Don’t worry about entering the exact skill or profession — suggested options will be displayed as soon as you start typing.",
    },
    {
      number: 2,
      title: "Choosing your skilled Person or Company",
      content:
        "Compare the profiles, ratings, and reviews of skilled persons or companies, then choose the one that best fits your needs.",
    },
    {
      number: 3,
      title: "Discuss the Job",
      content:
        "Contact the selected skilled person or company to discuss job details, pricing, and scheduling before confirming.",
    },
    {
      number: 4,
      title: "Leave a review",
      content:
        "After the job is completed, share your experience by leaving a review to help others make better choices.",
    },
    {
      number: 5,
      title: "Posting a Job or Project",
      content: `If you have a job or project you can Sign Up or Login to post for free.
You will receive email notification when a Job application or Project quote is submitted.
If you are happy with the application or quote, you can communicate directly with the individual or company to finalise next steps.
Please feel free to contact us if you need any help.`,
    },
  ];

  return (
    <>
      <Header />

      <div className="howitworks-page">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="overlay"></div>
          <h1>How It Works</h1>
        </div>

        {/* Intro Section */}
        <section className="intro-section" id="overview">
          <div className="intro-container">
            <div className="intro-text">
              <h2>
                Freelancers, Professionals, Skilled Persons, SMEs and Trades
                Companies
              </h2>
              <p className="sub-heading">
                Are you Qualified or Experienced in any of these Categories
              </p>
              <p className="description">
                If you are skilled in your trade, pride in your work and have a
                selection of previously satisfied customers, you can join Skills
                and Trades. You can also sign up if you are new to Trades, the
                key is to provide your best service to the clients.
              </p>
              <p className="description">
                As a member, you or your company will come up in thousands of
                searches made every day by visitors to our website. Join us
                today to start your Skills and Trades membership application.
              </p>
            </div>
            <div className="intro-image">
              <img src={img1} alt="Freelancer" />
            </div>
          </div>
        </section>

        {/* Updated Join Section */}
        <section className="join-section" id="skills">
          <div className="howto-grid">
            {/* LEFT COLUMN */}
            <div className="steps-column">
              {steps.slice(0, 3).map((step, index) => (
                <div key={index} className="step">
                  <div className="step-header">
                    <span className="step-number">{step.number}</span>
                    <h4>{step.title}</h4>
                  </div>
                  <p className="step-text">{step.description}</p>
                  <div className="divider_" />
                </div>
              ))}
            </div>

            {/* MIDDLE COLUMN */}
            <div className="steps-column">
              {steps.slice(3).map((step, index) => (
                <div key={index + 3} className="step">
                  <div className="step-header">
                    <span className="step-number">{step.number}</span>
                    <h4>{step.title}</h4>
                  </div>
                  <p className="step-text">{step.description}</p>
                  <div className="divider_" />
                </div>
              ))}
            </div>

            <div className="info-column">
              <div className="stars">
                <img src={st} alt="" />
              </div>
              <h2>
                How to Join Skills
                <br />
                and Trades
              </h2>
              <p>
                Follow these simple steps to become a member and start
                connecting with clients.
              </p>
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <section className="clients-section" id="clients">
          <div className="clients-container">
            <div className="clients-image">
              <img src={k1} alt="Client" />
            </div>
            <div className="clients-section">
              <h1 className="clients-title">Clients and Employers</h1>
              <p className="clients-subtitle">
                Clients and Employers can search for the skilled persons,
                professionals and companies for free.
              </p>

              <p className="cccc">
                Client and Employers can also post jobs and projects for free.
              </p>

              <div className="accordion">
                {clientSteps.map((step, index) => (
                  <div key={index} className="accordion-item">
                    <div
                      className="accordion-header"
                      onClick={() => toggleAccordion(index)}
                    >
                      <div className="number-circle">{step.number}</div>
                      <h3>{step.title}</h3>
                      <span className="arrow">
                        {openIndex === index ? (
                          <UpOutlined
                            style={{ fontSize: "16px", color: "#666" }}
                          />
                        ) : (
                          <DownOutlined
                            style={{ fontSize: "16px", color: "#666" }}
                          />
                        )}
                      </span>
                    </div>
                    {openIndex === index && (
                      <div className="accordion-content">
                        <ul>
                          {step.content.split("\n").map((point, i) => (
                            <li key={i}>{point.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default HowItWorks;
