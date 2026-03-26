import React, { useState, useEffect, useContext, useRef } from "react";
import { Input, Button, Select, Spin, Alert } from "antd";
import "./SignupPage.css";
import logo from "../../../assets/images/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { validateEmail } from "../../../utils/validators/validateEmail";
import { validateFullName } from "../../../utils/validators/validateFullName";
import { validatePassword } from "../../../utils/validators/validatePassword";
import { validatePassword2 } from "../../../utils/validators/validatePassword2";
import axios from "axios";
import { category_list, member_signup_url, skill_list } from "../../../api";
import { toast } from "react-toastify";
import PhoneInput from "antd-phone-input";
import { State } from "country-state-city";
import { AppContext } from "../../../contexts/AppContexts";
import Header from "../Header/Header";

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planId = location.state || {};
  console.log("planId", planId);
  const { token } = useContext(AppContext);
  const [fullname, setFullname] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState(undefined);
  const [businessCategory, setBusinessCategory] = useState(undefined);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [country, setCountry] = useState(null);
  const [phone, setPhone] = useState(null);
  const [errors, setErrors] = useState({});
  const [id, setId] = useState("");
  const [skillLoading, setSkillLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [noSkillsAvailable, setNoSkillsAvailable] = useState(false);
  const [agreed, setAgreed] = useState(false);
  // ── Google Maps lat/lng ──────────────────────────────────────────────────
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const cityInputRef = useRef(null);
  // ────────────────────────────────────────────────────────────────────────

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
  ].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (!location?.state) {
      navigate("/member-resource-login");
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const res = await axios.get(category_list, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.code === 200) {
          const sortedCategories = [...res.data.data].sort((a, b) =>
            a.title.localeCompare(b.title),
          );
          setCategories(
            sortedCategories.map((cat) => ({
              label: cat.title,
              value: cat._id,
            })),
          );
        }
      } catch (err) {
        toast.error(
          err.response?.data?.error_description || "Failed to load categories",
        );
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (!businessCategory) {
      setSkills([]);
      setNoSkillsAvailable(false);
      setSelectedSkills([]);
      return;
    }
    const fetchSkills = async () => {
      setSkillLoading(true);
      setNoSkillsAvailable(false);
      setSelectedSkills([]);
      try {
        const res = await axios.post(
          skill_list,
          { categoryId: businessCategory },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.data.code === 200) {
          const sortedSkills = res.data.data
            .slice()
            .sort((a, b) => a.title.localeCompare(b.title));
          const skillOptions = sortedSkills.map((skill) => ({
            label: skill.title,
            value: skill._id,
          }));
          setSkills(skillOptions);
          if (skillOptions.length === 0) {
            setNoSkillsAvailable(true);
            toast.info("No skills found for the selected category");
          }
        }
      } catch (err) {
        toast.error(
          err.response?.data?.error_description || "Failed to load skills",
        );
        setSkills([]);
        setNoSkillsAvailable(true);
      } finally {
        setSkillLoading(false);
      }
    };
    fetchSkills();
  }, [businessCategory, token]);

  // ── Load Google Maps script ──────────────────────────────────────────────
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      console.warn("Google Maps API key missing");
      return;
    }
    if (window.google?.maps?.places) {
      setIsGoogleMapsLoaded(true);
      return;
    }
    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    if (document.querySelector(`script[src="${scriptUrl}"]`)) {
      setIsGoogleMapsLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleMapsLoaded(true);
    script.onerror = () => toast.error("Failed to load Google Maps.");
    document.body.appendChild(script);
    return () => {
      const existing = document.querySelector(`script[src="${scriptUrl}"]`);
      if (existing) existing.remove();
    };
  }, []);

  // ── Attach Autocomplete to city input ───────────────────────────────────
  useEffect(() => {
    if (!isGoogleMapsLoaded || !cityInputRef.current) return;

    // Ant Design Input wraps the real <input> — grab it directly
    const inputEl =
      cityInputRef.current.input ??
      cityInputRef.current.querySelector?.("input") ??
      cityInputRef.current;

    if (!inputEl) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputEl);
    autocomplete.setFields([
      "formatted_address",
      "address_components",
      "geometry",
    ]);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        toast.error("Please select a location from the suggestions.");
        return;
      }

      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      setLat(latitude);
      setLng(longitude);

      let cityName = "";
      let countryCode = "";

      for (const component of place.address_components || []) {
        if (
          component.types.includes("locality") ||
          component.types.includes("administrative_area_level_2")
        ) {
          if (!cityName) cityName = component.long_name;
        }
        if (component.types.includes("country")) {
          countryCode = component.short_name.toLowerCase();
        }
      }

      setCity(cityName || place.formatted_address);
      setErrors((prev) => ({ ...prev, city: "" }));

      if (countryCode) {
        const match = africanCountryList.find(
          (c) => c.code.toLowerCase() === countryCode,
        );
        if (match) {
          setCountry(countryCode);
          setDistrict(undefined);
          setErrors((prev) => ({ ...prev, country: "", district: "" }));
        }
      }
    });
  }, [isGoogleMapsLoaded]);
  // ────────────────────────────────────────────────────────────────────────

  const validateBusiness = (value) => {
    if (!value || value.trim() === "")
      return "Please enter business or individual trading name";
    if (value.trim().length < 3)
      return "Business name must be at least 3 characters long";
    if (value.trim().length > 100)
      return "Business name cannot exceed 100 characters";
    return "";
  };

  const validateCity = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Please enter town, village or city";
    if (trimmed.length < 2)
      return "Town/village/city must be at least 2 characters";
    if (!/^[A-Za-z\s\-']+$/.test(trimmed))
      return "Only letters, spaces, hyphens and apostrophes allowed";
    return "";
  };

  const validateSkills = (skills) => {
    if (!skills || skills.length === 0)
      return "Please select at least one skill";
    return "";
  };

  const validatePhone = (phoneData) => {
    if (!phoneData || !phoneData.valid)
      return "Please enter a valid contact number";
    return "";
  };

  const handleChange = (name, value) => {
    let processedValue = value;
    if (name === "fullname") {
      processedValue = value.replace(/[^A-Za-z\s]/g, "");
      setFullname(processedValue);
    } else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
    else if (name === "password2") setPassword2(value);
    else if (name === "business") setBusiness(value);
    else if (name === "city") {
      setCity(value);
      // Clear lat/lng if user manually edits the city field
      setLat("");
      setLng("");
    }

    let fieldError = "";
    if (name === "fullname")
      fieldError = validateFullName(processedValue || value);
    else if (name === "email") fieldError = validateEmail(value);
    else if (name === "password") fieldError = validatePassword(value);
    else if (name === "password2")
      fieldError = validatePassword2(password, value);
    else if (name === "business") fieldError = validateBusiness(value);
    else if (name === "city") fieldError = validateCity(value);

    setErrors((prev) => ({ ...prev, [name]: fieldError }));

    if (name === "password" && password2) {
      setErrors((prev) => ({
        ...prev,
        password2: validatePassword2(value, password2),
      }));
    }
  };

  const handleCountryChange = (value) => {
    setCountry(value);
    setDistrict(undefined);
    setCity("");
    setLat("");
    setLng("");
    setErrors((prev) => ({ ...prev, country: "", district: "", city: "" }));
  };

  const handleBusinessCategoryChange = (value) => {
    setBusinessCategory(value);
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (value) delete newErrors.businessCategory;
      else newErrors.businessCategory = "Please select a category";
      return newErrors;
    });
  };

  const handleSkillsChange = (value) => {
    setSelectedSkills(value);
    if (value.length > 5) {
      toast.error("You can select a maximum of 5 skills");
      setSelectedSkills(value.slice(0, 5));
      setErrors((prev) => ({ ...prev, skills: "" }));
    } else {
      setErrors((prev) => ({ ...prev, skills: "" }));
    }
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    newErrors.fullname = validateFullName(fullname);
    newErrors.email = validateEmail(email);
    newErrors.country = country ? "" : "Please select a country";
    newErrors.district = district
      ? ""
      : "Please select a district, province or state";
    newErrors.city = validateCity(city);
    newErrors.phone = validatePhone(phone);
    newErrors.password = validatePassword(password);
    newErrors.password2 = validatePassword2(password, password2);
    newErrors.business = validateBusiness(business);
    newErrors.businessCategory = businessCategory
      ? ""
      : "Please select a category";
    newErrors.skills = validateSkills(selectedSkills);

    Object.keys(newErrors).forEach(
      (key) => !newErrors[key] && delete newErrors[key],
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (id) {
      navigate("/verify", {
        replace: true,
        state: { email, activeTab: "member", id, planId },
      });
    }
  }, [id, navigate, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    const selectedCountryObj = africanCountryList.find(
      (c) => c.code.toLowerCase() === country,
    );

    const signupData = {
      fullName: fullname.trim(),
      email: email.trim().toLowerCase(),
      password,
      address: [city.trim(), district, selectedCountryObj?.name]
        .filter(Boolean)
        .join(", "),
      phoneNumber:
        phone && phone.valid
          ? `+${phone.countryCode}${phone.areaCode || ""}${phone.phoneNumber}`
          : "",
      memberCategory: "skilled-worker",
      businessTradingName: business.trim(),
      countryCode: country?.toUpperCase() || "",
      categoryId: businessCategory,
      city: city.trim(),
      state: district,
      country: selectedCountryObj?.name || "",
      skillIds: selectedSkills,
      membership: planId,
      // ── lat/lng from Google Maps city autocomplete ──
      latitude: lat,
      longitude: lng,
      // ───────────────────────────────────────────────
    };

    try {
      const response = await axios.post(member_signup_url, signupData);
      if (response.data.code === 200 && response.data.status) {
        toast.success(response.data.message || "Account created successfully!");
        setId(response.data?.data?._id);
      } else {
        toast.error(
          response.data?.error_description ||
            response.data?.error_message ||
            "Signup failed.",
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error_description || "Something went wrong.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="signup-wrapper">
        <div className="signup-container">
          <img src={logo} alt="Logo" className="signup-logo" />

          <h2 className="signup-title">Sign Up</h2>
          <Spin spinning={submitting} tip="Creating your account...">
            <form className={`signup-form ${!agreed ? "agreed-false" : ""}`} onSubmit={handleSubmit}>
              <div className="pj-terms">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label htmlFor="terms">
                  By proceeding, I confirm that I have read and agree to the{" "}
                  <span onClick={() => navigate("/terms-&-conditions")}>
                    Terms and Conditions
                  </span>
                </label>
              </div>
              <div className="form-group">
                <label>
                  Full Name <span className="required-asterisk">*</span>
                </label>
                <Input
                  placeholder="Enter Your Full Name"
                  className="signup-input"
                  value={fullname}
                  onChange={(e) => handleChange("fullname", e.target.value)}
                  disabled={submitting || !agreed}
                />
                {errors.fullname && (
                  <p className="error-text">{errors.fullname}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  Email Address <span className="required-asterisk">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="Enter Your Email Address"
                  className="signup-input"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={submitting || !agreed}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label>
                  Country <span className="required-asterisk">*</span>
                </label>
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Select Country"
                  className="signup-input"
                  value={country}
                  onChange={handleCountryChange}
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
              </div>

              <div className="form-group">
                <label>
                  District, Province Or State{" "}
                  <span className="required-asterisk">*</span>
                </label>
                <Select
                  showSearch
                  placeholder={
                    country ? "Select State/Province" : "Select a country first"
                  }
                  className="signup-input"
                  value={district}
                  disabled={!country || submitting || !agreed}
                  onChange={(value) => {
                    setDistrict(value);
                    setErrors((prev) => ({ ...prev, district: "" }));
                  }}
                >
                  {country &&
                    State.getStatesOfCountry(country.toUpperCase()).map((s) => (
                      <Select.Option key={s.isoCode} value={s.name}>
                        {s.name}
                      </Select.Option>
                    ))}
                </Select>
                {errors.district && (
                  <p className="error-text">{errors.district}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  Town, Village Or City{" "}
                  <span className="required-asterisk">*</span>
                </label>
                <Input
                  ref={cityInputRef}
                  placeholder="Start typing your city..."
                  className="signup-input"
                  value={city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  disabled={submitting || !agreed}
                />
                {errors.city && <p className="error-text">{errors.city}</p>}
              </div>

              <div className="form-group">
                <label>
                  Business or Individual Trading Name{" "}
                  <span className="required-asterisk">*</span>
                </label>
                <Input
                  placeholder="Enter Business or Individual Trading Name"
                  className="signup-input"
                  value={business}
                  onChange={(e) => handleChange("business", e.target.value)}
                  disabled={submitting || !agreed}
                />
                {errors.business && (
                  <p className="error-text">{errors.business}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  Category <span className="required-asterisk">*</span>
                </label>
                {categoryLoading ? (
                  <div style={{ padding: "12px 0", textAlign: "center" }}>
                    <Spin tip="Loading categories..." />
                  </div>
                ) : (
                  <Select
                    placeholder="Select Category"
                    className="signup-input"
                    value={businessCategory || undefined}
                    onChange={handleBusinessCategoryChange}
                    options={categories}
                    disabled={submitting || !agreed}
                  />
                )}
                {errors.businessCategory && (
                  <p className="error-text">{errors.businessCategory}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  Profession, Skill or Trades{" "}
                  <span className="required-asterisk">*</span>{" "}
                  <span style={{ fontSize: "0.8rem", opacity: "0.7" }}>
                    (Max limit: 5 skills)
                  </span>
                </label>
                {skillLoading ? (
                  <div style={{ padding: "12px 0", textAlign: "center" }}>
                    <Spin tip="Loading skills..." />
                  </div>
                ) : (
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder={
                      businessCategory
                        ? "Select skills (max 5)"
                        : "Select a category first"
                    }
                    className="signup-input"
                    value={selectedSkills}
                    onChange={(value) => {
                      if (value.length > 5) {
                        toast.error("You can select maximum 5 skills only.");
                        return;
                      }
                      handleSkillsChange(value);
                    }}
                    disabled={
                      !agreed ||
                      !businessCategory ||
                      skillLoading ||
                      noSkillsAvailable ||
                      submitting
                    }
                    options={skills}
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                    maxTagCount={5}
                  />
                )}
                {errors.skills && <p className="error-text">{errors.skills}</p>}
              </div>

              <div className="form-group">
                <label>
                  Contact Number <span className="required-asterisk">*</span>
                </label>
                <PhoneInput
                  country="ng"
                  enableSearch
                  onChange={handlePhoneChange}
                  disabled={submitting || !agreed}
                  value={phone}
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <label>
                  Password <span className="required-asterisk">*</span>
                </label>
                <Input.Password
                  placeholder="Enter Your Password"
                  className="signup-input"
                  value={password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={submitting || !agreed}
                />
                {errors.password && (
                  <p className="error-text">{errors.password}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  Confirm Password <span className="required-asterisk">*</span>
                </label>
                <Input.Password
                  placeholder="Confirm Your Password"
                  className="signup-input"
                  value={password2}
                  onChange={(e) => handleChange("password2", e.target.value)}
                  disabled={submitting || !agreed}
                />
                {errors.password2 && (
                  <p className="error-text">{errors.password2}</p>
                )}
              </div>

              

              <Button
                type="primary"
                block
                className="review-signup__btn"
                htmlType="submit"
                loading={submitting}
                disabled={submitting || !agreed}
              >
                Sign Up →
              </Button>

              <p className="login-text">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </form>
          </Spin>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
