// Import necessary libraries
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

let theme = createTheme({
  // Theme customization goes here as usual, including tonalOffset and/or
  // contrastThreshold as the augmentColor() function relies on these
});
theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    salmon: theme.palette.augmentColor({
      color: {
        main: '#FF5733',
      },
      name: 'salmon',
    }),
  },
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
    <Box sx={{ maxWidth: 800 , mx: 'auto', p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name and Last Name on one line */}
        <Box sx={{ display: 'flex', gap: 2 }}>
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
        </Box>

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

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
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
                    defaultCountry="US"
                    international
                    countryCallingCodeEditable={false}
                    error={!!errors.phoneNumber}
                    style={{ width: '100%' }}
                  />
                  {errors.phoneNumber && <Typography color="error" variant="caption">{errors.phoneNumber.message}</Typography>}
                </Box>
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
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
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
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
          <Controller
            name="businessRole"
            control={control}
            defaultValue=""
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
          {/* Empty box to take up the other half */}
        </Box>

        <Typography variant="body2" sx={{ mb: 3, mt: 2, color: 'text.secondary' }}>
          By submitting this form, you agree to receive updates about St. Augustine Cocktail Fest. Your information will be handled in accordance with our <a href="https://staugustinecocktailfest.com/en_us/legal/data-use-statement/" target="_blank" rel="noopener noreferrer">Data Use Statement</a> and will only be used for purposes related to the festival.
        </Typography>

        <ThemeProvider theme={theme}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="salmon"
              sx={{ mt: 3 }}
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
