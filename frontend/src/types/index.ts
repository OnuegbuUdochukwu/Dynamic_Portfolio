// Comprehensive types for the ML recommendation system

export interface User {
    id: string;
    username: string;
    avatarUrl: string;
    roles: string[];
}

export interface Skill {
    id: string;
    name: string;
    score: number;
    category: string;
}

// ============= Recommendation Types =============

export interface CareerPath {
    title: string;
    score: number;
    confidence: number;
    description: string;
    matchedSkills: string[];
    salaryRange: string;
    demand: string;
}

export interface SkillGap {
    career: string;
    missingSkills: string[];
    niceToHave: string[];
    priority: 'high' | 'medium' | 'low';
    completionPercentage: number;
}

export interface Technology {
    technology: string;
    category: string;
    difficulty: string;
    learningTime: string;
    jobRelevance: string;
    prerequisitesMet: string[];
    reason: string;
}

export interface ProjectIdea {
    title: string;
    skills: string[];
    difficulty: string;
    description: string;
    estimatedTime: string;
    learningGoals: string[];
    skillsYouHave: string[];
    skillsToLearn: string[];
    matchPercentage: number;
    reason: string;
}

export interface LearningResource {
    title: string;
    provider: string;
    skills: string[];
    difficulty: string;
    duration: string;
    url: string;
    type: 'Course' | 'Certification' | 'Specialization' | 'Resource';
    relevantSkills: string[];
    relevanceScore: number;
}

export interface SkillInfo {
    skill: string;
    proficiency: number;
    reposCount: number;
    category: string;
}

export interface Strength {
    skill: string;
    score: number;
    reposCount: number;
    category: string;
}

export interface Weakness {
    skill: string;
    reason: string;
    suggestion: string;
}

export interface SkillAnalysis {
    strengths: Strength[];
    weaknesses: Weakness[];
    skills: SkillInfo[];
}

export interface RepoImprovement {
    repo: string;
    currentStars: number;
    improvements: {
        type: string;
        suggestion: string;
        impact: string;
    }[];
}

export interface ProfileStats {
    languageDiversity: number;
    topicDiversity: number;
    totalRepos: number;
    totalStars: number;
    avgLanguagesPerRepo: number;
}

export interface RecommendationResponse {
    careerPaths: CareerPath[];
    skillGaps: SkillGap[];
    projectIdeas: ProjectIdea[];
    technologies: Technology[];
    learningResources: LearningResource[];
    skillAnalysis: SkillAnalysis;
    repoImprovements: RepoImprovement[];
    profileStats: ProfileStats;
}
