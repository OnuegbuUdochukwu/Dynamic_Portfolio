import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { SkillCard } from '../features/dashboard/SkillCard';
import { SkillsChart } from '../features/dashboard/SkillsChart';
import type { Skill } from '../types';

interface PublicProfile {
    username: string;
    avatarUrl: string;
    skills: Skill[];
}

export default function PublicPortfolio() {
    const { username } = useParams<{ username: string }>();

    const { data: profile, isLoading, error } = useQuery<PublicProfile>({
        queryKey: ['public-portfolio', username],
        queryFn: async () => {
            const { data } = await api.get(`/portfolio/${username}`);
            return data;
        },
        enabled: !!username,
        retry: false,
    });

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading portfolio...</div>;
    }

    if (error || !profile) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">User not found or private profile.</div>;
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-card rounded-xl p-8 shadow-sm text-center border border-border">
                    <img
                        src={profile.avatarUrl}
                        alt={profile.username}
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary/20"
                    />
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        {profile.username}
                    </h1>
                    <p className="text-muted-foreground">
                        Technical Portfolio & Skill Growth
                    </p>
                </div>

                {/* Charts */}
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <h2 className="text-xl font-bold mb-6 text-foreground">Top Skills</h2>
                    <SkillsChart skills={profile.skills} />
                </div>

                {/* Skills Grid */}
                <div>
                    <h2 className="text-xl font-bold mb-6 text-foreground">Detailed Breakdown</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.skills.map((skill) => (
                            <SkillCard
                                key={skill.id || skill.name}
                                name={skill.name}
                                score={skill.score}
                                category={skill.category}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
