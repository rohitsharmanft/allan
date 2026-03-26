import React from 'react';
import Footer from '../../../Components/Common/Footer/Footer';
import Header from '../../../Components/Common/Header/Header';
import PolicyPageLayout from '../../../Components/Common/PolicyPageLayout';

const CookiesPolicy = () => {
  const policySections = [
    {
      paragraphs: [
        'Last Updated: 29/12/2025',
        'Skills and Trades ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Cookies Policy explains how and why we use cookies on our website ("Website"). By using our Website, you agree to the use of cookies as described in this policy.',
      ],
    },
    {
      heading: 'What Are Cookies?',
      paragraphs: [
        'Cookies are small text files that are placed on your computer, smartphone, or other device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.',
      ],
    },
    {
      heading: 'Types of Cookies We Use',
      paragraphs: [
        'We use the following types of cookies on our Website:',
      ],
    },
    {
      heading: 'Strictly Necessary Cookies',
      paragraphs: [
        'These cookies are essential for the operation of our Website. They enable you to move around the site and use its features, such as accessing secure areas of the Website. Without these cookies, some parts of the Website may not function correctly.',
      ],
    },
    {
      heading: 'Performance Cookies',
      paragraphs: [
        'These cookies collect information about how visitors use our Website, such as which pages are visited most often and if users receive error messages from web pages. These cookies do not collect information that identifies a visitor. All information these cookies collect is aggregated and therefore anonymous. It is used only to improve how our Website works.',
      ],
    },
    {
      heading: 'Functionality Cookies',
      paragraphs: [
        'These cookies allow the Website to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personalized features. For example, these cookies can be used to remember changes you have made to text size, fonts, and other parts of web pages that you can customize.',
      ],
    },
    {
      heading: 'Targeting or Advertising Cookies',
      paragraphs: [
        'These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of an advertising campaign. They remember that you have visited a website, and this information may be shared with other organizations such as advertisers.',
      ],
    },
    {
      heading: 'How We Use Cookies',
      paragraphs: [
        'We use cookies to:',
      ],
      list: [
        'Improve the functionality and performance of our Website.',
        'Personalize your experience by remembering your preferences.',
        'Analyze website traffic and usage patterns.',
        'Serve targeted advertisements that are relevant to you.',
        'Ensure the security and integrity of our Website.',
      ],
    },
    {
      heading: 'Third-Party Cookies',
      paragraphs: [
        'In some cases, we use third-party cookies provided by trusted third parties to help us understand how you use our Website and to deliver ads tailored to you. These third parties may use their own cookies and similar technologies to collect information about your online activities over time and across different websites.',
      ],
    },
    {
      heading: 'Managing Cookies',
      paragraphs: [
        'You can control the use of cookies at the individual browser level. Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version. Please consult the help menu of your browser or visit the browser’s website for instructions.',
        'Please note that if you disable cookies, some parts of our Website may not function properly or may become inaccessible.',
      ],
    },
    {
      heading: 'Changes to This Cookies Policy',
      paragraphs: [
        'We may update this Cookies Policy from time to time to reflect changes in our practices or applicable laws. When we make changes to this policy, we will revise the "Last Updated" date at the top of this page. We encourage you to review this Cookies Policy periodically to stay informed about how we use cookies.',
      ],
    },
    {
      heading: 'Contact Us',
      paragraphs: [
        'If you have any questions about our use of cookies or this Cookies Policy, please contact us at: support@skillsandtrades.ai',
      ],
    },
  ];

  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Cookies Policy</h1>
      </div>
      <PolicyPageLayout title="" sections={policySections} />
      <Footer />
    </>
  );
};

export default CookiesPolicy;