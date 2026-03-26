import React, { useEffect, useRef, useState } from "react";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import "./LocationModal.css";
import { useNavigate } from "react-router-dom";
import { get_profile_list_with_location } from "../../api";
import axios from "axios";
import { HiOutlineArrowLongLeft, HiOutlineArrowLongRight } from "react-icons/hi2";
import SearchResult from "./SearchResult";
import { toast } from "react-toastify";
import SkillsTrades from "../../Pages/Common/SkillsDetail/SkillsTrades.jsx";
import geo from "../../assets/icons/geo.svg";

const LocationModal = ({ skillId, jobTitle, category, onClose }) => {
  const modalRef = useRef(null);
  const locationInputRef = useRef(null);
  const navigate = useNavigate();

  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [selectedGeoLocation, setSelectedGeoLocation] = useState(null);
  const [profileData, setProfileData] = useState([]);
  const [isProfileDataExist, setIsProfileDataExist] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const searchProfileList = async () => {
    if (!selectedGeoLocation) return;

    setSearchLoading(true);
    try {
      const payload = {
        longitude: selectedGeoLocation.lng,
        latitude: selectedGeoLocation.lat,
        skillId,
        offset: 0,
        limit: 4,
      };

      const response = await axios.post(get_profile_list_with_location, payload);
      const profiles = response.data?.data?.data || [];

      if (profiles.length === 0) {
        setProfileData([]);
        setIsProfileDataExist(true);
      } else {
        navigate("/skill-profiles", {
          state: {
            profileData: profiles,
            category,
            locationName: selectedGeoLocation.name,
          },
        });
      }
    } catch (err) {
      toast.error("Failed to load nearby professionals");
    } finally {
      setSearchLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        let locationName = "Current Location";

        if (window.google?.maps?.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              if (status === "OK" && results?.[0]) {
                locationName = results[0].formatted_address;
              }

              setSelectedGeoLocation({
                lat: latitude,
                lng: longitude,
                name: locationName,
              });

              if (locationInputRef.current) {
                locationInputRef.current.value = locationName;
              }

              setGeoLoading(false);
            }
          );
        } else {
          setSelectedGeoLocation({
            lat: latitude,
            lng: longitude,
            name: locationName,
          });

          if (locationInputRef.current) {
            locationInputRef.current.value = locationName;
          }

          setGeoLoading(false);
        }
      },
      (error) => {
        console.error(error);
        toast.error("Unable to fetch location");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) return;

    if (window.google?.maps?.places) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setIsGoogleMapsLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isGoogleMapsLoaded || !locationInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      locationInputRef.current
    );

    autocomplete.setFields(["formatted_address", "geometry"]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      setSelectedGeoLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        name: place.formatted_address,
      });
    });
  }, [isGoogleMapsLoaded]);

  return (
    <>
      {isProfileDataExist && profileData.length === 0 ? (
        <SearchResult
          show
          onClose={() => {
            setIsProfileDataExist(false);
            setSelectedGeoLocation(null);
            if (locationInputRef.current) {
              locationInputRef.current.value = "";
            }
          }}
        />
      ) : profileData.length > 0 ? (
        <SkillsTrades />
      ) : (
        <div className="location-modal" onClick={handleClickOutside}>
          <div className="modal-box" ref={modalRef}>
            <div className="modal-top" onClick={onClose}>
              <HiOutlineArrowLongLeft className="icon-btn" size={25} />
              <CloseOutlined className="icon-btn" />
            </div>

            <h2 className="modal-title">Location for {jobTitle}</h2>
            <p className="modal-subtitle">
              Enter location or use current location
            </p>

            <div className="search-container">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Near"
                  className="search-input"
                  ref={locationInputRef}
                  onChange={(e) => {
                    if (!e.target.value) setSelectedGeoLocation(null);
                  }}
                />

                <button
                  className="geo-btn"
                  onClick={getCurrentLocation}
                  disabled={geoLoading}
                >
                  {geoLoading ? (
                    <Spin indicator={<LoadingOutlined spin />} size="small" />
                  ) : (
                    <img src={geo} alt="geo" className="geo" />
                  )}
                </button>
              </div>

              <button
                className="search-btn"
                disabled={!selectedGeoLocation || searchLoading}
                onClick={searchProfileList}
              >
                {searchLoading ? (
                  <Spin indicator={<LoadingOutlined spin />} size="small" />
                ) : (
                  <>
                    Search <HiOutlineArrowLongRight />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationModal;
