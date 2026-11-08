// Small, dependency-free validators. Each returns an error string or ''.
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || '').trim());

export const required = (v, label = 'This field') =>
  (v ?? '').toString().trim() ? '' : `${label} is required`;

export function validateEmail(v) {
  if (!v?.trim()) return 'Email is required';
  return isEmail(v) ? '' : 'Enter a valid email, like name@example.com';
}

export function validatePassword(v) {
  if (!v) return 'Password is required';
  if (v.length < 8) return 'Use at least 8 characters';
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Include at least one letter and one number';
  return '';
}

export function validatePhone(v) {
  if (!v?.trim()) return 'Phone number is required';
  const digits = v.replace(/[^\d]/g, '');
  return digits.length >= 10 && digits.length <= 13 ? '' : 'Enter a valid phone number';
}

export const hasErrors = (errors) => Object.values(errors).some(Boolean);
