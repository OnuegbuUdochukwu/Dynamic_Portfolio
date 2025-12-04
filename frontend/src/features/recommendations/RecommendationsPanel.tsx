import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import {
    TrendingUp,
    AlertTriangle,
    Code,
    BookOpen,
    Zap,
    Target,
    ChevronRight,
    Star,
    Clock,
    Briefcase,
    Award,
    ExternalLink,
    Sparkles,
    BarChart3,
    GitBranch
} from 'lucide-react';
import type { RecommendationResponse } from '../../types';
import { useState } from 'react';

type TabType = 'careers' | 'skills' | 'projects' | 'learning';

export function RecommendationsPanel() {
    const [activeTab, setActiveTab] = useState<TabType>('careers');

    const { data, isLoading, error } = useQuery<RecommendationResponse>({
        queryKey: ['recommendations'],
        queryFn: async () => {
            const { data } = await api.get('/recommendations');
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="animate-pulse h-12 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl"></div>
                <div className="animate-pulse h-48 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                <div className="animate-pulse h-32 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 dark:text-red-400">Unable to load recommendations</p>
                <p className="text-sm text-red-500 mt-1">Please try syncing your GitHub data</p>
            </div>
        );
    }

    const tabs = [
        { id: 'careers' as TabType, label: 'Careers', icon: Briefcase, count: data.careerPaths?.length || 0 },
        { id: 'skills' as TabType, label: 'Skills', icon: BarChart3, count: data.skillAnalysis?.skills?.length || 0 },
        { id: 'projects' as TabType, label: 'Projects', icon: Code, count: data.projectIdeas?.length || 0 },
        { id: 'learning' as TabType, label: 'Learning', icon: BookOpen, count: data.learningResources?.length || 0 },
    ];

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        {tab.count > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id
                                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'careers' && <CareersTab data={data} />}
            {activeTab === 'skills' && <SkillsTab data={data} />}
            {activeTab === 'projects' && <ProjectsTab data={data} />}
            {activeTab === 'learning' && <LearningTab data={data} />}
        </div>
    );
}

// ============= Tab Components =============

