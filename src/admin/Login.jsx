import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = signIn(email, password);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-xl border border-line bg-card p-7">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo">
            <Icon name="shield" size={20} color="#fff" />
          </div>
          <p className="text-[16px] font-bold text-ink">iPermit SC</p>
          <p className="mt-0.5 text-[12px] text-muted">San Carlos City CHO — Admin Sign In</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center rounded-lg bg-red-bg px-3 py-2.5">
            <Icon name="close" size={14} color="#E11D48" />
            <span className="ml-2 text-[12px] font-medium text-red">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sancarloscho.gov.ph"
              className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
              required
            />
          </div>
          <div className="mb-5">
            <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-muted">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-line px-3 py-2.5 text-[13px] text-ink focus:outline-none focus:ring-1 focus:ring-indigo"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo py-2.5 text-[13px] font-semibold text-white"
          >
            Sign In
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-muted">
          Demo credentials — admin@sancarloscho.gov.ph / admin123
        </p>
      </div>
    </div>
  );
}
