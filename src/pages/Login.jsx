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
        <div className="min-h-screen flex items-center justify-center bg-[#0B0E1A] p-4">

            <div className="w-full max-w-md">
                <div className="bg-[#1A1F2E] border border-zinc-800 rounded-xl p-6">

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-xl bg-primary-600/10 flex items-center justify-center mx-auto mb-5">
                            <FontAwesomeIcon icon={faTruck} className="text-2xl text-primary-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-zinc-400">Sign in to access your fleet dashboard</p>
                    </div>

                    {error && (
                        <div className="bg-error-500/10 border border-error-500/20 text-error-400 p-4 rounded-lg mb-6 text-sm text-center font-medium flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faShieldAlt} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#11141F] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors pl-11"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                                    <FontAwesomeIcon icon={faLock} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#11141F] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors pl-11"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-zinc-400 cursor-pointer hover:text-white transition-colors">
                                <input
                                    type="checkbox"
                                    className="mr-2 rounded border-zinc-700 bg-zinc-800 text-primary-600 focus:ring-primary-500"
                                />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-base px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/10 border-t-primary-500 rounded-full animate-spin"></div>
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

                    <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                        <p className="text-xs text-zinc-500">
                            Secure access to <span className="text-primary-400 font-medium">LogiFleet</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
