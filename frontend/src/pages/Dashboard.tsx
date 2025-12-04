import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../features/auth/AuthProvider';
import { api } from '../services/api';
import type { Skill } from '../types';
import { SkillCard } from '../features/dashboard/SkillCard';
import { SyncButton } from '../features/dashboard/SyncButton';
import { SkillsChart } from '../features/dashboard/SkillsChart';
import { RecommendationsPanel } from '../features/recommendations/RecommendationsPanel';
import { LogOut, RefreshCw, User, Sparkles } from 'lucide-react';
import { useState } from 'react';

type ViewMode = 'overview' | 'recommendations';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('recommendations');

    const { data: skills, isLoading } = useQuery<Skill[]>({
        queryKey: ['skills'],
        queryFn: async () => {
            const { data } = await api.get('/users/me/skills');
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Fixed Header */}
            <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            {user?.avatarUrl && (
                                <img
                                    src={user.avatarUrl}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full ring-2 ring-indigo-500/20"
                                />
                            )}
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Welcome, {user?.username}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Your personalized growth dashboard
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <SyncButton />
                            <button
                                onClick={logout}
                                className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => setViewMode('recommendations')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'recommendations'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            AI Recommendations
                        </button>
                        <button
                            onClick={() => setViewMode('overview')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'overview'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            <User className="w-4 h-4" />
                            Skills Overview
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {viewMode === 'recommendations' ? (
                    <div className="space-y-8">
                        {/* Full-width Recommendations */}
                        <RecommendationsPanel />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Skills List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Skills</h2>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {skills?.length || 0} skills detected
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {skills?.slice(0, 10).map((skill) => (
                                    <SkillCard
                                        key={skill.id}
                                        name={skill.name}
                                        score={skill.score}
                                        category={skill.category}
                                    />
                                ))}
                                {skills?.length === 0 && (
                                    <div className="col-span-2 p-8 text-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                        <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">No skills found yet.</p>
                                        <p className="text-sm text-gray-400 mt-1">Click "Sync GitHub" to analyze your repositories.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Charts */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics</h2>
                            <SkillsChart skills={skills || []} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
