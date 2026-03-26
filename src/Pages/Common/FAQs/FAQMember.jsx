// import React from 'react'
// // import FAQItem from "../../Components/Common/FAQs/FAQItem";
// import "./FAQClient.css";
// // import Header from "../../Components/Header/Header";

// import Footer from '../../../Components/Common/Footer/Footer';
// import FAQItem from '../../../Components/Common/FAQs/FAQItem';
// import Header from '../../../Components/Common/Header/Header';

// const FAQMember = () => {
//   const faqs = [
//     {
//       question: "Do I pay to use Skills and Trades?",
//       answer:
//         "The service is free for clients and employers who are looking for skilled persons or companies. Skilled persons and companies pay a fee to join and get access to millions of clients and work opportunities.",
//     },
//     {
//       question: "What are the benefits of using the Skills and Trades platform?",
//       answer:
//         "Our platform connects skilled professionals and clients efficiently, offering verified profiles, transparent reviews, and easy communication tools.",
//     },
//     {
//       question:
//         "What checks does Skills and Trades complete on their prospective skilled persons and companies?",
//       answer:
//         "We verify credentials, check client reviews, and ensure compliance with our quality standards before approving any skilled person or company.",
//     },
//     {
//       question:
//         "How do I choose the right skilled person or company for the job?",
//       answer:
//         "Filter by skill category, location, ratings, and experience level. You can also communicate directly before confirming a booking.",
//     },
//     {
//       question: "How does the review process work?",
//       answer:
//         "After job completion, both clients and skilled persons can leave reviews to help maintain platform quality and trust.",
//     },
//     {
//       question: "Does Skills and Trades guarantee the quality of workmanship?",
//       answer:
//         "We ensure quality by partnering only with verified and reviewed skilled professionals and companies.",
//     },
//     {
//       question:
//         "Does Skills and Trades remove unsatisfactory persons or companies?",
//       answer:
//         "Yes. Users who consistently receive poor feedback or violate our code of conduct are removed from the platform.",
//     },
//   ];

//   return (
//     <>

//     <Header/>
//        <div className="hero-section">
//           <div className="overlay"></div>
//           <h1>FAQs-Member</h1>
//         </div>
//     <div className="faq-container">
//       <div className="faq-list">
//         {faqs.map((faq, index) => (
//           <FAQItem key={index} question={faq.question} answer={faq.answer} />
//         ))}
//       </div>

//       <div className="faq-footer">
//         <p>
//           <b>Email Us:</b> If you have a question that is not covered here please
//           email Skills and Trades on{" "}
//           <a href="mailto:info@skillsandtrades.ai">info@skillsandtrades.ai</a>
//         </p>
//       </div>
//     </div>
//     <Footer/>
//     </>
//   );
// }

// export default FAQMember

import React, { useState } from "react";
import "./FAQClient.css";
import Footer from "../../../Components/Common/Footer/Footer";
import FAQItem from "../../../Components/Common/FAQs/FAQItem";
import Header from "../../../Components/Common/Header/Header";

