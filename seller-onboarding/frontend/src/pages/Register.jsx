import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../services/apiClient';
import { validateEmail, validatePassword, required, hasErrors } from '../utils/validators';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    const found = {
      fullName: required(values.fullName, 'Full name'),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirm: values.confirm !== values.password ? 'Passwords do not match' : required(values.confirm, 'Confirm password'),
    };
    setErrors(found);
    if (hasErrors(found)) return;
    setLoading(true);
    setSubmitError('');
    try {
      await register({ fullName: values.fullName.trim(), email: values.email.trim(), password: values.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Create your seller account</h1>
      <p className="mt-2 text-ink-500">It takes about 10 minutes to apply. You can save and come back any time.</p>
      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
        <Alert tone="error">{submitError}</Alert>
        <InputField label="Full name" name="fullName" value={values.fullName} onChange={onChange} error={errors.fullName} autoComplete="name" />
        <InputField label="Email" name="email" type="email" value={values.email} onChange={onChange} error={errors.email} autoComplete="email" placeholder="you@example.com" />
        <InputField label="Password" name="password" type="password" value={values.password} onChange={onChange} error={errors.password} hint="At least 8 characters with a letter and a number." autoComplete="new-password" />
        <InputField label="Confirm password" name="confirm" type="password" value={values.confirm} onChange={onChange} error={errors.confirm} autoComplete="new-password" />
        <Button type="submit" size="lg" loading={loading} className="w-full">Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-500">Already registered? <Link to="/login" className="font-semibold text-brand-700 hover:underline">Log in</Link></p>
    </div>
  );
}
