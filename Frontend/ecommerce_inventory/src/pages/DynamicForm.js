// Desc: Dynamic form component that will be used to render forms dynamically

import { useNavigate, useParams } from "react-router-dom";
import useApi from "../hooks/APIHandler";
import { use, useEffect, useState } from "react";

import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import {
  ArrowBackIos,
  ArrowForwardIos,
  Close,
  Save,
} from "@mui/icons-material";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getFormTypes } from "../utils/Helper";

const DynamicForm = ({ formNameVar, idVar, onSaveEvent }) => {
  const stepItems = getFormTypes();
  let { formName, id } = useParams();
  if (formNameVar) {
    formName = formNameVar;
  }
  if (idVar) {
    id = idVar;
  }
  const { callApi, loading } = useApi();
  const [formConfig, setFormConfig] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm();
  const [steps, setSteps] = useState(stepItems);

  const navigate = useNavigate();

  useEffect(() => {
    methods.reset();
    setSteps(stepItems);
    fetchForm();
  }, [formName, formNameVar, idVar, id]);

  const fetchForm = async () => {
    const PID = id ? `${id}/` : "";

    const response = await callApi({
      url: `getForm/${formName}/${PID}`,
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
      toast.error("Error in Fetching Form Data");
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
        return;
      }
      const PID = id ? `${id}/` : "";
      const response = await callApi({
        url: `getForm/${formName}/${PID}`,
        method: "post",
        body: data,
      });
      toast.success(response.data.message);
      setCurrentStep(0);
      methods.reset();
      if (onSaveEvent) {
        onSaveEvent();
      } else {
        navigate(`/manage/${formName}`);
      }
      navigate(0);
    } catch (err) {
      console.log(err);
    }
  };

  const nextStep = () => {
    const currentStepFields = getCurrentStepFields();
    const errors = validateCurrentStepFields(currentStepFields);
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
      (fields) => fields.required && !methods.getValues()[fields.name]
    );
  };

  return (
    <Container>
      {!formNameVar && (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {id ? "EDIT" : "ADD"} {formName.toUpperCase()}
          </Typography>
          <IconButton
            onClick={() => {
              navigate(-1);
              navigate(`/form/${formName}`);
            }}
            color="primary"
            className="hover-button"
          >
            <span className="hover-content">Close</span> <Close />
          </IconButton>
        </Box>
      )}
      <Divider sx={{ marginBottom: "15px", marginTop: "15px" }} />
      <Stepper
        activeStep={currentStep}
        sx={{ overflow: "auto" }}
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
                  sx={{ display: index === currentStep ? "block" : "none" }}
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
                <ArrowBackIos sx={{ fontSize: "18px", marginRight: "5px" }} />
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
                <ArrowForwardIos sx={{ fontSize: "18px", marginLeft: "5px" }} />
              </Button>
            )}
            {
              <Button
                sx={{
                  display:
                    currentStep === steps.length - 1 ? "inline-flex" : "none",
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
  );
};

export default DynamicForm;
