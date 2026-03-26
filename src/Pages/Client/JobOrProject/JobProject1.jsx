import React from 'react'
import ClientNavBar from '../ClientHeader/ClientNavBar'
import JobsOrProjects from '../JobsOrProjects'
import Footer from '../../../Components/Common/Footer/Footer';
import TopBar from '../../../Components/Common/Header/TopBar'
import ClientSideBar from '../../../Components/Client/ClientPannel/ClientSideBar'
import Jobs from '../JobsOrProjects';
import Project from '../Project';
import Header from '../../../Components/Common/Header/Header';

const JobProject = () => {
  return (
    <>
      {/* <TopBar />
      <ClientNavBar /> */}
      <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Client</h1>
      </div>
      <div className="dashboard">
        <ClientSideBar />
        <div className='j'>
          <Project />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default JobProject
