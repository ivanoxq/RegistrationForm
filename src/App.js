// Import necessary libraries
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
//import PhoneInput from 'react-phone-number-input';
import PhoneInput from "react-phone-input-2"; // Using react-phone-input-2 for better styling and usability
import "react-phone-input-2/lib/bootstrap.css"; // Import styles for react-phone-input-2
import { TextField, Button, MenuItem, Typography, Box } from "@mui/material"; // Using Material-UI for components
import { supabase } from "./supabaseClient";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { createClient } from "@supabase/supabase-js";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .nullable()
    .test("is-phone-valid", "Invalid phone number", (value) => {
      // You can add more robust phone validation here using libphonenumber-js if needed
      // For simplicity, we're just checking if a value exists when not required
      return value || isValidPhoneNumber(value);
    }),
  instagramUsername: yup.string(),
  companyName: yup.string(),
  businessRole: yup
    .string()
    .oneOf(
      ["Owner", "CEO", "Manager", "Ambassador", "Representative", ""],
      "Invalid Business Role"
    )
    .nullable(),
});

let theme = createTheme({
  // Theme customization goes here as usual, including tonalOffset and/or
  // contrastThreshold as the augmentColor() function relies on these
});
theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    salmon: theme.palette.augmentColor({
      color: {
        main: "#FF5733",
      },
      name: "salmon",
    }),
  },
});

function IntakeForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      instagramUsername: "",
      companyName: "",
      phoneNumber: "+1", // Default to US country code
    },
  });

  const { executeRecaptcha } = useGoogleReCaptcha();
  const [token, setToken] = useState("");
  const [wasUploaded, setWasUploaded] = useState(false);

  const supabase = createClient(
    "https://pxhtwlfvfjyzyzshwkye.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aHR3bGZ2Zmp5enl6c2h3a3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTgwMTcsImV4cCI6MjA2OTkzNDAxN30.M4PodTjuTs_iEu5WQxyijUYK57meRrPg7toCvBY6RuQ"
  );

  const verifyRecaptcha = async (recaptchaToken) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "recaptcha-verify",
        {
          body: { recaptchaToken },
        }
      );

      if (error) throw error;

      return data; // { verified: true/false, score?: number, errors?: string[] }
    } catch (error) {
      console.error("ReCAPTCHA verification failed:", error);
      return { verified: false };
    }
  };

  const handleInsert = async (formData) => {
    try {
      if (!executeRecaptcha) {
        console.log("reCAPTCHA not loaded yet!");
        return;
      }

      const recaptchaToken = await executeRecaptcha("intake_form"); // e.g., 'login', 'submit_form'
      setToken(recaptchaToken);

      // Optionally verify the token with your backend here before proceeding
      console.log("reCAPTCHA token:", recaptchaToken);

      const verificationResult = await verifyRecaptcha(recaptchaToken);

      if (verificationResult.verified) {
        const { data, error } = await supabase
          .from("siteregistration")
          .insert([
            {
              firstname: formData.firstName,
              lastname: formData.lastName,
              email: formData.email,
              phone: formData.phoneNumber,
              instagram: formData.instagramUsername,
              company: formData.companyName,
              businessrole: formData.businessRole,
            },
          ])
          .select(); // Returns the inserted record(s)

        if (error) {
          console.error("Error inserting data:", error);
          // Handle error, e.g., display an error message to the user
        } else {
          console.log("Data inserted successfully:", data);
          setWasUploaded(true); // Set state to indicate successful upload
          // Handle success, e.g., display a success message or redirect
        }
      } else {
        console.error("ReCAPTCHA verification failed. Submission blocked.");
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  // Apply register to all controls
  // For Controller components, pass {...register('fieldName')} along with field props
  // For TextField components not using Controller, use {...register('fieldName')}

  // Example usage in the form:
  // <TextField {...register('firstName')} ... />
  // <Controller name="firstName" control={control} render={({ field }) => (<TextField {...field} {...register('firstName')} ... />)} />

  const onSubmit = (data) => {
    //console.log(data); // Here you would send the data to your backend or handle it as needed
    //alert(JSON.stringify(data, null, 2));
    handleInsert(data); // Call the function to insert data into Supabase
    reset(); // Reset the form after submission
  };

  const businessRoles = [
    "Owner",
    "CEO",
    "Manager",
    "Ambassador",
    "Representative",
  ];

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 5,
        boxShadow: 3,
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 100,
                fontFamily: "Montserrat, Arial, sans-serif",
                mb: -2,
                color: "text.primary",
                fontSize: "0.95rem",
              }}
            >
              First Name
            </Typography>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...register("firstName")}
                  {...field}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  sx={{
                    "& .MuiInputBase-input": {
                      background: "#f5f5f574",
                      height: "1.3em", // Change input height
                      padding: "12px",
                    }
                  }}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 100,
                fontFamily: "Montserrat, Arial, sans-serif",
                mb: -2,
                color: "text.primary",
                fontSize: "0.95rem",
              }}
            >
              Last Name
            </Typography>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...register("lastName")}
                  {...field}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  sx={{
                    "& .MuiInputBase-input": {
                      background: "#f5f5f574",
                      height: "1.3em", // Change input height
                      padding: "12px",
                    }
                  }}
                />
              )}
            />
          </Box>
        </Box>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 100,
            fontFamily: "Montserrat, Arial, sans-serif",
            mb: -2,
            color: "text.primary",
            fontSize: "0.95rem",
          }}
        >
          Email
        </Typography>
        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...register("email")}
              {...field}
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              required
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                "& .MuiInputBase-input": {
                  background: "#f5f5f574",
                  height: "1.3em", // Change input height
                  padding: "12px",
                }
              }}
            />
          )}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Box sx={{ mt: 1.8, mb: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 100,
                      fontFamily: "Montserrat, Arial, sans-serif",
                      mb: 0.2,
                      color: "text.primary",
                      fontSize: "0.95rem",
                    }}
                  >
                    Phone Number
                  </Typography>
                  <PhoneInput
                    {...register("phoneNumber")}
                    {...field}
                    placeholder="Enter phone number"
                    value={value}
                    onChange={onChange}
                    country={"us"} // Default country
                    enableSearch={true}
                    international
                    countryCallingCodeEditable={false}
                    inputStyle={{
                      background: "#f5f5f574",
                      border: "1px solid black",
                      borderRadius: 4,
                      width: "100%",
                      height: "47px", // match MUI TextField height
                      fontSize: "1rem",
                    }}
                  />
                  {errors.phoneNumber && (
                    <Typography color="error" variant="caption">
                      {errors.phoneNumber.message}
                    </Typography>
                  )}
                </Box>
              )}
            />
          </Box>
          <Box sx={{ flex: 1, mt: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 100,
                fontFamily: "Montserrat, Arial, sans-serif",
                mb: -2,
                color: "text.primary",
                fontSize: "0.95rem",
              }}
            >
              Company Name
            </Typography>
            <Controller
              {...register("companyName")}
              name="companyName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message}
                  sx={{
                    "& .MuiInputBase-input": {
                      background: "#f5f5f574",
                      height: "1.3em", // Change input height
                      padding: "12px",
                    }
                  }}
                />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 100,
                fontFamily: "Montserrat, Arial, sans-serif",
                mb: -2,
                color: "text.primary",
                fontSize: "0.95rem",
              }}
            >
              Instagram Username
            </Typography>
            {/* Instagram Username */}
            <Controller
              name="instagramUsername"
              control={control}
              render={({ field }) => (
                <TextField
                  {...register("instagramUsername")}
                  {...field}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  placeholder="@username"
                  error={!!errors.instagramUsername}
                  helperText={errors.instagramUsername?.message}
                  sx={{
                    "& .MuiInputBase-input": {
                      background: "#f5f5f574",
                      height: "1.3em", // Change input height
                      padding: "12px",
                    }
                  }}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 100,
                fontFamily: "Montserrat, Arial, sans-serif",
                mb: -2,
                color: "text.primary",
                fontSize: "0.95rem",
              }}
            >
              Business Role
            </Typography>
            <Controller
              {...register("businessRole")}
              name="businessRole"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.businessRole}
                  helperText={errors.businessRole?.message}
                  sx={{
                    "& .MuiInputBase-input": {
                      border: "1px solid black",
                      background: "#f5f5f574",
                      height: "1.3em", // Change input height
                      padding: "10.5px",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select a role</em>
                  </MenuItem>
                  {businessRoles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{ mb: 3, mt: 2, color: "text.secondary" }}
        >
          By submitting this form, you agree to receive updates about St.
          Augustine Cocktail Fest. Your information will be handled in
          accordance with our{" "}
          <a
            href="https://staugustinecocktailfest.com/en_us/legal/disclaimers-policies-and-terms-of-use"
            target="_blank"
            rel="noopener noreferrer"
          >
            Data Use Statement
          </a>{" "}
          and will only be used for purposes related to the festival.
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, mt: 1, color: "red", fontWeight: "bold" }}>
          {wasUploaded
            ? "Thank you for your submission! We will be in touch soon."
            : ""}
        </Typography>

        <ThemeProvider theme={theme}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              color="salmon"
              sx={{
                mt: 3,
                px: 4, // wider button
                py: 1, // taller button
                fontWeight: 800, // fatter font
                fontSize: "0.95rem", // bigger font
                borderRadius: 2,
                textTransform: "none", // Allow both lowercase and uppercase
              }}
            >
              Submit
            </Button>
          </Box>
        </ThemeProvider>
      </form>
    </Box>
  );
}

export default IntakeForm;
