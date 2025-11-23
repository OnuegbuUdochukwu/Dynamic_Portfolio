import { cn } from '../../utils/cn';

interface SkillCardProps {
    name: string;
    score: number;
    category: string;
    className?: string;
}

export function SkillCard({ name, score, category, className }: SkillCardProps) {
    return (
        <div className={cn("bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5", className)}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{name}</h3>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {category}
                    </span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(score)}
                </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(score, 100)}%` }}
                ></div>
            </div>
        </div>
    );
}
