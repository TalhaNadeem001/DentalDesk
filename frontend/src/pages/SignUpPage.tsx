import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import '../pages/HomePage.css';

export const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: 'var(--cream)' }}>
      {/* Left Side - Sign Up Form */}
      <div className="w-full lg:w-2/3 flex flex-col px-8 py-12" style={{ background: 'var(--cream)' }}>
        {/* Logo at top */}
        <div className="text-center mt-12 mb-8">
          <Link to="/" className="nav-logo" style={{ display: 'inline-flex', justifyContent: 'center' }}>
            <div className="nav-logo-mark">🦷</div>
            <span className="nav-logo-text">Dentique</span>
          </Link>
        </div>
        
        {/* Form centered vertically */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl space-y-8">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--forest)' }}>
                <UserPlus className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold" style={{ color: 'var(--charcoal)' }}>Create Account</h2>
              <p className="mt-3 text-base" style={{ color: 'var(--muted)' }}>Join Dentique today</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="px-4 py-3 rounded-lg flex items-center gap-2" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#dc2626' }}>
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstname" className="block text-base font-medium mb-3" style={{ color: 'var(--charcoal)' }}>
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-6 w-6" style={{ color: 'var(--muted)' }} />
                    </div>
                    <input
                      id="firstname"
                      name="firstname"
                      type="text"
                      required
                      value={formData.firstname}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 text-base rounded-lg transition"
                      style={{ border: '1px solid var(--cream-deeper)', background: 'white' }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--forest)'; e.target.style.outline = 'none'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--cream-deeper)'; }}
                      placeholder="John"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-base font-medium mb-3" style={{ color: 'var(--charcoal)' }}>
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-6 w-6" style={{ color: 'var(--muted)' }} />
                    </div>
                    <input
                      id="lastname"
                      name="lastname"
                      type="text"
                      required
                      value={formData.lastname}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 text-base rounded-lg transition"
                      style={{ border: '1px solid var(--cream-deeper)', background: 'white' }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--forest)'; e.target.style.outline = 'none'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--cream-deeper)'; }}
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-base font-medium mb-3" style={{ color: 'var(--charcoal)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-6 w-6" style={{ color: 'var(--muted)' }} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 text-base rounded-lg transition"
                    style={{ border: '1px solid var(--cream-deeper)', background: 'white' }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--forest)'; e.target.style.outline = 'none'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--cream-deeper)'; }}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-base font-medium mb-3" style={{ color: 'var(--charcoal)' }}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6" style={{ color: 'var(--muted)' }} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 text-base rounded-lg transition"
                    style={{ border: '1px solid var(--cream-deeper)', background: 'white' }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--forest)'; e.target.style.outline = 'none'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--cream-deeper)'; }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-base font-medium mb-3" style={{ color: 'var(--charcoal)' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6" style={{ color: 'var(--muted)' }} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 text-base rounded-lg transition"
                    style={{ border: '1px solid var(--cream-deeper)', background: 'white' }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--forest)'; e.target.style.outline = 'none'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--cream-deeper)'; }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  style={{ background: 'var(--forest)' }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--forest-mid)'; }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--forest)'; }}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>

              <div className="text-center">
                <p className="text-base" style={{ color: 'var(--muted)' }}>
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium" style={{ color: 'var(--forest)' }}>
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex w-full lg:w-1/3 h-screen overflow-hidden" style={{ background: 'var(--cream)' }}>
        <img
          src="/sampleimage.png"
          alt="Dentique"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
