import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faUser, faLock, faArrowRight, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        setLoading(false);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0E1A] p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-mesh opacity-50"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-700/10 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="premium-card p-8 md:p-10 animate-slide-up">
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-500/30 animate-scale-in">
                            <FontAwesomeIcon icon={faTruck} className="text-2xl text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-zinc-400">Sign in to access your fleet dashboard</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-error-500/10 border border-error-500/30 text-error-400 p-4 rounded-xl mb-6 text-sm text-center font-medium animate-slide-down flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faShieldAlt} />
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="input-label">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-11"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="input-label">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                                    <FontAwesomeIcon icon={faLock} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-11"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-zinc-400 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="mr-2 rounded border-white/10 bg-[#1A1F2E] text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                                />
                                <span className="group-hover:text-white transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 text-base"
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner w-5 h-5"></div>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
                        <p className="text-xs text-zinc-500">
                            Secure access to <span className="text-primary-400 font-semibold">LogiFleet</span> Fleet Management System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
