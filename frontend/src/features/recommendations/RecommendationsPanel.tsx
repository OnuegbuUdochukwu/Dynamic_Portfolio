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
                <div className="animate-pulse h-12 bg-muted rounded-xl"></div>
                <div className="animate-pulse h-48 bg-muted rounded-xl"></div>
                <div className="animate-pulse h-32 bg-muted rounded-xl"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="text-destructive">Unable to load recommendations</p>
                <p className="text-sm text-destructive/80 mt-1">Please try syncing your GitHub data</p>
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
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-card text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        {tab.count > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted-foreground/10 text-muted-foreground'
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
            <div className="bg-gradient-to-br from-energy via-power to-sunshine rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-white" />
                    <h3 className="font-bold text-lg">Recommended Career Paths</h3>
                </div>
                <div className="space-y-3">
                    {data.careerPaths?.map((path, index) => (
                        <div key={path.title} className="bg-card text-card-foreground p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {index === 0 && <Award className="w-4 h-4 text-energy" />}
                                    <span className="font-bold">{path.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                                        Match: {Math.round(path.score * 100)}%
                                    </span>
                                    {path.confidence > 0.5 && (
                                        <span className="text-xs bg-energy/10 text-energy px-2 py-1 rounded">
                                            High Confidence
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{path.description}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {path.matchedSkills?.slice(0, 5).map(skill => (
                                    <span key={skill} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                    <div className="flex items-center gap-2 mb-4 text-energy">
                        <Target className="w-5 h-5" />
                        <h3 className="font-bold text-lg text-foreground">Skills to Develop</h3>
                    </div>
                    <div className="space-y-4">
                        {data.skillGaps.map((gap) => (
                            <div key={gap.career} className="p-4 bg-energy/5 rounded-lg border border-energy/10">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="font-medium text-foreground">
                                        For <span className="text-energy">{gap.career}</span>
                                    </p>
                                    <span className="text-xs bg-energy/10 text-energy px-2 py-1 rounded-full">
                                        {gap.completionPercentage}% Complete
                                    </span>
                                </div>

                                {gap.missingSkills && gap.missingSkills.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-xs text-muted-foreground mb-2">Required:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {gap.missingSkills.map(skill => (
                                                <span key={skill} className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-full border border-destructive/20">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {gap.niceToHave && gap.niceToHave.length > 0 && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-2">Nice to have:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {gap.niceToHave.map(skill => (
                                                <span key={skill} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
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
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <Zap className="w-5 h-5" />
                        <h3 className="font-bold text-lg text-foreground">Technologies to Learn</h3>
                    </div>
                    <div className="grid gap-3">
                        {data.technologies.map((tech) => (
                            <div key={tech.technology} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors border border-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                                        {tech.technology.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{tech.technology}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {tech.category} · {tech.learningTime}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded ${tech.jobRelevance === 'Very High'
                                        ? 'bg-energy/20 text-energy'
                                        : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {tech.jobRelevance}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
                <div className="bg-gradient-to-br from-energy to-power rounded-xl p-6 text-white">
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-sunshine" />
                        <h3 className="font-bold text-lg">Your Strengths</h3>
                    </div>
                    <div className="grid gap-3">
                        {skillAnalysis.strengths.map((strength, index) => (
                            <div key={strength.skill} className="flex items-center justify-between bg-card text-card-foreground p-3 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-semibold">{strength.skill}</p>
                                        <p className="text-xs text-muted-foreground">{strength.reposCount} repositories</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{Math.round(strength.score)}</p>
                                    <p className="text-xs text-muted-foreground">score</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Skills */}
            {skillAnalysis?.skills && skillAnalysis.skills.length > 0 && (
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                    <h3 className="font-bold text-lg mb-4 text-foreground">Skill Proficiency</h3>
                    <div className="space-y-3">
                        {skillAnalysis.skills.map((skill) => (
                            <div key={skill.skill} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                                    <span className="text-xs text-muted-foreground">{skill.proficiency}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${skill.proficiency >= 70
                                            ? 'bg-energy'
                                            : skill.proficiency >= 40
                                                ? 'bg-sunshine'
                                                : 'bg-power'
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
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                    <div className="flex items-center gap-2 mb-4 text-power">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="font-bold text-lg text-foreground">Areas to Improve</h3>
                    </div>
                    <div className="space-y-3">
                        {skillAnalysis.weaknesses.map((weakness) => (
                            <div key={weakness.skill} className="p-3 bg-power/5 rounded-lg border border-power/10">
                                <p className="font-medium text-foreground">{weakness.skill}</p>
                                <p className="text-sm text-muted-foreground mt-1">{weakness.reason}</p>
                                <p className="text-sm text-energy mt-2">
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
            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                <div className="flex items-center gap-2 mb-4 text-energy">
                    <Code className="w-5 h-5" />
                    <h3 className="font-bold text-lg text-foreground">Recommended Projects</h3>
                </div>

                {data.projectIdeas && data.projectIdeas.length > 0 ? (
                    <div className="grid gap-4">
                        {data.projectIdeas.map((project) => (
                            <div key={project.title} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-foreground">{project.title}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-xs px-2 py-0.5 rounded ${project.difficulty === 'Beginner'
                                            ? 'bg-energy/20 text-energy'
                                            : project.difficulty === 'Intermediate'
                                                ? 'bg-sunshine/20 text-sunshine-dark'
                                                : 'bg-power/20 text-power'
                                            }`}>
                                            {project.difficulty}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {project.estimatedTime}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {project.skillsYouHave?.map(s => (
                                        <span key={s} className="text-[10px] px-1.5 py-0.5 bg-energy/10 text-energy rounded border border-energy/20">
                                            ✓ {s}
                                        </span>
                                    ))}
                                    {project.skillsToLearn?.map(s => (
                                        <span key={s} className="text-[10px] px-1.5 py-0.5 bg-sunshine/20 text-sunshine-dark rounded border border-sunshine/20">
                                            + {s}
                                        </span>
                                    ))}
                                </div>

                                {project.learningGoals && project.learningGoals.length > 0 && (
                                    <div className="border-t border-border pt-3 mt-3">
                                        <p className="text-xs text-muted-foreground mb-2">What you'll learn:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {project.learningGoals.map(goal => (
                                                <span key={goal} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                                    {goal}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                                    <p className="text-xs text-energy italic">
                                        {project.reason}
                                    </p>
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                        {project.matchPercentage}% match
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No project recommendations available yet.</p>
                )}
            </div>

            {/* Repo Improvements */}
            {data.repoImprovements && data.repoImprovements.length > 0 && (
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <GitBranch className="w-5 h-5" />
                        <h3 className="font-bold text-lg text-foreground">Repository Improvements</h3>
                    </div>
                    <div className="space-y-3">
                        {data.repoImprovements.map((repo) => (
                            <div key={repo.repo} className="p-4 bg-muted rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-foreground">{repo.repo}</span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Star className="w-3 h-3" /> {repo.currentStars}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {repo.improvements.map((imp, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm">
                                            <span className="text-primary">→</span>
                                            <div>
                                                <span className="text-foreground">{imp.suggestion}</span>
                                                <span className="text-xs text-muted-foreground ml-2">({imp.impact})</span>
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
            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                <div className="flex items-center gap-2 mb-4 text-primary">
                    <BookOpen className="w-5 h-5" />
                    <h3 className="font-bold text-lg text-foreground">Recommended Learning Resources</h3>
                </div>

                {data.learningResources && data.learningResources.length > 0 ? (
                    <div className="grid gap-4">
                        {data.learningResources.map((resource) => (
                            <div key={resource.title} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                {resource.title}
                                            </h4>
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                            </a>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {resource.provider}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-xs px-2 py-0.5 rounded ${resource.type === 'Certification'
                                            ? 'bg-power/20 text-power'
                                            : resource.type === 'Specialization'
                                                ? 'bg-energy/20 text-energy'
                                                : 'bg-sunshine/20 text-sunshine-dark'
                                            }`}>
                                            {resource.type}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {resource.duration}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mt-3">
                                    {resource.relevantSkills?.map(skill => (
                                        <span key={skill} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                                    <span className={`text-xs ${resource.difficulty === 'Beginner'
                                        ? 'text-energy'
                                        : resource.difficulty === 'Intermediate'
                                            ? 'text-sunshine-dark'
                                            : 'text-power'
                                        }`}>
                                        {resource.difficulty}
                                    </span>
                                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                                        Relevance: {resource.relevanceScore}/10
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-muted-foreground">No learning resources recommended yet.</p>
                        <p className="text-sm text-muted-foreground/80 mt-1">Sync your GitHub data to get personalized recommendations.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============= Helper Components =============

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>, label: string, value: number }) {
    return (
        <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-foreground">{value || 0}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                </div>
            </div>
        </div>
    );
}
