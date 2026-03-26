import React from "react";
import "./About.css";
// import Header from "../../Components/Header/Header";
import Footer from '../../../Components/Common/Footer/Footer';
import img24 from "../../../assets/images/image24.jpg";
import Header from "../../../Components/Common/Header/Header";
import infinia from '../../../assets/images/infinia.png';
import imgHi from '../../../assets/images/img-hi.jpg';
import mission3 from '../../../assets/images/mission3.jpg';
import e1 from '../../../assets/images/e1.jpg';
import f3 from '../../../assets/images/f3.jpg';
import st from '../../../assets/icons/st.png';

export default function AboutUs() {
  return (

    <>
    <Header />
    <div className="about-page">
       <section className="hero-section">              
          <div className="overlay"></div>
          <h1>About Us</h1>
        </section>

      <section className="who-we-are">
        <h2>Who We Are</h2>
        <p>
          <span>Skills & Trades (Pty) Ltd is a </span> 
          <span> skills-focused business</span> that connects clients and
          employers with freelancers, skilled professionals, SMEs, and trades
          companies. Our head office is located in Johannesburg, South Africa
          and our platform and business directory serve all of Africa.
          We market our website to a worldwide audience, creating a trusted
          digital marketplace that provides maximum visibility, global
          networking opportunities, and connections for our members.
        </p>
        <p className="bolde">
            Why sign up with us?

        </p>
        <p>
          Our professionals, service providers, and trade companies are reviewed
          and rated by real clients who have completed projects through the
          platform. When you deliver quality work, you gain verified reviews,
          repeat projects, and ongoing business growth.
        </p>
      </section>
      <section className="mission-vision-container">
            <div className="mission-vision-image">
          <img src={infinia} alt="" />
        </div>
        <div className="mission-section">
          <div className="mission-images">
            <div className="img-grid">
              <img src={img24} alt="Mission1" className="mission1"/>
              <img src={imgHi} alt="Mission2" className="mission2"/>
              <img src={mission3} alt="Mission3" className="mission"/>
              <img src={st} alt="Mission3" className="mission-st"/>
              
            </div>
          </div>

          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>
              Our mission is to give clients fast and convenient access to
              Africa’s best skills — whether they need freelancers for online
              jobs, trade companies for large-scale projects, or SMEs for
              specialized services. We ensure tasks, assignments, and projects
              are delivered to the highest standards, on fair pricing, and in a
              hassle-free way.
            </p>
            <p>
              Our platform is more than just a business directory — it is a
              global networking hub that links professionals and companies to
              local, national, and international opportunities, helping them
              grow visibility, trust, and expand into new trade opportunities.
            </p>
          </div>
        </div>

        <div className="vision-section">
          <div className="vision-text">
            <h2>Our Vision</h2>
            <p>
              Africa is full of unrecognized skilled professionals and
              businesses, while global demand for services continues to grow.
              Yet, many employers struggle to find the right expertise. Skills &
              Trades is bridging that gap.
            </p>
            <p>
              Our vision is to become the leading freelance marketplace and
              business platform connecting local and international clients with
              Africa’s best service providers — unlocking potential, reducing
              unemployment, and reshaping how the world discovers African
              talent.
            </p>
          </div>

          <div className="vision-images">
           <div className="img-grid">
              <img src={e1} alt="Mission1" className="mission_1"/>
              <img src={f3} alt="Mission2" className="mission_2"/>
              <img src={mission3} alt="Mission3" className="mission_"/>
              <img src={st} alt="Mission3" className="mission_st"/>
              
            </div>
          </div>
        </div>
      </section>

      <section className="disclaimer-section" id="disclaimer">
        <div className="disclaimer-image">
          <img src={infinia} alt="" />
        </div>
        <h2>Disclaimer</h2>
        <p>
          Although we conduct thorough checks, and every effort is made to
          ensure skilled persons and companies listed on the Skills and Trades
          website are legitimate, reputable, and have appropriate
          qualifications, membership, or trade approval of trade-related bodies,
          organizations, and associations, we cannot be held responsible for any
          work carried out or goods supplied, nor do we control or are held
          responsible for risks of such services, products, or goods,
          availability, competency, suitability of skilled persons, companies,
          and suppliers listed on or linking to Skills and Trades Africa Pty Ltd.
        </p>
      </section>
    </div>
    <Footer/>
    </>
  );
}
