import React, { useState, useEffect, useContext } from "react";
import { Table, Avatar } from "antd";
import axios from "axios";
import "./UserTable.css";
import { AuthContext } from "../../contexts/AuthContext";
import { get_user_by_country } from "../../api";

const AFRICAN_COUNTRIES = [
  { name: "Algeria",                  code: "dz" },
  { name: "Angola",                   code: "ao" },
  { name: "Benin",                    code: "bj" },
  { name: "Botswana",                 code: "bw" },
  { name: "Burkina Faso",             code: "bf" },
  { name: "Burundi",                  code: "bi" },
  { name: "Cabo Verde",               code: "cv" },
  { name: "Cameroon",                 code: "cm" },
  { name: "Central African Republic", code: "cf" },
  { name: "Chad",                     code: "td" },
  { name: "Comoros",                  code: "km" },
  { name: "Congo",                    code: "cg" },
  { name: "DR Congo",                 code: "cd" },
  { name: "Djibouti",                 code: "dj" },
  { name: "Egypt",                    code: "eg" },
  { name: "Equatorial Guinea",        code: "gq" },
  { name: "Eritrea",                  code: "er" },
  { name: "Eswatini",                 code: "sz" },
  { name: "Ethiopia",                 code: "et" },
  { name: "Gabon",                    code: "ga" },
  { name: "Gambia",                   code: "gm" },
  { name: "Ghana",                    code: "gh" },
  { name: "Guinea",                   code: "gn" },
  { name: "Guinea-Bissau",            code: "gw" },
  { name: "Ivory Coast",              code: "ci" },
  { name: "Kenya",                    code: "ke" },
  { name: "Lesotho",                  code: "ls" },
  { name: "Liberia",                  code: "lr" },
  { name: "Libya",                    code: "ly" },
  { name: "Madagascar",               code: "mg" },
  { name: "Malawi",                   code: "mw" },
  { name: "Mali",                     code: "ml" },
  { name: "Mauritania",               code: "mr" },
  { name: "Mauritius",                code: "mu" },
  { name: "Morocco",                  code: "ma" },
  { name: "Mozambique",               code: "mz" },
  { name: "Namibia",                  code: "na" },
  { name: "Niger",                    code: "ne" },
  { name: "Nigeria",                  code: "ng" },
  { name: "Rwanda",                   code: "rw" },
  { name: "Sao Tome and Principe",    code: "st" },
  { name: "Senegal",                  code: "sn" },
  { name: "Seychelles",               code: "sc" },
  { name: "Sierra Leone",             code: "sl" },
  { name: "Somalia",                  code: "so" },
  { name: "South Africa",             code: "za" },
  { name: "South Sudan",              code: "ss" },
  { name: "Sudan",                    code: "sd" },
  { name: "Tanzania",                 code: "tz" },
  { name: "Togo",                     code: "tg" },
  { name: "Tunisia",                  code: "tn" },
  { name: "Uganda",                   code: "ug" },
  { name: "Zambia",                   code: "zm" },
  { name: "Zimbabwe",                 code: "zw" },
];

const UserTable = () => {
  const { token } = useContext(AuthContext);
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsersByCountry = async () => {
      try {
        setLoading(true);
        const res = await axios.get(get_user_by_country, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.status) {
          const apiData = res.data.data || [];
          const formatted = AFRICAN_COUNTRIES
          .map((country) => {
            const match = apiData.find(
              (item) => item.country?.toLowerCase() === country.name.toLowerCase()
            );
            return {
              key: country.code,
              flag: `https://flagcdn.com/w40/${country.code}.png`,
              country: country.name,
              users: match ? match.totalUsers : 0,  // ✅ totalUsers field
            };
          })
          .filter((item) => item.users > 0);

          setCountryData(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch users by country", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUsersByCountry();
  }, [token]);

  const columns = [
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (_, record) => (
        <div className="country-cell">
          <Avatar src={record.flag} size={28} shape="circle" />
          <span>{record.country}</span>
        </div>
      ),
    },
    {
      title: "Number Of Users",
      dataIndex: "users",
      key: "users",
      render: (text) => <span className="user-count">{text}</span>,
    },
  ];

  return (
    <div className="user-table-card">
      <div className="user-table-header">
        <h3 className="user-table-title">User By All Countries</h3>
      </div>
      <Table
        columns={columns}
        dataSource={countryData}
        loading={loading}
        pagination={false}
        className="custom-table"
        locale={{ emptyText: "No users found in any country yet" }}
      />
    </div>
  );
};

export default UserTable;