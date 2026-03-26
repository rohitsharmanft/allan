import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login/Login";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword";
import CheckInbox from "./components/CheckInBox/CheckInbox";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import PasswordChanged from './components/PasswordChanged/PasswordChanged';
import Dashboard from "./pages/Dashboard/DashBoard";
import ManageMembers from "./pages/ManageMember/ManageMembers";
import ManageClients from "./pages/ManageClients/ManageClients";
import ViewProfile from "./pages/ViewProfile/ViewProfile";
import EditMember from "./pages/EditMember/EditMember";
import Blog from "./pages/Blog/Blog";
import ArticleDetail from "./pages/Blog/ArticleDetails";
import EditBlog from "./pages/Blog/EditBlog";
import Reviews from "./pages/Reviews/Reviews";
import Published from "./pages/Reviews/Published";
import Unpublished from "./pages/Reviews/Unpublished";
import ViewReviews from "./pages/Reviews/ViewReviews";
import AddBlog from "./pages/Blog/AddBlog";
import MissedAppointment from "./pages/Reviews/MissedAppointment";
import Complaint from "./pages/Reviews/Complaint";
import ViewComplaint from "./pages/Reviews/ViewComplaint";
import ViewMissedAppointment from "./pages/Reviews/ViewMissedAppointment";
import AllJobs from "./pages/Job/AllJob";
import ViewJobs from "./pages/Job/ViewJobs";
import JobDetails from "./pages/Job/JobDetails";
import ProfilePage from "./pages/Profile/ProfilePage";
import ChangePassword from "./pages/Change-Password/ChangePassword";
import EditProfile from "./pages/Edit-profile/EditProfile";
import CategoryMangement from "./pages/Category/CategoryMangement";
import CreateCategory from "./pages/Category/CreateCategory";
import UpdateCategoy from "./pages/Category/UpdateCategoy";
import SkillsManagement from "./pages/Skills/skillsManagement";
import CreateSkills from "./pages/Skills/CreateSkills";
import MenbersReviews from "./pages/Reviews/MembersReviews";
import SubprofileReviews from "./pages/Reviews/SubprofileReviews";
import AdminProfilesPage from "./pages/ProfileRequests/profile_requests";
import './Responsive.css';
import Advisory from "./pages/Advisory/Advisory";
import AdvisoryDetails from "./pages/Advisory/AdvisoryDetails";
import EditAdvisory from "./pages/Advisory/EditAdvisory";
import AddAdvisory from "./pages/Advisory/AddAdvisory";
import ViewProject from "./pages/Projects/ViewProject";
import AllProject from "./pages/Projects/AllProject";
import ProjectDetails from "./pages/Projects/ProjectDetails";
import ViewProfile1 from "./pages/ViewProfile 1/ViewProfile1";
import Notification from "./pages/Notification/Notification";
import ContactUsList from "./pages/ContactUs/ContactUsList";
const getToken = () => {
  return localStorage.getItem("accessToken") || null;
};

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  const location = useLocation();
  if (!token) { return <Navigate to="/" replace state={{ from: location }} />; }
  return children;
};

const PublicRoute = ({ children }) => {
  const token = getToken();
  if (token) { return <Navigate to="/dashboard" replace />; }
  return children;
};

export default function RoutesComponent() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Only accessible when NOT logged in */}
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/forget-password" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
        <Route path="/check-in-box" element={<PublicRoute><CheckInbox /></PublicRoute>} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route path="/password-changed" element={<PasswordChanged />} />

        {/* Protected Routes - Only accessible when logged in */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/manage-members" element={<ProtectedRoute><ManageMembers /></ProtectedRoute>} />
        <Route path="/manage-clients" element={<ProtectedRoute><ManageClients /></ProtectedRoute>} />
        <Route path="/view-profile" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
        <Route path="/edit" element={<ProtectedRoute><EditMember /></ProtectedRoute>} />
        <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
        <Route path="/blog-detail" element={<ProtectedRoute><ArticleDetail /></ProtectedRoute>} />
        <Route path="/edit-detail" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        <Route path="/published" element={<ProtectedRoute><Published /></ProtectedRoute>} />
        <Route path="/unpublished" element={<ProtectedRoute><Unpublished /></ProtectedRoute>} />
        <Route path="/view-reviews" element={<ProtectedRoute><ViewReviews /></ProtectedRoute>} />
        <Route path="/add-blog" element={<ProtectedRoute><AddBlog /></ProtectedRoute>} />
        <Route path="/missed-appointment" element={<ProtectedRoute><MissedAppointment /></ProtectedRoute>} />
        <Route path="/complaint" element={<ProtectedRoute><Complaint /></ProtectedRoute>} />
        <Route path="/view-complaint" element={<ProtectedRoute><ViewComplaint /></ProtectedRoute>} />
        <Route path="/view-missed-appointment" element={<ProtectedRoute><ViewMissedAppointment /></ProtectedRoute>} />
        <Route path="/job" element={<ProtectedRoute><AllJobs /></ProtectedRoute>} />
        <Route path="/view-job" element={<ProtectedRoute><ViewJobs /></ProtectedRoute>} />
        <Route path="/job-details" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
        <Route path="/category" element={<ProtectedRoute><CategoryMangement /></ProtectedRoute>} />
        <Route path="/create-category" element={<ProtectedRoute><CreateCategory /></ProtectedRoute>} />
        <Route path="/update-category" element={<ProtectedRoute><UpdateCategoy /></ProtectedRoute>} />
        <Route path="/skills" element={<ProtectedRoute><SkillsManagement /></ProtectedRoute>} />
        <Route path="/create-skills" element={<ProtectedRoute><CreateSkills /></ProtectedRoute>} />
        <Route path="/reviews/member/:id" element={<ProtectedRoute><MenbersReviews /></ProtectedRoute>} />
        <Route path="/reviews/subprofile/:id/reviews" element={<ProtectedRoute><SubprofileReviews /></ProtectedRoute>} />
        <Route path="/profile-update-requests" element={<ProtectedRoute><AdminProfilesPage /></ProtectedRoute>} />
        <Route path="/advisory" element={<ProtectedRoute><Advisory /></ProtectedRoute>} />
        <Route path="/advisory-detail" element={<ProtectedRoute><AdvisoryDetails /></ProtectedRoute>} />
        <Route path="/edit-advisory" element={<ProtectedRoute><EditAdvisory /></ProtectedRoute>} />
        <Route path="/add-advisory" element={<ProtectedRoute><AddAdvisory /></ProtectedRoute>} />
        <Route path="/project" element={<ProtectedRoute><AllProject /></ProtectedRoute>} />
        <Route path="/view-project" element={<ProtectedRoute><ViewProject /></ProtectedRoute>} />
        <Route path="/project-details" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        <Route path="/client-profile" element={<ProtectedRoute><ViewProfile1 /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
        <Route path="/contact-us-requests" element={<ProtectedRoute><ContactUsList /></ProtectedRoute>} />

        {/* Fallback: Redirect unknown routes */}
        <Route path="*" element={<Navigate to={getToken() ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
} 