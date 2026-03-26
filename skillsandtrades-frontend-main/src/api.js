const API_URL = import.meta.env.VITE_API_URL;

// common-apis
const get_all_categories = `${API_URL}/User/api/get-all-category`
const get_all_skills = `${API_URL}/User/api/get-skills-by-category`
const get_profile_list_with_location = `${API_URL}/User/api/profile-list-with-location`
const job_listing = `${API_URL}/Member/api/job-listing`
const skill_list_for_searchbar = `${API_URL}/User/api/skill-list-with-search`
const advisory_list = `${API_URL}/Member/api/advisory-list`
const contact_us = `${API_URL}/Web/api/contact-us`
const detail_page = `${API_URL}/Web/api/skill-details-with-client-review`
//client-apis
const client_login_url = `${API_URL}/User/api/login`
const client_signup_url = `${API_URL}/User/api/sign-up`
const verify_otp_url_client = `${API_URL}/User/api/check-otp`
const resend_otp_url_client = `${API_URL}/User/api/send-otp`
const fetch_client_profile = `${API_URL}/User/api/view-profile`
const forgot_password_client = `${API_URL}/User/api/forget-password`
const reset_password_client = `${API_URL}/User/api/set-new-password`
const valid_reset_token_client = `${API_URL}/User/api/check-security-code`
const update_profile_client = `${API_URL}/User/api/update-profile`
const change_password_client = `${API_URL}/User/api/change-password`;
const quote_list = `${API_URL}/User/api/quote-list`;
const job_list = `${API_URL}/User/api/get-client-jobs`;
const rating_list = `${API_URL}/User/api/rating-list`;
const create_job = `${API_URL}/User/api/create-job`;
const skill_list = `${API_URL}/User/api/get-skills-by-category`
const category_list = `${API_URL}/User/api/get-all-category`
const user_delete_job = `${API_URL}/User/api/delete-job`
const client_rating_list = `${API_URL}/User/api/client-get-review`;
const client_qutataion_action = `${API_URL}/User/api/client-action-in-quote`
const qutation_details = `${API_URL}/User/api/quote-details`
const accepted_quote_list = `${API_URL}/User/api/quote-accepted-list`
const job_done = `${API_URL}/User/api/make-job-done`
const client_create_rating = `${API_URL}/User/api/create-rating`
const get_rating_by_quoteId = `${API_URL}/User/api/rating-details-by-quote`

//member-apis
const member_login_url = `${API_URL}/Member/api/login`
const member_signup_url = `${API_URL}/Member/api/sign-up`
const verify_otp_url_member = `${API_URL}/Member/api/check-otp`
const resend_otp_url_member = `${API_URL}/Member/api/send-otp`
const fetch_member_profile = `${API_URL}/Member/api/view-profile`
const forgot_password_member = `${API_URL}/Member/api/forget-password`
const reset_password_member = `${API_URL}/Member/api/set-new-password`
const valid_reset_token_member = `${API_URL}/Member/api/check-reset-token`
const update_profile_member = `${API_URL}/Member/api/update-profile`
const add_profile_member = `${API_URL}/Member/api/add-profile`;
const change_password_member = `${API_URL}/Member/api/change-password`;
const member_list = `${API_URL}/Member/api/member-list`;
const member_rating_list = `${API_URL}/Member/api/rating-list`;
const member_category_list = `${API_URL}/Member/api/get-all-category`
const member_skill_list = `${API_URL}/Member/api/get-skills-by-category`
const member_profile_list = `${API_URL}/Member/api/member-profile-list-with-review`
const member_profile_by_id = `${API_URL}/Member/api/skill-details-with-client-review`
const member_update_sub_profile = `${API_URL}/Member/api/member-edit-profile`
const member_apply_job = `${API_URL}/Member/api/create-quote`
const verify_id_proofs = `${API_URL}/Member/api/check-id`
const get_member_jobs = `${API_URL}/Member/api/member-jobs`
const create_subscription = `${API_URL}/Member/payment/create-subscription`
const get_plan = `${API_URL}/Member/api/get-plan`
const upgrade_subscription = `${API_URL}/Member/payment/upgrade-subscription`

export {
  API_URL, client_login_url, member_login_url, member_signup_url, client_signup_url, verify_otp_url_client,
  verify_otp_url_member, resend_otp_url_client, resend_otp_url_member, fetch_member_profile, create_job,
  fetch_client_profile, forgot_password_member, forgot_password_client, reset_password_client, rating_list,
  reset_password_member, valid_reset_token_client, valid_reset_token_member, update_profile_client, job_list,
  update_profile_member, add_profile_member, change_password_client, change_password_member, member_list,
  quote_list, skill_list, category_list, member_rating_list, member_category_list, get_all_categories, get_all_skills,
  get_profile_list_with_location, member_profile_by_id, member_update_sub_profile, member_skill_list, member_profile_list,
  job_listing, user_delete_job, skill_list_for_searchbar, client_rating_list, member_apply_job, advisory_list,
  verify_id_proofs, contact_us, detail_page, client_qutataion_action, qutation_details, accepted_quote_list, job_done
  , client_create_rating, get_rating_by_quoteId, get_member_jobs, create_subscription, get_plan,upgrade_subscription
};