function CareersTab({ data }: { data: RecommendationResponse }) {
    return (
        <div className="space-y-6">
            {/* Career Paths */}
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <h3 className="font-bold text-lg">Recommended Career Paths</h3>
                </div>
                <div className="space-y-3">
                    {data.careerPaths?.map((path, index) => (
                        <div key={path.title} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {index === 0 && <Award className="w-4 h-4 text-yellow-300" />}
                                    <span className="font-bold">{path.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                                        Match: {Math.round(path.score * 100)}%
                                    </span>
                                    {path.confidence > 0.5 && (
                                        <span className="text-xs bg-green-400/30 text-green-100 px-2 py-1 rounded">
                                            High Confidence
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm opacity-90 mb-3">{path.description}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {path.matchedSkills?.slice(0, 5).map(skill => (
                                    <span key={skill} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs opacity-80">
                                <span className="flex items-center gap-1">
                                    <Briefcase className="w-3 h-3" />
                                    {path.salaryRange}
                                </span>
                                <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Demand: {path.demand}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skill Gaps */}
            {data.skillGaps && data.skillGaps.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4 text-amber-600 dark:text-amber-400">
                        <Target className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Skills to Develop</h3>
                    </div>
                    <div className="space-y-4">
                        {data.skillGaps.map((gap) => (
                            <div key={gap.career} className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        For <span className="text-amber-600 dark:text-amber-400">{gap.career}</span>
                                    </p>
                                    <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full">
                                        {gap.completionPercentage}% Complete
                                    </span>
                                </div>

                                {gap.missingSkills && gap.missingSkills.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Required:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {gap.missingSkills.map(skill => (
                                                <span key={skill} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded-full border border-red-200 dark:border-red-800">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {gap.niceToHave && gap.niceToHave.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Nice to have:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {gap.niceToHave.map(skill => (
                                                <span key={skill} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Technologies to Learn */}
            {data.technologies && data.technologies.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                        <Zap className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Technologies to Learn</h3>
                    </div>
                    <div className="grid gap-3">
                        {data.technologies.map((tech) => (
                            <div key={tech.technology} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                        {tech.technology.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{tech.technology}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {tech.category} · {tech.learningTime}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded ${tech.jobRelevance === 'Very High'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                        }`}>
                                        {tech.jobRelevance}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function SkillsTab({ data }: { data: RecommendationResponse }) {
    const { skillAnalysis, profileStats } = data;

    return (
        <div className="space-y-6">
            {/* Profile Stats */}
            {profileStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={GitBranch} label="Repositories" value={profileStats.totalRepos} />
                    <StatCard icon={Star} label="Total Stars" value={profileStats.totalStars} />
                    <StatCard icon={Code} label="Languages" value={profileStats.languageDiversity} />
                    <StatCard icon={Target} label="Topics" value={profileStats.topicDiversity} />
                </div>
            )}

            {/* Strengths */}
            {skillAnalysis?.strengths && skillAnalysis.strengths.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-yellow-300" />
                        <h3 className="font-bold text-lg">Your Strengths</h3>
                    </div>
                    <div className="grid gap-3">
                        {skillAnalysis.strengths.map((strength, index) => (
                            <div key={strength.skill} className="flex items-center justify-between bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-semibold">{strength.skill}</p>
                                        <p className="text-xs opacity-80">{strength.reposCount} repositories</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{Math.round(strength.score)}</p>
                                    <p className="text-xs opacity-80">score</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Skills */}
            {skillAnalysis?.skills && skillAnalysis.skills.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Skill Proficiency</h3>
                    <div className="space-y-3">
                        {skillAnalysis.skills.map((skill) => (
                            <div key={skill.skill} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{skill.skill}</span>
                                    <span className="text-xs text-gray-500">{skill.proficiency}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${skill.proficiency >= 70
                                                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                                                : skill.proficiency >= 40
                                                    ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                                                    : 'bg-gradient-to-r from-amber-400 to-amber-600'
                                            }`}
                                        style={{ width: `${skill.proficiency}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Areas for Improvement */}
            {skillAnalysis?.weaknesses && skillAnalysis.weaknesses.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Areas to Improve</h3>
                    </div>
                    <div className="space-y-3">
                        {skillAnalysis.weaknesses.map((weakness) => (
                            <div key={weakness.skill} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                <p className="font-medium text-gray-900 dark:text-white">{weakness.skill}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{weakness.reason}</p>
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                                    💡 {weakness.suggestion}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ProjectsTab({ data }: { data: RecommendationResponse }) {
    return (
        <div className="space-y-6">
            {/* Project Ideas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
                    <Code className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Recommended Projects</h3>
                </div>

                {data.projectIdeas && data.projectIdeas.length > 0 ? (
                    <div className="grid gap-4">
                        {data.projectIdeas.map((project) => (
                            <div key={project.title} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{project.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{project.description}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-xs px-2 py-0.5 rounded ${project.difficulty === 'Beginner'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : project.difficulty === 'Intermediate'
                                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                            }`}>
                                            {project.difficulty}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {project.estimatedTime}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {project.skillsYouHave?.map(s => (
                                        <span key={s} className="text-[10px] px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800">
                                            ✓ {s}
                                        </span>
                                    ))}
                                    {project.skillsToLearn?.map(s => (
                                        <span key={s} className="text-[10px] px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-800">
                                            + {s}
                                        </span>
                                    ))}
                                </div>

                                {project.learningGoals && project.learningGoals.length > 0 && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
                                        <p className="text-xs text-gray-500 mb-2">What you'll learn:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {project.learningGoals.map(goal => (
                                                <span key={goal} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                                                    {goal}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 italic">
                                        {project.reason}
                                    </p>
                                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">
                                        {project.matchPercentage}% match
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No project recommendations available yet.</p>
                )}
            </div>

            {/* Repo Improvements */}
            {data.repoImprovements && data.repoImprovements.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                        <GitBranch className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Repository Improvements</h3>
                    </div>
                    <div className="space-y-3">
                        {data.repoImprovements.map((repo) => (
                            <div key={repo.repo} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900 dark:text-white">{repo.repo}</span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Star className="w-3 h-3" /> {repo.currentStars}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {repo.improvements.map((imp, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm">
                                            <span className="text-blue-500">→</span>
                                            <div>
                                                <span className="text-gray-900 dark:text-white">{imp.suggestion}</span>
                                                <span className="text-xs text-gray-500 ml-2">({imp.impact})</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function LearningTab({ data }: { data: RecommendationResponse }) {
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4 text-purple-600 dark:text-purple-400">
                    <BookOpen className="w-5 h-5" />
                    <h3 className="font-bold text-lg">Recommended Learning Resources</h3>
                </div>

                {data.learningResources && data.learningResources.length > 0 ? (
                    <div className="grid gap-4">
                        {data.learningResources.map((resource) => (
                            <div key={resource.title} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                {resource.title}
                                            </h4>
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-purple-500" />
                                            </a>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {resource.provider}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-xs px-2 py-0.5 rounded ${resource.type === 'Certification'
                                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                                : resource.type === 'Specialization'
                                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                            }`}>
                                            {resource.type}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {resource.duration}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mt-3">
                                    {resource.relevantSkills?.map(skill => (
                                        <span key={skill} className="text-xs px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <span className={`text-xs ${resource.difficulty === 'Beginner'
                                            ? 'text-green-600 dark:text-green-400'
                                            : resource.difficulty === 'Intermediate'
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-purple-600 dark:text-purple-400'
                                        }`}>
                                        {resource.difficulty}
                                    </span>
                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                        Relevance: {resource.relevanceScore}/10
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500">No learning resources recommended yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Sync your GitHub data to get personalized recommendations.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============= Helper Components =============

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>, label: string, value: number }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                </div>
            </div>
        </div>
    );
}
