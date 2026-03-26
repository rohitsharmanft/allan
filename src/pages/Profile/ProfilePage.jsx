import React, { useContext, useEffect } from 'react';
import Sidebar from '../../components/SideBar/Sidebar';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import './ProfilePage.css';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';
import { UserOutlined } from '@ant-design/icons';
import GradientButton from '../../common/GradientButton/GradientButton';
import './ProfilePage.css'
import User from '../../assets/user.png'

function ProfilePage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <>
            <DashboardHeader />
            <div className="dashboard-main">
                <div className="dashboard-left">
                    <Sidebar />
                </div>
                <div className="dashboard-right">
                    <div className="profile-container">
                        <h2 className="profile-title">My Profile</h2>
                        <div className="profile-wrapper">
                            <div className="profile_card">
                                <div className="profile-info">
                                    <img
                                        src={user?.image ? user.image : User}
                                        alt={user?.fullName || "profile"}
                                        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                                    />
                                    <div className="details">
                                        <h3>{user?.fullName || "NA"}</h3>
                                        <p className="email">{user?.email || "NA"}</p>
                                    </div>
                                </div>

                                <GradientButton className="edit-btn" text={"Edit"} onClick={() => navigate("/edit-profile")} />
                            </div>

                            <div className="password-section">

                                <p>Change password</p>
                                <GradientButton
                                    className="change-password-btn"
                                    text={"Change Password"}
                                    onClick={() => navigate("/change-password")}
                                />
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;