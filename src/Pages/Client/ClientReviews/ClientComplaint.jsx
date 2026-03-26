import React from 'react'
import logo from '../../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom';
// import Header from '../../../Components/Header/Header';
import GradientButton from '../../../Components/Common/GradientButton';
import './ClientReviews.css'
import TopBar from '../../../Components/Common/Header/TopBar';
import ClientNavBar from '../ClientHeader/ClientNavBar';
import Footer from '../../../Components/Common/Footer/Footer';
import ProfileCard1 from '../../../Components/Member/ProfileCard1';
import ClientSideBar from '../../../Components/Client/ClientPannel/ClientSideBar';
import Header from '../../../Components/Common/Header/Header';

const ClientComplaint = () => {
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
      {/* <TopBar/>
     <ClientNavBar/> */}
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Client</h1>
      </div>
      <div className="dashboard">
        <ClientSideBar />
        <div className="profile_content">
          <div className="profile_header">
            <div >
              {" "}
              <h3>Reviews</h3>
              <div className='all-btn'>
                <GradientButton text={"Reviews"} className='btn-both' onClick={() => navigate("/client-reviews")} />
                <GradientButton text={"Missed Appointment"} className='btn-both' onClick={() => navigate("/client-missed")} />
                <GradientButton text={"Complaints"} />
              </div>
            </div>

          </div>
          <div className="profile-cards">
            {profiles.map((p, index) => (
              <ProfileCard1
                key={index}
                {...p}
                onEdit={() => navigate("/client-complaint-views")}
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

export default ClientComplaint
