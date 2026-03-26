import React, { useState } from "react";
// import '@ant-design/v5-patch-for-react-19';  
import { Input, Select, Spin } from "antd";
import "./SignUpForReview.css";
import logo from "../../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../../utils/validators/validateEmail";
import { validatePassword } from "../../../utils/validators/validatePassword";
import { validatePassword2 } from "../../../utils/validators/validatePassword2";
import axios from "axios";
import { toast } from "react-toastify";
import { client_signup_url } from "../../../api";
import PhoneInput from "antd-phone-input";
import { State } from "country-state-city";
import GradientButton from "../GradientButton";
import Header from "../Header/Header";

const SignUpForReview = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [phone, setPhone] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const africanCountryList = [
    { code: "DZ", name: "Algeria" },
    { code: "AO", name: "Angola" },
    { code: "BJ", name: "Benin" },
    { code: "BW", name: "Botswana" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BI", name: "Burundi" },
    { code: "CV", name: "Cape Verde" },
    { code: "CM", name: "Cameroon" },
    { code: "CF", name: "Central African Republic" },
    { code: "TD", name: "Chad" },
    { code: "KM", name: "Comoros" },
    { code: "CD", name: "Democratic Republic of the Congo" },
    { code: "DJ", name: "Djibouti" },
    { code: "EG", name: "Egypt" },
    { code: "GQ", name: "Equatorial Guinea" },
    { code: "ER", name: "Eritrea" },
    { code: "SZ", name: "Eswatini" },
    { code: "ET", name: "Ethiopia" },
    { code: "GA", name: "Gabon" },
    { code: "GM", name: "Gambia" },
    { code: "GH", name: "Ghana" },
    { code: "GN", name: "Guinea" },
    { code: "GW", name: "Guinea-Bissau" },
    { code: "CI", name: "Ivory Coast" },
    { code: "KE", name: "Kenya" },
    { code: "LS", name: "Lesotho" },
    { code: "LR", name: "Liberia" },
    { code: "LY", name: "Libya" },
    { code: "MG", name: "Madagascar" },
    { code: "MW", name: "Malawi" },
    { code: "ML", name: "Mali" },
    { code: "MR", name: "Mauritania" },
    { code: "MU", name: "Mauritius" },
    { code: "MA", name: "Morocco" },
    { code: "MZ", name: "Mozambique" },
    { code: "NA", name: "Namibia" },
    { code: "NE", name: "Niger" },
    { code: "NG", name: "Nigeria" },
    { code: "CG", name: "Republic of the Congo" },
    { code: "RE", name: "Réunion" },
    { code: "RW", name: "Rwanda" },
    { code: "SH", name: "Saint Helena" },
    { code: "ST", name: "São Tomé and Príncipe" },
    { code: "SN", name: "Senegal" },
    { code: "SC", name: "Seychelles" },
    { code: "SL", name: "Sierra Leone" },
    { code: "SO", name: "Somalia" },
    { code: "ZA", name: "South Africa" },
    { code: "SS", name: "South Sudan" },
    { code: "SD", name: "Sudan" },
    { code: "TZ", name: "Tanzania" },
    { code: "TG", name: "Togo" },
    { code: "TN", name: "Tunisia" },
    { code: "UG", name: "Uganda" },
    { code: "ZM", name: "Zambia" },
    { code: "ZW", name: "Zimbabwe" },
  ];

  const validationMessages = {
    fullname: {
      empty: "Please enter full name.",
      short: "Full name must be at least 2 characters long.",
      long: "Full name cannot exceed 30 characters.",
      invalid: "Full name can only contain letters and spaces.",
    },
    email: {
      empty: "Please enter email address.",
      invalid: "Please enter valid email address.",
    },
    country: {
      empty: "Please select country.",
    },
    state: {
      empty: "Please select state/province.",
    },
    city: {
      empty: "Please enter your town/village/city.",
      short: "Town/village/city is too short.",
      invalid: "Town/village/city can only contain letters, spaces, hyphens, and apostrophes.",
      long: "Town/village/city cannot exceed 30 characters.",
    },
    phone: {
      empty: "Please enter contact number.",
      invalid: "Please enter valid contact number.",
      length: "Contact number should be between 8 to 15 digits.",
    },
    password: {
      empty: "Please enter password.",
      weak: "Password must be at least 8 characters long with uppercase, lowercase, number, special character, and no spaces.",
    },
    password2: {
      empty: "Please enter confirm password.",
      mismatch: "Password and confirm password must be the same.",
    },
  };

  const validateField = (name, value) => {
    switch (name) {
      case "fullname":
        if (!value?.trim()) return validationMessages.fullname.empty;
        if (value.trim().length < 2) return validationMessages.fullname.short;
        if (value.trim().length > 30) return validationMessages.fullname.long;
        if (!/^[A-Za-z\s]+$/.test(value.trim())) {
          return validationMessages.fullname.invalid;
        }
        return "";

      case "email":
        if (!value?.trim()) return validationMessages.email.empty;
        if (validateEmail(value)) return validationMessages.email.invalid;
        return "";

      case "country":
        return country ? "" : validationMessages.country.empty;

      case "state":
        return state ? "" : validationMessages.state.empty;

      case "city":
        const trimmed = value?.trim() || "";
        if (!trimmed) return validationMessages.city.empty;
        if (trimmed.length < 2) return validationMessages.city.short;
        if (!/^[A-Za-z\s\-']+$/.test(trimmed)) {
          return validationMessages.city.invalid;
        }
        if (trimmed.length > 30) return validationMessages.city.long;
        return "";

      case "phone":
        if (!phone) return validationMessages.phone.empty;
        if (!phone.valid) return validationMessages.phone.invalid;
        return "";

      case "password":
        if (!value) return validationMessages.password.empty;
        const pwError = validatePassword(value);
        return pwError || "";

      case "password2":
        if (!value) return validationMessages.password2.empty;
        if (value !== password) return validationMessages.password2.mismatch;
        return "";

      default:
        return "";
    }
  };

  const handleChange = (name, value) => {
    let newValue = value;

    // Apply input masking/cleaning
    if (name === "fullname") {
      const cleaned = value.replace(/[^A-Za-z\s]/g, "");
      if (cleaned.length <= 30) {
        setFullname(cleaned);
        newValue = cleaned;
      }
      return;
    } else if (name === "city") {
      setCity(value);
      newValue = value;
    } else if (name === "email") {
      setEmail(value);
      newValue = value;
    } else if (name === "password") {
      setPassword(value);
      newValue = value;
    } else if (name === "password2") {
      setPassword2(value);
      newValue = value;
    }

    // Mark field as touched for real-time validation
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate and update error in real-time
    const error = validateField(name, newValue);
    setErrors((prev) => ({ ...prev, [name]: error }));

    // If password changes and confirm password is filled, re-validate confirm password
    if (name === "password" && password2) {
      const confirmError = validateField("password2", password2);
      setErrors((prev) => ({
        ...prev,
        password2: confirmError,
      }));
    }
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    setTouched((prev) => ({ ...prev, phone: true }));
    const error = validateField("phone", value);
    setErrors((prev) => ({ ...prev, phone: error }));
  };

  const handleCountryChange = (value) => {
    setCountry(value);
    setState(null);
    setCity("");
    setTouched((prev) => ({ ...prev, country: true, state: false, city: false }));
    setErrors((prev) => ({ ...prev, country: "", state: "", city: "" }));
  };

  const handleStateChange = (value) => {
    setState(value);
    setCity("");
    setTouched((prev) => ({ ...prev, state: true, city: false }));
    const error = validateField("state", value);
    setErrors((prev) => ({ ...prev, state: error, city: "" }));
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    let value;
    if (name === "fullname") value = fullname;
    else if (name === "email") value = email;
    else if (name === "city") value = city;
    else if (name === "password") value = password;
    else if (name === "password2") value = password2;
    else if (name === "country") value = country;
    else if (name === "state") value = state;
    else if (name === "phone") value = phone;

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      fullname: validateField("fullname", fullname),
      email: validateField("email", email),
      country: validateField("country", country),
      state: validateField("state", state),
      city: validateField("city", city),
      phone: validateField("phone", phone),
      password: validateField("password", password),
      password2: validateField("password2", password2),
    };

    setErrors(newErrors);

    setTouched({
      fullname: true,
      email: true,
      country: true,
      state: true,
      city: true,
      phone: true,
      password: true,
      password2: true,
    });

    return !Object.values(newErrors).some((err) => err !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const selectedCountry = africanCountryList.find(
      (c) => c.code.toLowerCase() === country
    );

    const signupData = {
      fullName: fullname.trim(),
      email: email.trim().toLowerCase(),
      password,
      country: selectedCountry?.name || "",
      state: state || "",
      city: city.trim(),
      phoneNumber: phone && phone.valid
        ? `+${phone.countryCode}${phone.areaCode || ""}${phone.phoneNumber}`
        : "",
      address: [city.trim(), state, selectedCountry?.name]
        .filter(Boolean)
        .join(", "),
    };

    try {
      const response = await axios.post(client_signup_url, signupData);

      if (response.status === 200 && response.data.status) {
        toast.success(response.data.message || "Account created successfully!");
        navigate("/verify", {
          replace: true,
          state: { email, activeTab: "client" },
        });
      } else {
        toast.error(
          response.data?.error_description ||
          response.data?.error_message ||
          "Signup failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error.response?.data?.error_description ||
        "Something went wrong! Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="review-signup">
        <div className="review-signup__container">
          <img src={logo} alt="Logo" className="review-signup__logo" />

          <h2 className="review-signup__title">We Just Need A Few Details</h2>
          <p className="review-signup__desc">
            Your details will not be passed to any other party or used for any
            purpose other than to possibly contact you regarding your activities on our website. Please log-in with link below if you already have an account.
          </p>

          <Spin spinning={submitting} tip="Creating account...">
            <form className={`review-signup__form ${!agreed ? "agreed-false" : ""}`} onSubmit={handleSubmit}>
              <div className="pj_terms">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <div>
                  <span className="cc">
                    By proceeding, I confirm that I have read and agree to the{" "}
                  </span>
                  <span onClick={() => navigate("/terms-&-conditions")} className="tt">
                    Terms and Conditions
                  </span>
                </div>
              </div>
              <label className="review-signup__label">Full Name</label>
              <Input
                placeholder="Enter Your Full Name"
                className={`review-signup__input`}
                value={fullname}
                onChange={(e) => handleChange("fullname", e.target.value)}
                onBlur={() => handleBlur("fullname")}
                disabled={submitting || !agreed}
              />
              {errors.fullname && (
                <p className="error-text">{errors.fullname}</p>
              )}

              <label className="review-signup__label">Email Address</label>
              <Input
                type="email"
                placeholder="Enter Your Email Address"
                className={`review-signup__input`}
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                disabled={submitting || !agreed}
              />
              {errors.email && (
                <p className="error-text">{errors.email}</p>
              )}

              <label className="review-signup__label">Country</label>
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Select Country"
                className={`review-signup__select`}
                value={country}
                onChange={handleCountryChange}
                onBlur={() => handleBlur("country")}
                disabled={submitting || !agreed}
              >
                {africanCountryList.map((c) => (
                  <Select.Option key={c.code} value={c.code.toLowerCase()}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
              {errors.country && (
                <p className="error-text">{errors.country}</p>
              )}

              <label className="review-signup__label">District, Province Or State</label>
              <Select
                showSearch
                placeholder="Select State/Province"
                className={`review-signup__select`}
                value={state}
                disabled={!country || submitting || !agreed}
                onChange={handleStateChange}
                onBlur={() => handleBlur("state")}
              >
                {country &&
                  State.getStatesOfCountry(country.toUpperCase()).map((s) => (
                    <Select.Option key={s.isoCode} value={s.name}>
                      {s.name}
                    </Select.Option>
                  ))}
              </Select>
              {errors.state && (
                <p className="error-text">{errors.state}</p>
              )}

              <label className="review-signup__label">Town , Village Or City</label>
              <Input
                placeholder="Enter your town, village or city"
                className={`review-signup__input`}
                value={city}
                onChange={(e) => handleChange("city", e.target.value)}
                onBlur={() => handleBlur("city")}
                disabled={submitting || !agreed}
              />
              {errors.city && (
                <p className="error-text">{errors.city}</p>
              )}

              <label className="review-signup__label">Contact Number</label>
              <PhoneInput
                enableSearch
                onChange={handlePhoneChange}
                onBlur={() => handleBlur("phone")}
                disabled={submitting || !agreed}
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && (
                <p className="error-text">{errors.phone}</p>
              )}

              <label className="review-signup__label_">Password</label>
              <Input.Password
                placeholder="Enter Your Password"
                className={`review-signup__input`}
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                disabled={submitting || !agreed}
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}

              <label className="review-signup__label">Confirm Password</label>
              <Input.Password
                placeholder="Confirm Your Password"
                className={`review-signup__input`}
                value={password2}
                onChange={(e) => handleChange("password2", e.target.value)}
                onBlur={() => handleBlur("password2")}
                disabled={submitting || !agreed}
              />
              {errors.password2 && (
                <p className="error-text">{errors.password2}</p>
              )}
              <GradientButton
                text={submitting ? "Signing up..." : "Sign Up"}
                onClick={handleSubmit}
                type="submit"
                className="review-signup__btn"
                disabled={submitting || !agreed}
              />

              <p className="review-signup__login">
                If you already have an account? <Link to="/login">Log in</Link>
              </p>
              {/* <p className="review-signup__login">
                Read our <Link to="/page-policy">Privacy Policy</Link> here.
              </p> */}
            </form>
          </Spin>
        </div>
      </div>
    </>
  );
};

export default SignUpForReview;