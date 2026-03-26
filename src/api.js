const API_URL = "http://192.168.0.26:5656";        
// const API_URL = "http://92.205.182.153:3000";
// const API_URL = "https://api.skillstrad.com"
// const API_URL = "http://localhost:5656";    `    
// const API_URL = "https://api.skillsandtrade.com"

const admin_login_url = `${API_URL}/Admin/api/login`
const admin_view_profile = `${API_URL}/Admin/api/view-profile`
const admin_forgot_password = `${API_URL}/Admin/api/forgot-password`
const admin_set_new_password = `${API_URL}/Admin/api/set-new-password`
const admin_change_password = `${API_URL}/Admin/api/change-password`
const admin_update_profile = `${API_URL}/Admin/api/update-profile`
const admin_verify_member = `${API_URL}/Admin/api/member-verified-by-admin`
const admin_check_reset_token = `${API_URL}/Admin/api/check-reset-token`
const admin_fetch_user_counts = `${API_URL}/Admin/api/user-count`
const admin_edit_profile = `${API_URL}/Admin/api/update-profile`
const admin_get_all_member = `${API_URL}/Admin/api/get-all-member`
const admin_get_all_blog = `${API_URL}/Admin/api/get-all-blogs`
const admin_get_create_blog = `${API_URL}/Admin/api/create-blog`
const admin_update_blog = `${API_URL}/Admin/api/update-blog`
const admin_get_notifications = `${API_URL}/Admin/api/get-notifications`
const admin_mark_notification_read = `${API_URL}/Admin/api/mark-notification-read`
const admin_create_category = `${API_URL}/Admin/api/create-category`
const admin_get_all_category = `${API_URL}/Admin/api/get-all-category`
const admin_delete_category = `${API_URL}/Admin/api/delete-category`
const admin_reviews_list = `${API_URL}/Admin/api/rating-list`
const admin_review_status = `${API_URL}/Admin/api/admin-action-in-review`
const admin_create_skill = `${API_URL}/Admin/api/create-skill`
const admin_get_skills_by_category = `${API_URL}/Admin/api/get-skills-by-category`
const admin_delete_skill = `${API_URL}/Admin/api/delete-skill`
const admin_client_list = `${API_URL}/Admin/api/client-list`
const admin_client_approval = `${API_URL}/Admin/api/client-approval`
const admin_profile_change_list = `${API_URL}/Admin/api/profile-change-list`
const admin_profile_change_action = `${API_URL}/Admin/api/admin-action-in-profile-change`
const admin_create_advisory = `${API_URL}/Admin/api/create-advisory`
const admin_edit_advisory = `${API_URL}/Admin/api/edit-advisory`
const admin_delete_advisory = `${API_URL}/Admin/api/delete-advisory`
const admin_get_all_advisory = `${API_URL}/Admin/api/advisory-list`
const admin_get_all_job = `${API_URL}/Admin/api/client-list-with-job-count`
const admin_get_job_acc_client = `${API_URL}/Admin/api/job-list-by-client`
const admin_delete_job = `${API_URL}/Admin/api/jobs/:id/delete`
const admin_edit_category = `${API_URL}/Admin/api/update-category`
const admin_get_contact_us_list = `${API_URL}/Admin/api/get-contact-us-list`
const admin_get_dashboard = `${API_URL}/Admin/api/get-dashboard-stats`
const get_user_by_country = `${API_URL}/Admin/api/user-by-country`

export {
        API_URL, admin_login_url, admin_view_profile, admin_forgot_password, admin_set_new_password, admin_change_password,
        admin_update_profile, admin_verify_member, admin_check_reset_token, admin_fetch_user_counts, admin_edit_profile,
        admin_get_all_member, admin_get_all_blog, admin_get_create_blog, admin_update_blog, admin_create_category,
        admin_get_all_category, admin_delete_category, admin_reviews_list, admin_review_status, admin_create_skill,
        admin_get_skills_by_category, admin_delete_skill, admin_client_list, admin_client_approval, admin_profile_change_list,
        admin_profile_change_action, admin_create_advisory, admin_edit_advisory, admin_delete_advisory, admin_get_all_advisory,
        admin_get_all_job, admin_get_job_acc_client, admin_delete_job, admin_edit_category, admin_get_notifications,
        admin_mark_notification_read, admin_get_contact_us_list, admin_get_dashboard, get_user_by_country
}
