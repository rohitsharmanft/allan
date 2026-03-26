import React from 'react'
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader'
import Sidebar from '../../components/SideBar/Sidebar'
import ReviewCard from '../../common/ReviewCard/ReviewCard'
import GradientButton from '../../common/GradientButton/GradientButton'
import { Breadcrumb } from 'antd'
import { FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const ViewComplaint = () => {
  return (
    <>
       <DashboardHeader />

      <div className="dashboard-main">
        <div className="dashboard-left">
          <Sidebar />
        </div>

        <div className="dashboard-right">
         
             <div className="bread-crumb_">
            <Breadcrumb
              separator={<FiChevronRight size={14} className="ss" />}
              items={[
                {
                  title: <Link to="/reviews">Reviews</Link>,
                },

                {
                  title: "View Reviews",
                },
              ]}
            />
          </div>
         <div className="reviews-section">

        
         <ReviewCard
              name="No Complain for Allan"
              comment="I found the skills that I was looking for, the platform is fast and efficient."
            />
       
      </div>
          <div className="reviews_btn">
            <GradientButton text={"Delete →"} className="btn-delete" />
            <GradientButton text={"Discard →"} className="btn-discard" />
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewComplaint
