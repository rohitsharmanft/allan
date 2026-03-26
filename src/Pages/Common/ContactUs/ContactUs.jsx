import React from "react";
import { Form, Input, Checkbox } from "antd";
import axios from "axios";
import "./ContactUs.css";
import Footer from '../../../Components/Common/Footer/Footer';
import art from "../../../assets/images/art.png";
import press from '../../../assets/icons/press.png';
import location from '../../../assets/icons/location.png';
import whatsapp from '../../../assets/icons/whatsapp.png';
import email from '../../../assets/icons/email.png';
import GradientButton from "../../../Components/Common/GradientButton";
import Header from "../../../Components/Common/Header/Header";
import { contact_us } from "../../../api";
import { toast } from "react-toastify";

const ContactUs = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(contact_us, values, { headers: { "Content-Type": "application/json", }, });
      console.log("Success:", response.data);
      form.resetFields();
      if (response.data.code === 200) {
        toast.success("Message sent successfully. We’ll get back to you shortly.")
      }
    } catch (error) {
      toast.error("dataWe’re having trouble right now. Please try again shortly.");
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Contact Us</h1>
      </div>
      <div className="form-wrapper">
        <h2>Ask Us Anything</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="custom-form"
        >
          <div className="row">
            <Form.Item
              label="Name"
              name="fullName"
              rules={[{ required: true, message: "Please enter your name" }]}
              className="form-item"
            >
              <Input placeholder="Enter Your Name" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true, message: "Please enter your phone number" }]}
              className="form-item"
            >
              <Input placeholder="Enter Your Phone Number" />
            </Form.Item>
          </div>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email!" }
            ]}
          >
            <Input placeholder="Enter Your Email Address" />
          </Form.Item>

          <Form.Item
            label="Comment Box"
            name="message"
            rules={[{ required: true, message: "Please enter your message" }]}
          >
            <Input.TextArea rows={5} placeholder="Enter Your Message" />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject("Please accept our privacy policy"),
              },
            ]}
          >
            <Checkbox>
              Please Confirm That You Have Read And Agree To Our{" "}
              <a href="/page-policy">Privacy Policy.</a>
            </Checkbox>
          </Form.Item>

          <GradientButton
            type="primary"
            htmlType="submit"
            className="change-password-btn "
            text="Submit"
            loading={loading}
            disabled={loading}
          />
        </Form>
      </div>
      <div className="office-info">
        <p>
          Our offices are open from 0800 to 1700, Monday to Friday but you can
          email or text us outside those hours and we will get back to you. Calls
          to Skills and Trades may be monitored or recorded for verification and
          training purposes.
        </p>
      </div>
      <section className="contact-info">
        <h2>Contact Information</h2>

        <div className="info-grid">
          <div className="info-card">
            <img src={art} alt="Careers Icon" />
            <div className="info-text">
              <h3>Careers</h3>
              <p>
                Interested in a career at Skills and Trades? Check here to view
                our current vacancies.
              </p>
              <span>support@skills.com</span>
            </div>
          </div>

          <div className="info-card">
            <img src={press} alt="Media Icon" />
            <div className="info-text">
              <h3>Media and Press</h3>
              <p>
                If you are a journalist with an enquiry, please contact our office
                at:
              </p>
              <span>support@skills.com</span>
            </div>
          </div>

          <div className="info-card">
            <img src={location} alt="Location Icon" />
            <div className="info-text">
              <h3>Where to find us</h3>
              <p>
                Skills and Trades Pty Ltd, 158 Jan Smuts Avenue, Rosebank,
                Johannesburg, South Africa
              </p>
            </div>
          </div>

          <div className="info-card">
            <img src={whatsapp} alt="WhatsApp Icon" />
            <div className="info-text">
              <h3>WhatsApp</h3>
              <p>+27 78 575 9101</p>
            </div>
          </div>

          <div className="info-card">
            <img src={email} alt="Email Icon" />
            <div className="info-text">
              <h3>Email</h3>
              <p>support@skills.com</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactUs;