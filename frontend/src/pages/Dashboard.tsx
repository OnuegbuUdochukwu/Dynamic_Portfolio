import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../features/auth/AuthProvider';
import { api } from '../services/api';
import type { Skill } from '../types';
import { SkillCard } from '../features/dashboard/SkillCard';
import { SyncButton } from '../features/dashboard/SyncButton';
import { SkillsChart } from '../features/dashboard/SkillsChart';
import { RecommendationsPanel } from '../features/recommendations/RecommendationsPanel';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
    const { user, logout } = useAuth();

    const { data: skills, isLoading } = useQuery<Skill[]>({
        queryKey: ['skills'],
        queryFn: async () => {
            const { data } = await api.get('/users/me/skills');
            return data;
        },
    });

    if (isLoading) {
        return <div className="p-8 flex justify-center">Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Welcome back, {user?.username}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Here is your technical growth overview.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <SyncButton />
                        <button
                            onClick={logout}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Skills List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Skills</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {skills?.map((skill) => (
                                <SkillCard
                                    key={skill.id}
                                    name={skill.name}
                                    score={skill.score}
                                    category={skill.category}
                                />
                            ))}
                            {skills?.length === 0 && (
                                <div className="col-span-2 p-8 text-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                    <p className="text-gray-500">No skills found yet. Try syncing your GitHub data.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Charts & Stats */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics</h2>
                        <SkillsChart skills={skills || []} />

                        {/* Recommendations */}
                        <RecommendationsPanel />
                    </div>
                </div>
            </div>
        </div>
    );
}
