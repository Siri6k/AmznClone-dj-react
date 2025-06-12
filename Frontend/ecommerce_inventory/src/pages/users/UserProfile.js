import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, LinearProgress } from "@mui/material";
import useApi from "../../hooks/APIHandler";
import ProfileCard from "./ProfileCard";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../components/Title";

const UserProfile = () => {
  const { error, loading, callApi } = useApi();
  const [userData, setUserData] = useState(null); // Initialize as null instead of {}

  const { id } = useParams();
  const pid = id?.replace(/\D/g, ""); // \D = tout sauf un chiffre

  console.log(pid);

  // Fetch user data if editing (optional)
  useEffect(() => {
    getProfile();
  }, [pid]);

  const getProfile = async () => {
    const result = await callApi({
      url: `auth/getProfile/${pid}/`,
      method: "GET",
    });

    if (result?.data?.data) {
      toast.success(result.data.message);
      setUserData(result.data.data);
    }
  };

  return (
    <>
      <Title
        title={
          loading
            ? "Loading..."
            : `Niplan ${userData?.username || "My Profile"}'s Profile`
        }
        description="Manage your profile, update your information, and view your details."
        pageTitle={
          loading || !userData
            ? "User's Profile"
            : `${userData?.username}'s Profile`
        }
      />
      <Box component="div" sx={{ width: "100%" }}>
        <Box sx={{ maxWidth: "600px", margin: "auto" }}>
          {loading && <LinearProgress />}
          {userData && <ProfileCard profile={userData} />}
          {!loading && !userData && <div>No profile data available</div>}
        </Box>
      </Box>
    </>
  );
};

export default UserProfile;
