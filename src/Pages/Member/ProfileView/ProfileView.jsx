import React from 'react'
import MemberSkillTrade from './MemberSkillTrade'
import './ProfileView.css'
import Footer from '../../../Components/Common/Footer/Footer';
import Sidebar from '../../../Components/Member/Sidebar';
import Header from '../../../Components/Common/Header/Header';


const ProfileView = () => {     
  return (
    <>
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Member</h1>
      </div>
       <div className="dashboard_">
        <Sidebar />
        <div className='j'>
            <MemberSkillTrade/>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ProfileView
