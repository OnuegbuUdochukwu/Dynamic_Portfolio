import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Skill } from '../../types';

interface SkillsChartProps {
    skills: Skill[];
}

export function SkillsChart({ skills }: SkillsChartProps) {
    const data = skills.map(s => ({
        name: s.name,
        score: s.score,
    })).sort((a, b) => b.score - a.score).slice(0, 10); // Top 10

    return (
        <div className="h-[300px] w-full bg-card p-4 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-bold mb-4 text-foreground">Top Skills</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.2} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
                    />
                    <Bar dataKey="score" fill="#FF6B00" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
