import React from "react";
import Footer from '../../../Components/Common/Footer/Footer';
import PolicyPageLayout from "../../../Components/Common/PolicyPageLayout";
import Header from "../../../Components/Common/Header/Header";

const PrivacyPolicy = () => {      
  const policySections = [
    {
      paragraphs: [
        "This Notice explains how we obtain, use and disclose your personal information, in accordance with the requirements of the Protection of Personal Information Act (“POPIA”).",
        "At Skills and Trades (and including this website) we are committed to protecting your privacy and to ensure that your personal information is collected and used properly, lawfully and transparently.",
      ],
    },
    {
      subHeading: "About the Company",
      paragraphs: [
        "Skills and Trades Pvt Ltd is a skills-focused business which connects clients with skilled persons and companies. Our head office is located in Johannesburg, South Africa and we have company agents in all the African countries.",
        "We provide a service for individuals and companies from all the 54 African countries to sign up and connect with clients who are seeking their services. Our website is marketed to a worldwide audience to provide the best exposure and business opportunities for our members.",
      ],
    },
    {
      subHeading: "The information we collect",
      paragraphs: [
        "We collect and process your personal information mainly to contact you for the purposes of understanding your requirements, and delivering services accordingly. For this purpose we will collect contact details including your name and organisation.",
        "We collect information directly from you where you provide us with your personal details. Where possible, we will inform you what information you are required to provide to us and what information is optional.",
        "Website usage information may be collected using “cookies” which allows us to collect standard internet visitor usage information.",
      ],
    },
    {
      subHeading: "How we use your information",
      paragraphs: [
        "We will use your personal information only for the purposes for which it was collected and agreed with you. In addition, where necessary your information may be retained for legal or research purposes.",
      ],
      list: [
        "To gather contact information.",
        "To confirm and verify your identity or to verify that you are an authorised user for security purposes.",
        "For the detection and prevention of fraud, crime, money laundering or other malpractice by working with security authorities to verify your particulars.",
        "To conduct market or customer satisfaction research or for statistical analysis.",
        "For audit and record keeping purposes.",
        "In connection with legal proceedings.",
      ],
    },
    {
      subHeading: "Disclosure of information",
      paragraphs: [
        "We may disclose your personal information to our service providers who are involved in the delivery of products or services to you. We have agreements in place to ensure that they comply with the privacy requirements as required by the Protection of Personal Information Act.",
        "We may also disclose your information:",
      ],
      list: [
        "Where we have a duty or a right to disclose in terms of law or industry codes.",
        "Where we believe it is necessary to protect our rights.",
      ],
    },
    {
      subHeading: "Information Security",
      paragraphs: [
        "We are legally obliged to provide adequate protection for the personal information we hold and to stop unauthorized access and use of personal information. We will, on an on-going basis, continue to review our security controls and related processes to ensure that your personal information remains secure.",
        "Our security policies and procedures cover:",
      ],
      list: [
        "Physical security;",
        "Computer and network security;",
        "Access to personal information;",
        "Secure communications;",
        "Security in contracting out activities or functions;",
        "Retention and disposal of information;",
        "Acceptable usage of personal information;",
        "Governance and regulatory issues;",
        "Monitoring access and usage of private information;",
        "Investigating and reacting to security incidents.",
      ],
      paragraphsAfterList: [
        "When we contract with third parties, we impose appropriate security, privacy and confidentiality obligations on them to ensure that personal information that we remain responsible for, is kept secure.",
        "We will ensure that anyone to whom we pass your personal information agrees to treat your information with the same level of protection as we are obliged to.",
      ],
    },
    {
      subHeading: "Your Rights: Access to information",
      paragraphs: [
        "You have the right to request a copy of the personal information we hold about you. To do this, simply contact us at the numbers/addresses as provided on our website and specify what information you require. We will need a copy of your ID document to confirm your identity before providing details of your personal information.",
        "Please note that any such access request may be subject to a payment of a legally allowable fee.",
      ],
    },
    {
      subHeading: "Correction of your information",
      paragraphs: [
        "You have the right to ask us to update, correct or delete your personal information. We will require a copy of your ID document to confirm your identity before making changes to personal information we may hold about you. We would appreciate it if you would keep your personal information accurate.",
      ],
    },
    {
      subHeading: "Definition of personal information",
      paragraphs: [
        "According to the Act “personal information” means information relating to an identifiable, living, natural person, and where it is applicable, an identifiable, existing juristic person.",
        "Further to the POPIA Act, Skills and Trades also includes the following items as personal information:",
      ],
      list: [
        "All addresses including residential, postal and email addresses.",
        "Change of name – for which we require copies of the marriage certificate or official change of name document issued by the appropriate authorities.",
      ],
    },
    {
      subHeading: "How to contact us",
      paragraphs: [
        "If you have any queries about this notice; you need further information about our privacy practices; wish to withdraw consent; exercise preferences or access or correct your personal information, please contact us at support@skillsandtrades.ai",
      ],
    },
  ];

  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Privacy Policy</h1>
      </div>
      <PolicyPageLayout title="" sections={policySections} />
      <Footer />
    </>
  );
};

export default PrivacyPolicy;