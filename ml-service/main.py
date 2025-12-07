"""
ML Service API for Portfolio Recommendations

FastAPI service that provides ML-powered career and skill recommendations
based on GitHub repository analysis.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from recommender import RecommenderSystem
import uvicorn

app = FastAPI(
    title="Portfolio ML Service",
    description="ML-powered recommendation engine for developer portfolios",
    version="2.0.0"
)

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Recommender System
recommender = RecommenderSystem()


# ==================== Request/Response Models ====================

class Repository(BaseModel):
    """Repository data from GitHub."""
    name: str
    description: Optional[str] = ""
    languages: Dict[str, float] = Field(default_factory=dict)
    topics: List[str] = Field(default_factory=list)
    stars: int = 0
    forks: int = 0


class UserProfile(BaseModel):
    """User profile with repository data."""
    user_id: str
    repos: List[Repository]


class CareerPath(BaseModel):
    """Career path recommendation."""
    title: str
    score: float
    confidence: float
    description: str
    matched_skills: List[str]
    salary_range: str
    demand: str


class SkillGap(BaseModel):
    """Skill gap analysis."""
    career: str
    missing_skills: List[str]
    nice_to_have: List[str]
    priority: str
    completion_percentage: int


class Technology(BaseModel):
    """Technology recommendation."""
    technology: str
    category: str
    difficulty: str
    learning_time: str
    job_relevance: str
    prerequisites_met: List[str]
    reason: str


class ProjectIdea(BaseModel):
    """Project recommendation."""
    title: str
    skills: List[str]
    difficulty: str
    description: str
    estimated_time: str
    learning_goals: List[str]
    skills_you_have: List[str]
    skills_to_learn: List[str]
    match_percentage: int
    reason: str


class LearningResource(BaseModel):
    """Learning resource recommendation."""
    title: str
    provider: str
    skills: List[str]
    difficulty: str
    duration: str
    url: str
    type: str
    relevant_skills: List[str]
    relevance_score: int


class SkillInfo(BaseModel):
    """Individual skill information."""
    skill: str
    proficiency: int
    repos_count: int
    category: str


class StrengthInfo(BaseModel):
    """Strength analysis."""
    skill: str
    score: float
    repos_count: int
    category: str


class WeaknessInfo(BaseModel):
    """Weakness/improvement area."""
    skill: str
    reason: str
    suggestion: str


class SkillAnalysis(BaseModel):
    """Complete skill analysis."""
    strengths: List[StrengthInfo]
    weaknesses: List[WeaknessInfo]
    skills: List[SkillInfo]


class RepoImprovement(BaseModel):
    """Repository improvement suggestion."""
    repo: str
    current_stars: int
    improvements: List[Dict[str, str]]


class ProfileStats(BaseModel):
    """Profile statistics."""
    language_diversity: int = 0
    topic_diversity: int = 0
    total_repos: int = 0
    total_stars: int = 0
    avg_languages_per_repo: float = 0.0


class RecommendationResponse(BaseModel):
    """Complete recommendation response."""
    career_paths: List[CareerPath]
    skill_gaps: List[SkillGap]
    project_ideas: List[ProjectIdea]
    technologies: List[Technology]
    learning_resources: List[LearningResource]
    skill_analysis: SkillAnalysis
    repo_improvements: List[RepoImprovement]
    profile_stats: ProfileStats


# ==================== API Endpoints ====================

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "ml-service",
        "version": "2.0.0"
    }


@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(profile: UserProfile):
    """
    Generate comprehensive recommendations based on user's GitHub profile.
    
    Analyzes repository data to provide:
    - Career path recommendations with confidence scores
    - Skill gap analysis
    - Technology learning recommendations
    - Project ideas
    - Learning resources
    - Strength/weakness analysis
    - Repository improvement suggestions
    """
    try:
        # Convert Pydantic models to dict
        profile_dict = {
            "user_id": profile.user_id,
            "repos": [repo.dict() for repo in profile.repos]
        }
        
        recommendations = recommender.generate_recommendations(profile_dict)
        
        # Ensure all fields have proper structure
        skill_analysis = recommendations.get("skill_analysis", {})
        if not isinstance(skill_analysis, dict):
            skill_analysis = {"strengths": [], "weaknesses": [], "skills": []}
        
        profile_stats = recommendations.get("profile_stats", {})
        if not isinstance(profile_stats, dict):
            profile_stats = {}
        
        return RecommendationResponse(
            career_paths=recommendations.get("career_paths", []),
            skill_gaps=recommendations.get("skill_gaps", []),
            project_ideas=recommendations.get("project_ideas", []),
            technologies=recommendations.get("technologies", []),
            learning_resources=recommendations.get("learning_resources", []),
            skill_analysis=SkillAnalysis(
                strengths=skill_analysis.get("strengths", []),
                weaknesses=skill_analysis.get("weaknesses", []),
                skills=skill_analysis.get("skills", [])
            ),
            repo_improvements=recommendations.get("repo_improvements", []),
            profile_stats=ProfileStats(**profile_stats) if profile_stats else ProfileStats()
        )
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze/skills")
async def analyze_skills(profile: UserProfile):
    """
    Analyze skills from user's repositories.
    
    Returns detailed skill breakdown with proficiency scores.
    """
    try:
        profile_dict = {
            "user_id": profile.user_id,
            "repos": [repo.dict() for repo in profile.repos]
        }
        
        recommendations = recommender.generate_recommendations(profile_dict)
        return {
            "skill_analysis": recommendations.get("skill_analysis", {}),
            "profile_stats": recommendations.get("profile_stats", {})
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze/careers")
async def analyze_careers(profile: UserProfile):
    """
    Get career path recommendations only.
    """
    try:
        profile_dict = {
            "user_id": profile.user_id,
            "repos": [repo.dict() for repo in profile.repos]
        }
        
        recommendations = recommender.generate_recommendations(profile_dict)
        return {
            "career_paths": recommendations.get("career_paths", []),
            "skill_gaps": recommendations.get("skill_gaps", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
