import { useAuth } from '../features/auth/AuthProvider';
import { Github } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Developer Skill Platform
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Visualize your growth and discover what to learn next.
                    </p>
                </div>
                <button
                    onClick={login}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                    <Github className="w-5 h-5" />
                    Sign in with GitHub
                </button>
            </div>
        </div>
    );
}
