// import Sidebar from "../../../Components/Common/MemberPanel/Sidebar";
// import MemberHeader from "../../../Components/MemberHeader/MemberHeader";
import "./MemberEditProfile.css";
import EditProfile from "./EditProfile";
import Footer from "../../../Components/Common/Footer/Footer";
import Sidebar from "../../../Components/Member/Sidebar";
import Header from "../../../Components/Common/Header/Header";

export default function MemberEditProfile(){
    return (    
        <>
        <Header />
      <div className="hero-section">
        <div className="overlay"></div>
        <h1>Member</h1>
      </div>
      <div className="dashboard">
        <Sidebar />
        <div className="j">
       <EditProfile/>
        </div>
      </div>
      <Footer />
        </>
    )
}