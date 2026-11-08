import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage, USE_MOCK } from '../services/apiClient';
import { validateEmail, required, hasErrors } from '../utils/validators';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    const found = { email: validateEmail(values.email), password: required(values.password, 'Password') };
    setErrors(found);
    if (hasErrors(found)) return;
    setLoading(true);
    setSubmitError('');
    try {
      await login({ email: values.email.trim(), password: values.password });
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-ink-500">Log in to continue your seller application.</p>
      {location.state?.registered && <Alert tone="success" className="mt-6">Account created. Log in to get started.</Alert>}
      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
        <Alert tone="error">{submitError}</Alert>
        <InputField label="Email" name="email" type="email" value={values.email} onChange={onChange} error={errors.email} autoComplete="email" placeholder="you@example.com" />
        <InputField label="Password" name="password" type="password" value={values.password} onChange={onChange} error={errors.password} autoComplete="current-password" />
        <Button type="submit" size="lg" loading={loading} className="w-full">Log in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">New to SellerPath? <Link to="/register" className="font-semibold text-brand-700 hover:underline">Create an account</Link></p>
      {USE_MOCK && <p className="mt-8 rounded-xl bg-surface p-3 text-center text-xs text-ink-500">Demo mode: no server needed. Register a test account first, it is stored only in this browser.</p>}
    </div>
  );
}
