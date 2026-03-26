import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Common/Home";
import AboutUs from "./Pages/Common/About/About";
import Login from "./Components/Common/Login/Login";
import SignupPage from "./Components/Common/SignUp/SignupPage";
import AllCategories from "./Pages/Common/AllCategories/AllCategories";
import HowItWorks from "./Pages/Common/HowItWork/HowItWorks";
import MemberResourceLogin from "./Pages/Common/MemberResource/MemberResourceLogin";
import MemberAdviceCenter from "./Pages/Common/MemberResource/MemberAdviceCenter/MemberAdviceCenter";
import ClientAdviceCenter from "./Pages/Common/MemberResource/ClientAdviceCenter/ClientAdviceCenter";
import SignUpForReview from "./Components/Common/SignUpForReview/SignUpForReview";
import JobListing from "./Pages/Common/Job/JobListing";
import LeaveReview from "./Pages/Common/LeaveReview/LeaveReview";
import PrivacyPolicy from "./Pages/Common/PagePolicy/PrivacyPolicy";
import FAQClient from "./Pages/Common/FAQs/FAQClient";
import FAQMember from "./Pages/Common/FAQs/FAQMember";
import TermsAndConditions from "./Pages/Common/TermsAndConditions/TermsAndConditions";
import CookiesPolicy from "./Pages/Common/Cookies/CookiesPolicy";
import SkillsandTradesCodeofEthics from "./Pages/Common/SkillAndTradeCodeEthics/SkillsandTradesCodeofEthics";
import ContactUs from "./Pages/Common/ContactUs/ContactUs";
import OTPVerification from "./Components/Common/OTPVerification/OTPVerification";
import ForgotPassword from "./Components/Common/ForgotPassword/ForgotPassword";
import ResetPassword from "./Components/Common/ResetPassword/ResetPassword";
import Administration from "./Pages/Common/Administration/Administration";
import PrivateRoute from "./Routes/PrivateRoute";
import MemberEditProfile from "./Pages/Member/EditProfle/MemberEditProfile";
import ChangePassword from "./Pages/Member/ChangePassword/ChangePassword";
import MyProfile from "./Pages/Member/MyProfile/MyProfile";
import PersonalInformation from "./Pages/Member/MemberInformation/PersonalInformation";
import MemberProfile from "./Pages/Member/MemberProfiles/MemberProfile";
import CreateAnotherProfile from "./Pages/Member/CreateAnotherProfile/CreateAnotherProfile";
import ProfileView from "./Pages/Member/ProfileView/ProfileView";
import MemberReviews from "./Pages/Member/MemberReviews/MemberReviews";
import ReviewsSection from "./Pages/Member/MemberReviews/ReviewsSection";
import MemberMissed from "./Pages/Member/MemberReviews/MemberMissed";
import MemberComplaint from "./Pages/Member/MemberReviews/MemberComplaint";
import SubscriptionCard from "./Pages/Member/ManageSubscription/SubscriptionCard";
import ClientProfile from "./Pages/Client/ClientProfile/ClientProfile";
import ClientEditProfile from "./Pages/Client/ClientEditProfile/ClientEditProfile";
import ClientChangePassword from "./Pages/Client/ClientChangePassword/ClientChangePassword";
import ClientInformation from "./Pages/Client/ClientInformation/ClientInformation";
import MemberQuoteTable from "./Pages/Client/MemberQuoteTable";
import ClientReviews from "./Pages/Client/ClientReviews/ClientReviews";
import ClientReviewSection from "./Pages/Client/ClientReviews/ClientReviewSection";
import ClientMissed from "./Pages/Client/ClientReviews/ClientMissed";
import JobProject from "./Pages/Client/JobOrProject/JobProject";
import JobProject1 from "./Pages/Client/JobOrProject/JobProject1";
import PostNewJob from "./Pages/Client/PostNewJob";
import ClientComplaint from "./Pages/Client/ClientReviews/ClientComplaint";
import ClientComplaintViews from "./Pages/Client/ClientReviews/ClientComplaintViews";
import ClientMissedReviews from "./Pages/Client/ClientReviews/ClientMissedReviews";
import ClientJobDetail from "./Pages/Client/ClientJobDetail";
import NotFound from "./Components/Common/NotFound/NotFound";
import { useContext } from "react";
import { AppContext } from "./contexts/AppContexts";
import ViewMemberDetail from "./Pages/Client/ViewMemberDetail";
import JobDetail1 from "./Pages/Common/Job/JobDetails/JobDetail1";
import EditAnotherProfile from "./Pages/Member/CreateAnotherProfile/EditAnotherProfile";
import SkillsTrades from "./Pages/Common/SkillsDetail/SkillsTrades";
import SkillsInSouthAfrica from "./Pages/Common/SkillsInSouth/SkillsInSouthAfrica";
import JobDetails from "./Pages/Common/Job/JobDetails/JobDetails";
import ArticleDetail from "./Pages/Common/ArticleDetails/ArticleDetails";
import IDVerification from "./Components/Common/IdVerification/IDVerification";
import JobProjectTable from "./Pages/Client/JobProjectTable";
import PostNewProject from "./Pages/Client/PostNewProject";
import AssignedJobsPage from "./Pages/Client/AssignedJob/AssignedJobsPage";
import QuoteDetailsView from "./Pages/Client/AssignedJob/QuoteDetailsView";
import MemberJobsPage from "./Pages/Member/MyJob/MemberJobsPage";
import MemberJobDetailsView from "./Pages/Member/MyJob/MemberJobDetailsView";
import ProjectListing from "./Pages/Common/Job/ProjectListing";
import PayFastSubscription from "./PayFastSubscription";
import PaymentSuccess from "./Pages/Member/PaymentSuccess";
import PaymentFailed from "./Pages/Member/PaymentFailed";
import MemberProjectDetailsView from "./Pages/Member/MyPorjects/MemberProjectDetailsView";
import MemberProjectPage from "./Pages/Member/MyPorjects/MemberProjectPage";

