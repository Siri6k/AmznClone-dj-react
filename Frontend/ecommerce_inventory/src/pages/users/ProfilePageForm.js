import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  LinearProgress,
  Container,
  Typography,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Button,
  IconButton,
} from "@mui/material";
import useApi from "../../hooks/APIHandler";
import ProfileCard from "./ProfileCard";
import { toast } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  getAnonId,
  getFormTypes,
  getUser,
  refreshToken,
} from "../../utils/Helper";
import {
  ArrowBackIos,
  ArrowForwardIos,
  Close,
  CloseFullscreenOutlined,
  CloseOutlined,
  Save,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducer/isLoggedInReducer";
import Title from "../../components/Title";

const ProfilePageForm = () => {
  const [tab, setTab] = useState(0);
  const { error, loading, callApi } = useApi();
  const [userData, setUserData] = useState(null); // Initialize as null instead of {}

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Fetch user data if editing (optional)
  useEffect(() => {
    getMyProfile();
  }, []);

  const getMyProfile = async () => {
    const result = await callApi({
      url: `auth/getMyProfile/`,
      method: "GET",
    });

    if (result?.data?.data) {
      toast.success(result.data.message);
      setUserData(result.data.data);
    }
  };

  const stepItems = getFormTypes();

  const [formConfig, setFormConfig] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm();
  const [steps, setSteps] = useState(stepItems);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    methods.reset();
    setSteps(stepItems);
    fetchForm();
  }, []);

  const fetchForm = async () => {
    const response = await callApi({
      url: `auth/updateMyProfile/`,
    });
    if (response?.data) {
      // Filter steps that have datas
      let configData = response.data;

      const newField = {
        name: "confirm-password",
        label: "Confirm Password",
        placeholder: "Confirm your password",
        default: "",
        required: true,
        type: "text",
      };

      const updatedTextFields = [];

      configData.data.text.forEach((field) => {
        updatedTextFields.push(field);
        if (field.name === "password") {
          updatedTextFields.push(newField); // Ajout juste après "password"
        }
      });

      configData.data.text = updatedTextFields;

      let fetcData = configData.data;
      let stepFilter = stepItems.filter(
        (step) =>
          fetcData[step.fieldType] && fetcData[step.fieldType].length > 0
      );
      setSteps(stepFilter);
      setFormConfig(configData);

      setCurrentStep(0);
    } else {
      toast.error("Error in Fetching Profile Form Data");
    }
  };

  const goToStep = (index) => {
    setCurrentStep(index);
  };

  const onSubmit = async (data) => {
    try {
      const isError = false;
      const currentStepFields = getCurrentStepFields();
      const errors = validateCurrentStepFields(currentStepFields);
      console.log(errors);
      if (errors.length > 0) {
        errors.forEach((error) => {
          methods.setError(error.name, {
            type: "manual",
            message: `${error.label} is Required`,
          });
          isError = true;
        });
      }

      if (isError) {
        toast.error("Please fill all required fields");
        return;
      }
      const response = await callApi({
        url: `auth/updateMyProfile/`,
        method: "POST",
        body: data,
      });
      setCurrentStep(0);
      methods.reset();
      setTab(0);
      refreshToken();
      navigate(`/dashboard`);
      window.location.reload();
      toast.success("Profile Updated Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const nextStep = () => {
    const currentStepFields = getCurrentStepFields();
    const errors = validateCurrentStepFields(currentStepFields);
    console.log(errors);

    if (errors.length > 0) {
      errors.forEach((error) => {
        methods.setError(error.name, {
          type: "manual",
          message: `${error.label} is Required`,
        });
      });
    } else {
      currentStepFields.forEach((field) => {
        methods.clearErrors(field.name);
      });
      setCurrentStep((prev) => prev + 1);
    }
  };

  const getCurrentStepFields = () => {
    const currentStepType = steps[currentStep]?.fieldType;
    return formConfig.data[currentStepType] || [];
  };

  const validateCurrentStepFields = (fields) => {
    return fields.filter(
      (field) => field.required && !methods.getValues()[field.name]
    );
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
        pageTitle="My Profile"
      />

      <Box sx={{ maxWidth: "600px", margin: "auto" }}>
        {tab === 0 && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mx: 2 }}>
            <IconButton
              onClick={() => {
                //navigate(-1);
                navigate(`/dashboard`);
                window.location.reload();
              }}
              color="error"
              className="hover-button"
              sx={{ mx: 2 }}
              size="small"
              aria-label="Close"
              variant="contained"
            >
              <span className="hover-content" color="error">
                ESC
              </span>{" "}
              <Close />
            </IconButton>
          </Box>
        )}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          justifyContent="space-between"
          centered
          sx={{ marginBottom: "20px" }}
        >
          <Tab label="Update My Profile" />
          <Tab label="My Profile" />
        </Tabs>

        {/* Profile Tab */}
        {tab === 1 && (
          <Box sx={{ maxWidth: "600px", margin: "auto" }}>
            {loading && <LinearProgress />}
            {userData && <ProfileCard profile={userData} />}
            {!loading && !userData && <div>No profile data available</div>}
          </Box>
        )}

        {/* Update Profile Tab */}
        {tab === 0 && (
          <Container mt={2}>
            <Stepper
              activeStep={currentStep}
              sx={{ overflow: "auto", mt: 2 }}
              alternativeLabel
            >
              {steps.map((step, index) => (
                <Step key={index} onClick={() => goToStep(index)}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Divider sx={{ marginBottom: "15px", marginTop: "15px" }} />
            <Typography variant="h6" gutterBottom>
              {steps[currentStep].label}
            </Typography>
            {/* Section for form */}
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                {formConfig && (
                  <>
                    {steps.map((step, index) => (
                      <Box
                        component={"div"}
                        sx={{
                          display: index === currentStep ? "block" : "none",
                        }}
                      >
                        {step.component && (
                          <step.component
                            formConfig={formConfig}
                            fieldType={step.fieldType}
                          />
                        )}
                      </Box>
                    ))}
                  </>
                )}
                {!formConfig && loading && <LinearProgress />}

                <Box mt={2} display={"flex"} justifyContent={"space-between"}>
                  {currentStep > 0 && (
                    <Button
                      variant="contained"
                      type="button"
                      color="primary"
                      onClick={() => goToStep(currentStep - 1)}
                    >
                      <ArrowBackIos
                        sx={{ fontSize: "18px", marginRight: "5px" }}
                      />
                      Back
                    </Button>
                  )}
                  {currentStep < steps.length - 1 && (
                    <Button
                      variant="contained"
                      type="button"
                      color="primary"
                      onClick={() => nextStep()}
                    >
                      Next
                      <ArrowForwardIos
                        sx={{ fontSize: "18px", marginLeft: "5px" }}
                      />
                    </Button>
                  )}
                  {
                    <Button
                      sx={{
                        display:
                          currentStep === steps.length - 1
                            ? "inline-flex"
                            : "none",
                      }}
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      <Save sx={{ fontSize: "18px", marginRight: "5px" }} />
                      Submit
                    </Button>
                  }
                </Box>
              </form>
            </FormProvider>
            {loading && (
              <LinearProgress
                style={{
                  width: "100%",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              />
            )}
          </Container>
        )}
      </Box>
    </>
  );
};

export default ProfilePageForm;
