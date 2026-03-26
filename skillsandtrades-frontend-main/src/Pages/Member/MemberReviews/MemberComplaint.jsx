import React from 'react'
import logo from '../../../assets/images/logo.png'
// import Sidebar from '../../../Components/Common/MemberPanel/Sidebar';
import ProfileCard1 from '../../../Components/Member/ProfileCard1';

import { useNavigate } from 'react-router-dom';
import GradientButton from '../../../Components/Common/GradientButton';
import './MemberReviews.css'
// import MemberHeader from '../../../Components/MemberHeader/MemberHeader';
import Footer from '../../../Components/Common/Footer/Footer';
import Sidebar from '../../../Components/Member/Sidebar';
import Header from '../../../Components/Common/Header/Header';

const MemberComplaint = () => {
  const navigate = useNavigate();
  const profiles = [
    {
      name: "Skills & Trades Pty Ltd",
      reviews: 1,
      rating: 4.75,
      description: "Online skills platform",
      location: "South Africa",
      image: logo,
    },
    {
      name: "Skills & Trades",
      reviews: 1,
      rating: 4.75,
      description: "Experienced architect",
      location: "Harare",
      image: logo,
    },]
  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Member</h1>
      </div>
      <div className="dashboard">
        <Sidebar />
        <div className="profile_content">
          <div className="profile_header">
            <div >
              {" "}
              <h3>Reviews</h3>
              <div className='all-btn'>
                <GradientButton text={"Reviews"} className='btn-both' onClick={() => navigate("/member-review")} />
                <GradientButton text={"Missed Appointment"} className='btn-both' onClick={() => navigate("/member-missed-appointment")} />
                <GradientButton text={"Complaints"} />
              </div>
            </div>

          </div>
          <div className="profile-cards">
            {profiles.map((p, index) => (
              <ProfileCard1
                key={index}
                {...p}
                onEdit={() => navigate("/member-review-section")}
                buttonText="View complain →"

              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default MemberComplaint
