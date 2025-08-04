// Import necessary libraries
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Don't forget to import the styles
import { TextField, Button, MenuItem, Typography, Box } from '@mui/material'; // Using Material-UI for components

const schema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phoneNumber: yup.string().nullable().test('is-phone-valid', 'Invalid phone number', (value) => {
      // You can add more robust phone validation here using libphonenumber-js if needed
      // For simplicity, we're just checking if a value exists when not required
      return !value || PhoneInput.isValidPhoneNumber(value);
    }),
  instagramUsername: yup.string(),
  companyName: yup.string(),
  businessRole: yup.string().oneOf(['Owner', 'CEO', 'Manager', 'Ambassador', 'Representative', ''], 'Invalid Business Role').nullable(),
});

function IntakeForm() {
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data); // Here you would send the data to your backend or handle it as needed
    alert(JSON.stringify(data, null, 2));
  };

  const businessRoles = ['Owner', 'CEO', 'Manager', 'Ambassador', 'Representative'];

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Intake Form
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name */}
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          )}
        />

        {/* Last Name */}
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              required
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        {/* Phone Number with Country Code */}
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body1" component="label" sx={{ display: 'block', mb: 1 }}>Phone Number</Typography>
              <PhoneInput
                {...field}
                placeholder="Enter phone number"
                value={value}
                onChange={onChange}
                defaultCountry="US" // Set a default country if you want
                international
                countryCallingCodeEditable={false} // Prevents users from manually editing the country code, enhancing validation
                error={!!errors.phoneNumber}
                // You might need custom styling for error messages with react-phone-number-input
              />
              {errors.phoneNumber && <Typography color="error" variant="caption">{errors.phoneNumber.message}</Typography>}
            </Box>
          )}
        />

        {/* Instagram Username */}
        <Controller
          name="instagramUsername"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Instagram Username"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="@username"
              error={!!errors.instagramUsername}
              helperText={errors.instagramUsername?.message}
            />
          )}
        />

        {/* Company Name */}
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Company Name"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.companyName}
              helperText={errors.companyName?.message}
            />
          )}
        />

        {/* Business Role */}
        <Controller
          name="businessRole"
          control={control}
          defaultValue="" // Important for select to handle "no selection" properly
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Business Role"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.businessRole}
              helperText={errors.businessRole?.message}
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          backgroundColor="#f46236"
          sx={{ mt: 3 }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default IntakeForm;
