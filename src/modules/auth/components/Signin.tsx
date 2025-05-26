// src/pages/SignIn.tsx
import { Button, TextField, Typography } from '@shared/components';
import { Stack } from '@shared/components/Stack';
import { useFormValidation } from '@shared/hooks/useFormValidation';
import { z } from 'zod';
import { useAuthApi } from '../hooks/useAuthApi';
import DynamicForm from '@generator/form';
import { FieldSchema } from '@generator/form/index.types';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

const payload = { email: '', password: '' };
const formSchema: FieldSchema[] = [
  { type: 'text', required: true, label: 'Email', name: 'email', placeholder: 'Placeholder', colSpan:3 },
  { type: 'text', required: true, label: 'Password', name: 'password', placeholder: 'Password' ,colSpan:3},

];
const SignIn = () => {
  const { handleChange, validate, values, errors } = useFormValidation(loginSchema, payload);
  const { login, isLoading } = useAuthApi();
  const [formdata, setFormData] = useState<Partial<{ email: string; password: string }>>(payload);

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
            <DynamicForm schema={formSchema} data={formdata} setData={setFormData} errors={errors} isViewMode={false} onChange={handleChange} />

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