export default function RoutesComponent() {
  const { token } = useContext(AppContext)
  return (
    <>
      {/* <ScrollToTop/> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp-member" element={<SignupPage />} />
        <Route path="/all-categories" element={<AllCategories />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/member-advice-center" element={<MemberAdviceCenter />} />
        <Route path="/client-advice-center" element={<ClientAdviceCenter />} />
        <Route path="/signup" element={<SignUpForReview />} />
        <Route path="/job" element={<JobListing />} />
        <Route path="/project" element={<ProjectListing />} />
        <Route path="/leave-review" element={<LeaveReview />} />
        <Route path="/page-policy" element={<PrivacyPolicy />} />
        <Route path="/faqs-client" element={<FAQClient />} />
        <Route path="/faqs-member" element={<FAQMember />} />
        <Route path="/terms-&-conditions" element={<TermsAndConditions />} />
        <Route path="/cookies-policy" element={<CookiesPolicy />} />
        <Route path="/skills-and-trades-code-of-ethics" element={<SkillsandTradesCodeofEthics />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/verify" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/member/reset-password" element={<ResetPassword />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />
        <Route path="/administration" element={<Administration />} />
        <Route path="/skill-profiles" element={<SkillsInSouthAfrica />} />
        <Route path="/skill-trades" element={<SkillsTrades />} />
        <Route path="/article-details" element={<ArticleDetail />} />
        <Route path="/send-id" element={<IDVerification />} />
        {/* <Route path="/payment" element={<PayFastSubscription />} /> */}
        <Route path="/member-resource-login" element={<MemberResourceLogin />} />
        <Route path="/Member/payment/success" element={<PaymentSuccess />} />
        <Route path="/Member/payment/failed" element={<PaymentFailed />} />
        <Route path="/:type-detail" element={<JobDetail1 />} />

        {/* Private Routes */}

        <Route element={<PrivateRoute />}>
          <Route path="/edit-profile" element={<MemberEditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/profile" element={<MyProfile />} />
          {/* <Route path="/member-resource-login" element={<MemberResourceLogin />} /> */}
          <Route path="/member-personal-information" element={<PersonalInformation />} />
          <Route path="/member-profile" element={<MemberProfile />} />
          <Route path="/create-another-profile" element={<CreateAnotherProfile />} />
          <Route path="/member-profile-view" element={<ProfileView />} />
          <Route path="/member-review" element={<MemberReviews />} />
          <Route path="/member-review-section" element={<ReviewsSection />} />
          <Route path="/member-missed-appointment" element={<MemberMissed />} />
          <Route path="/member-complaint" element={<MemberComplaint />} />
          <Route path="/manage-subscription" element={<SubscriptionCard />} />
          <Route path="/client-profile" element={<ClientProfile />} />
          <Route path="/client-edit-profile" element={<ClientEditProfile />} />
          <Route path="/client-change-password" element={<ClientChangePassword />} />
          <Route path="/client-information" element={<ClientInformation />} />
          <Route path="/client-Quote" element={<MemberQuoteTable />} />
          <Route path="/client-reviews" element={<ClientReviews />} />
          <Route path="/client-reviews-section" element={<ClientReviewSection />} />
          <Route path="/client-missed" element={<ClientMissed />} />
          <Route path="/client-Job" element={<JobProject />} />
          <Route path="/client-project" element={<JobProject1 />} />
          <Route path="/post-a-job" element={<PostNewJob />} />
          <Route path="/post-a-project" element={<PostNewProject />} />
          <Route path="/client-complaint" element={<ClientComplaint />} />
          <Route path="/client-complaint-views" element={<ClientComplaintViews />} />
          <Route path="/client-missed-views" element={<ClientMissedReviews />} />
          <Route path="/client-job-detail" element={<ClientJobDetail />} />
          <Route path="/member-detail" element={<ViewMemberDetail />} />
          <Route path="/update-sub-profile" element={<EditAnotherProfile />} />
          <Route path="/post-job" element={<JobDetails />} />
          <Route path="/post-project" element={<JobDetails />} />
          <Route path="/client-job-listing" element={<JobProjectTable />} />
          <Route path="/assigned-job-listing" element={<AssignedJobsPage />} />
          <Route path="/assigned-job-details" element={<QuoteDetailsView />} />
          <Route path="/member-jobs" element={<MemberJobsPage />} />
          <Route path="/member-job-details" element={<MemberJobDetailsView />} />
          <Route path="/member-projects" element={<MemberProjectPage />} />
          <Route path="/member-project-details" element={<MemberProjectDetailsView />} />

        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}