import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface Recommendation {
    skill: string;
    reason: string;
    confidence: number;
}

export function RecommendationsPanel() {
    const { data: recommendations, isLoading } = useQuery<Recommendation[]>({
        queryKey: ['recommendations'],
        queryFn: async () => {
            const { data } = await api.get('/api/v1/recommendations');
            return data;
        },
    });

    if (isLoading) {
        return <div className="animate-pulse h-48 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>;
    }

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-300" />
                <h3 className="font-bold text-lg">Next Steps</h3>
            </div>

            <p className="opacity-90 text-sm mb-4">
                Based on your profile, we recommend learning:
            </p>

            <div className="space-y-3">
                {recommendations?.map((rec) => (
                    <div key={rec.skill} className="bg-white/10 backdrop-blur-sm p-3 rounded-lg hover:bg-white/20 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-center">
                            <span className="font-bold">{rec.skill}</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs opacity-80 mt-1">{rec.reason}</p>
                    </div>
                ))}
                {recommendations?.length === 0 && (
                    <p className="text-sm opacity-80">No recommendations available yet.</p>
                )}
            </div>
        </div>
    );
}
