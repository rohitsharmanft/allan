import React from 'react'
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader'
import Sidebar from '../../components/SideBar/Sidebar'
import ReviewCard from '../../common/ReviewCard/ReviewCard'
import GradientButton from '../../common/GradientButton/GradientButton'

const ViewMissedAppointment = () => {
  return (
    <>
      <DashboardHeader />

      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>

        <div className="dashboard-right">
           <div className="bread-crumb">
            <span className="bc-light">Reviews</span>
            <span className="bc-arrow">›</span>
            <span className="bc-dark">View Reviews</span>
          </div>
          <div className="reviews-section">
            <ReviewCard
              name="Reviews For Allan"
              reviewedBy="James"
              comment="I found the skills that I was looking for, the platform is fast and efficient."
              rating="4.75"
            />
          </div>
          <div className="reviews_btn">
            <GradientButton text={"Delete"} className="btn-delete" />
            <GradientButton text={"Discard"} className="btn-discard" />
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewMissedAppointment
