import React from "react";
import Footer from "../../../Components/Common/Footer/Footer";
import PolicyPageLayout from "../../../Components/Common/PolicyPageLayout";
import Header from "../../../Components/Common/Header/Header";

const TermsAndConditions = () => {
  const policySections = [
    {
      heading: "TERMS AND CONDITIONS – JOBS AND PROJECTS",
      paragraphs: [
        "The following terms and conditions provide guidance on what types of employment and project details and posts are allowed on our website.",
        "Businesses and individuals posting jobs and projects are responsible for ensuring their posts for services and products comply with applicable laws, statutes, and regulations of the country where the business is being conducted. We reserve the right to reject or remove any job or project post that does not comply.",
      ],
    },
    {
      subHeading: "Adult Products and Services",
      paragraphs: [
        "We do not allow posting of adult content or services. Jobs and projects posts must not promote employment opportunities that require adult services or use of adult products.",
      ],
    },
    {
      subHeading: "Discrimination",
      paragraphs: [
        "Jobs and projects posts must not discriminate against applicants based on any protected characteristics, including, but not limited to, race, ethnicity, colour, national origin, religion, age, sex, sexual orientation, gender identity, family status, disability, medical or genetic condition or any other basis protected under federal, state or local law. Jobs and projects must comply with all applicable laws prohibiting discrimination.",
      ],
    },
    {
      subHeading: "Drug-Related Products and Services",
      paragraphs: [
        "Jobs and projects must not promote employment opportunities that involve illegal or recreational drugs, products, and services.",
      ],
    },
    {
      subHeading: "Illegal Products and Services",
      paragraphs: [
        "Jobs and projects must not promote employment opportunities that involve illegal activity, products, or services.",
      ],
    },
    {
      subHeading: "Impersonation",
      paragraphs: [
        "Jobs and projects must not impersonate a brand, company, entity, or public figure. This includes falsely representing an association with a business.",
      ],
    },
    {
      subHeading: "Misleading, Deceptive, or Fraudulent Jobs",
      paragraphs: [
        "Jobs and projects must not promote employment opportunities that are misleading, deceptive, or fraudulent.",
      ],
    },
    {
      subHeading: "Multilevel Marketing",
      paragraphs: [
        "Jobs and projects must clearly and fully describe the product or business model it is promoting. Jobs and projects must not promote employment opportunities for business models that offer quick compensation for little investment, including multilevel marketing opportunities.",
      ],
    },
    {
      subHeading: "No Employment Opportunity",
      paragraphs: [
        "Jobs and projects must promote an actual employment opportunity that is available or will soon become available. Jobs and projects may not post advertisements or solicitations for business or services.",
      ],
    },
    {
      subHeading: "Personal Information",
      paragraphs: [
        "Jobs and projects must not solicit personal identification or financial information from any potential applicants.",
      ],
    },
    {
      subHeading: "Profanity and Grammar",
      paragraphs: [
        "Jobs and projects must not contain profanity or bad grammar and punctuation. Symbols, numbers and letters must be used properly without the intention of circumventing our review process and enforcement systems.",
      ],
    },
    {
      subHeading: "Sexually Suggestive Jobs",
      paragraphs: [
        "Jobs and projects must not promote employment opportunities in a sexually suggestive manner.",
      ],
    },
    {
      heading: "TERMS AND CONDITIONS - PAYMENTS",
      subHeading: "Detailed Description of Good and/or Services",
      paragraphs: [
        "Skills and Trades Africa is a business in the online industry that offers a connection platform for clients and employers who are looking for freelancers, skilled professionals, SMEs, and trades companies",
      ],
    },
    {
      subHeading: "Delivery Policy",
      paragraphs: [
        "Subject to availability and receipt of payment, requests will be processed within 48 hours and delivery confirmed by email.",
      ],
    },
    {
      subHeading: "Export Restriction",
      paragraphs: [
        "The offering on this website is available to all 54 African countries.",
      ],
    },
    {
      subHeading: "Returns and Refunds Policy",
      paragraphs: [
        "The provision of goods and services by Skills and Trades Africa Is subject to availability. In cases of unavailability or problems with the website, Skills and Trades Africa will refund the client in full within 30days. Cancellation of orders by the client is not permitted after sign up.",
      ],
    },
    {
      subHeading: "Customer Private Policy",
      paragraphs: [
        "Skills and Trades Africa shall take all the reasonable steps to protect the personal information of users. For the purpose of this clause, “Personal Information” shall be defined as detailed in the Protection of Personal Information Act 4 of 2013 (POPIA). The Payfast by Network Privacy Policy may be assessed on: https://payfast.io/privacy-policy/",
      ],
    },
    {
      subHeading: "Payment Options Accepted",
      paragraphs: [
        "Payment may be made via Visa, Mastercard, Diners or American Express Cards or by bank transfer into the Skills and Trades Africa Bank account, the details of which will be provided on request.",
      ],
    },
    {
      subHeading: "Payment Options Accepted",
      paragraphs: [
        "Card transactions will be acquired for Skills and Trades Africa Via Payfast by Network who are the approved payment gateway for all South African Acquiring Banks. Payfast by Network uses the strictest form of encryption, namely Secure Socket Layer 3 (SSL3) and no Card details are stored on the website.",
        "Users may go to https://payfast.io/ to view their security certificate and security policy.",
      ],
    },
    {
      subHeading: "Customer Details Separate from Card Details",
      paragraphs: [
        "Customer details will be stored by Skills and Trades Africa separately from the card details which are entered by the client on the Payfast by Network's secure site. For more details on Payfast by Network refer to www.payfast.io.",
      ],
    },
    {
      subHeading: "Merchant Outlet Country and Transaction Currency",
      paragraphs: [
        "The merchant outlet country at the time of presenting payment options to the cardholder is South Africa. Transaction currency is South African Rand (ZAR) but fees are displayed in $USD.",
      ],
    },
    {
      subHeading: "Responsibility",
      paragraphs: [
        "Skills and Trades Africa takes responsibility for all aspects relating to the transaction including sale of goods and services sold on this website, customer service and support, dispute resolution and delivery of goods.",
      ],
    },
    {
      subHeading: "Country of Domicile",
      paragraphs: [
        "This website is governed by the laws of South Africa and Skills and Trades Africa chooses as its domicililium citandi et executandi for all purposes under this agreement , whether in respect of court process, notice, or other documents or communication of whatsoever nature: 158 Jan Smuts Avenue, Rosebank, Johannesburg, 2196.",
      ],
    },
    {
      subHeading: "Variation",
      paragraphs: [
        "Skills and Trades Africa may, in its sole discretion, change this agreement or any part thereof at any time without notice.",
      ],
    },
    {
      subHeading: "Company Information",
      paragraphs: [
        <b key="1">Private Company</b>,
        <span key="2">
          <b>Based in South Africa and trading as:</b> Skills and Trades Africa
        </span>,
      ],
    },
    {
      subHeading: "Contact Details",
      paragraphs: [
        <span key="6">
          <b>Physical Address:</b> 158 Jan Smuts Avenue, The Rosebank Quarters,
          Johannesburg, 2196
        </span>,
        <span key="7">
          <b>Email:</b> support@skillsandtrades.ai
        </span>,
        <span key="8">
          <b>Telephone:</b> 078 575 9101
        </span>,
      ],
    },
  ];

  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Terms and Conditions</h1>
      </div>

      <PolicyPageLayout title="" sections={policySections} />
      <Footer />
    </>
  );
};

export default TermsAndConditions;