const FAQMember = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What services does your company provide?",
      answer:
        "We are an online platform that promotes the services of Freelancers, Professionals, Skilled People, SMEs and Trades Companies from all 54 African countries so that it is easy and fast for local and international clients to find skills in every sector. Clients and employers can search and contact any service provider for free. Freelancers, Professionals, Skilled People, SMEs and Trades Companies in all 54 African countries can sign up to our platform by choosing Free, Basic or Premium membership.",
    },
    {
      question: "How does the service work?",
      answer:
        "Clients or Employers: Type in the skill or trade and choose from the suggestions that appear. Type in the location and click search. A list of registered members will appear and you can browse and contact any service provider from the list.\n\nFreelancers, Professionals, Skilled People, SMEs and Trades Companies: Click on the Sign Up button on the front page of the website and follow the simple steps to fill in your details. When you finish you will be taken to the payment page if you have chosen the Basic or Premium membership. Once you complete your payment you will receive email confirmation and you can complete the sign up by uploading your company logo and photos of previous work.",
    },
    {
      question: "Where is your company registered?",
      answer:
        "We are registered with the CIPC in South Africa and our office is located at 158 Jan Smuts Avenue in Rosebank, Johannesburg.",
    },
    {
      question: "Do I pay to use Skills and Trades?",
      answer:
        "Clients and Employers - the service is free for clients and employers who are looking for skilled persons or companies.\n\nFreelancers, Professionals, Skilled persons, SMEs and Trades companies - there are three types of membership:\n• Free membership with limited benefits\n• Basic membership with more benefits\n• Premium membership with most benefits",
    },
    {
      question: "Why should I sign up, what benefits and value will I get?",
      answer:
        "There are plenty of clients who are looking for your services but do not know how to find you. Our platform gives you visibility and direct contact with local and international clients who struggle to find the right skills for a fair price. If you provide great service, your clients will give you great reviews which will give you more business and growth. We advertise our platform on local and international forums thereby opening up more opportunities for our members. If you opt for Premium membership, you can link your profile to all your social media pages thereby linking with more potential clients.",
    },
    {
      question: "What are the requirements and who can sign up?",
      answer:
        "Any service provider in every sector of all 54 African countries can sign up. You will need an email address, phone number and national ID. We will use these details to verify you are a genuine service provider for the safety of clients.",
    },
    {
      question:
        "What checks does Skills and Trades complete on their prospective skilled persons and companies?",
      answer:
        "All prospective members are vetted and screened through a review process that involves checking the details and documents that they provide when they join. Registered members are also monitored via customer reviews which are made public on the website.",
    },
    {
      question:
        "How do I choose the right skilled person or company for the job?",
      answer:
        "We've done all the hard work by ensuring that all our skilled persons and companies are qualified and experienced but we suggest you choose based on the following criteria:\n• Get quotations from at least 3 service providers.\n• Look at the reviews that have been left on the website.\n• Review the skilled person or company’s number of years of experience.\n• Review the skilled person or company’s qualifications and memberships which are listed on their profile.\n• Review the photographs and evidence of previous work.\n• You can contact the service providers through email, text or WhatsApp if you need more details or evidence of work done.\n• If you need help you can contact our support team at support@skills.com",
    },
    {
      question: "How does the review process work?",
      answer:
        "Customer feedback is essential to build Skills and Trades into a valuable resource, so we encourage clients to complete our simple online form once work is completed. Customers provide feedback on a voluntary basis but we encourage you to provide an insight into the quality of the work done. We will ask for your contact details before you provide a review so that we know you are reviewing work that was actually done. You will score the person or company out of 5 stars based on quality and service provided.\n\nIf the review shows that a client was satisfied with the work done, we will review and publish the feedback within 2-5 working days of receipt.\n\nIf a client is disappointed with the work done, we will review and contact the service provider for a rating that is 2 stars or less to get their response and give them a chance to rectify the situation.\n\nOur goal is to register and maintain high quality skilled people and companies and we always work to prevent negative feedback through good communication with clients during the project. Issues are often caused by lack of communication or unclear expectations and this can be resolved amicably through consistent communication during the project.",
    },
    {
      question: "Does Skills and Trades guarantee the quality of workmanship?",
      answer:
        "Skills and Trades cannot guarantee the quality of our members' work. Our members run independent businesses and are responsible for the quality of work that they carry out. We guarantee to publish all feedback - both good and bad, providing that the customer has permitted us to contact the contractor about the complaint and ensure it is anonymous and in the absence of exceptional circumstances.\n\nSkills and Trades is here to give you peace of mind. It is in the interest of our members to provide the best service every time and continue to get business.",
    },
  ];

  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>FAQs - Member</h1>
      </div>
      <div className="faq-container">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={activeIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        <div className="faq-footer">
          <p>
            <b>Email Us:</b> If you have a question that is not covered here
            please email Skills and Trades on{" "}
            <a href="mailto:support@skills.com">support@skills.com</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQMember;
