import { cn } from '../../utils/cn';

interface SkillCardProps {
    name: string;
    score: number;
    category: string;
    className?: string;
}

export function SkillCard({ name, score, category, className }: SkillCardProps) {
    return (
        <div className={cn("bg-card rounded-xl shadow-sm border border-border p-5", className)}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-foreground">{name}</h3>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {category}
                    </span>
                </div>
                <div className="text-2xl font-bold text-primary">
                    {Math.round(score)}
                </div>
            </div>

            <div className="w-full bg-muted rounded-full h-2.5">
                <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(score, 100)}%` }}
                ></div>
            </div>
        </div>
    );
}
