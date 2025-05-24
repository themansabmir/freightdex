// src/pages/SignIn.tsx
import { Button, TextField, Typography } from '@shared/components';
import { Stack } from '@shared/components/Stack';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { z } from 'zod';
import { useAuthApi } from '../hooks/useAuthApi';

const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

const SignIn = () => {
  const { handleChange, validate, values, errors } = useFormValidation(loginSchema, { email: '', password: '' });
  const { login, isLoading } = useAuthApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      login(values);
    }
  };
  const disableLoginButton = !values.email || !values.password;

  return (
    <div className="signin-container">
      <div className="left">
        <img src="./login.jpg" alt="Dashboard" />
        <div className="overlay" />
      </div>
      <div className="right">
        <form className="signin-form" onSubmit={handleSubmit}>
          <Typography variant="display-lg" weight="bold" addClass="mb-3">
            GCCI-FreigthDex ADMIN Portal
          </Typography>
          <Typography addClass="mb-3" variant="sm" weight="regular">
            Please login to your account
          </Typography>

          <Stack direction="vertical">
            <TextField
              label="Email"
              placeholder="youremail@gcci.com"
              name="email"
              type="email"
              className="mb-8"
              value={values.email}
              onChange={handleChange}
              isError={!!errors.email}
              errorText={errors.email}
            />

            <TextField
              label="Password"
              placeholder="password"
              name="password"
              type="password"
              className="mb-8"
              value={values.password}
              onChange={handleChange}
              isError={!!errors.password}
              errorText={errors.password}
            />

            <Button addClass="px-12" disabled={disableLoginButton} isLoading={isLoading}>
              Log In
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
