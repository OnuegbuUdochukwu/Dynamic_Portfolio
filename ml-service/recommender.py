"""
Enhanced ML Recommendation System for Portfolio Analysis

This module provides a comprehensive recommendation engine that analyzes
GitHub repository data to generate personalized career guidance, skill analysis,
technology recommendations, and learning resources.

Architecture:
- Feature Engineering: TF-IDF, skill weighting, complexity scoring
- Matching Algorithms: Cosine similarity, weighted skill overlap
- Knowledge Base: Career paths, technologies, learning resources
"""

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timezone
import re


class KnowledgeBase:
    """Static knowledge base containing career paths, technologies, and resources."""
    
    # Comprehensive career paths with detailed skill requirements
    CAREER_PATHS = {
        "Full Stack Developer": {
            "required_skills": ["JavaScript", "TypeScript", "React", "Node.js", "HTML", "CSS", "SQL", "Git"],
            "preferred_skills": ["Docker", "AWS", "GraphQL", "MongoDB", "Redis"],
            "description": "Builds both client-side and server-side software, handling the complete development stack.",
            "salary_range": "$80k - $150k",
            "demand": "High"
        },
        "Backend Engineer": {
            "required_skills": ["Java", "Python", "SQL", "REST APIs", "Git"],
            "preferred_skills": ["Spring Boot", "Docker", "Kubernetes", "PostgreSQL", "Redis", "RabbitMQ"],
            "description": "Focuses on server-side logic, databases, API design, and system architecture.",
            "salary_range": "$90k - $160k",
            "demand": "High"
        },
        "Frontend Developer": {
            "required_skills": ["JavaScript", "TypeScript", "React", "HTML", "CSS", "Git"],
            "preferred_skills": ["Vue", "Angular", "Tailwind CSS", "Webpack", "Testing"],
            "description": "Creates user interfaces with focus on user experience, accessibility, and performance.",
            "salary_range": "$75k - $140k",
            "demand": "High"
        },
        "Data Scientist": {
            "required_skills": ["Python", "Pandas", "NumPy", "Scikit-learn", "SQL", "Statistics"],
            "preferred_skills": ["TensorFlow", "PyTorch", "Jupyter", "R", "Tableau", "Spark"],
            "description": "Analyzes complex data to extract insights and build predictive ML models.",
            "salary_range": "$95k - $170k",
            "demand": "Very High"
        },
        "ML Engineer": {
            "required_skills": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Docker", "Git"],
            "preferred_skills": ["Kubernetes", "MLflow", "AWS SageMaker", "Spark", "SQL"],
            "description": "Designs and deploys machine learning systems in production environments.",
            "salary_range": "$110k - $200k",
            "demand": "Very High"
        },
        "DevOps Engineer": {
            "required_skills": ["Docker", "Kubernetes", "Linux", "CI/CD", "Git", "Bash"],
            "preferred_skills": ["AWS", "Terraform", "Ansible", "Prometheus", "Grafana", "Python"],
            "description": "Manages infrastructure, automation, and deployment pipelines.",
            "salary_range": "$100k - $175k",
            "demand": "High"
        },
        "Mobile Developer": {
            "required_skills": ["Swift", "Kotlin", "Git", "REST APIs"],
            "preferred_skills": ["React Native", "Flutter", "Firebase", "iOS", "Android"],
            "description": "Creates native and cross-platform mobile applications.",
            "salary_range": "$85k - $155k",
            "demand": "Medium-High"
        },
        "Security Engineer": {
            "required_skills": ["Python", "Linux", "Networking", "Security", "Git"],
            "preferred_skills": ["Penetration Testing", "OWASP", "Cryptography", "AWS Security", "SIEM"],
            "description": "Protects systems and data through security analysis and implementation.",
            "salary_range": "$100k - $180k",
            "demand": "Very High"
        },
        "Cloud Architect": {
            "required_skills": ["AWS", "Docker", "Kubernetes", "Terraform", "Networking"],
            "preferred_skills": ["Azure", "GCP", "Microservices", "Serverless", "Security"],
            "description": "Designs and implements scalable cloud infrastructure solutions.",
            "salary_range": "$130k - $220k",
            "demand": "Very High"
        },
        "Data Engineer": {
            "required_skills": ["Python", "SQL", "Spark", "ETL", "Git"],
            "preferred_skills": ["Airflow", "Kafka", "AWS", "Databricks", "dbt"],
            "description": "Builds and maintains data pipelines and infrastructure for analytics.",
            "salary_range": "$95k - $165k",
            "demand": "High"
        }
    }
    
    # Technology learning paths with prerequisites
    TECHNOLOGY_PATHS = {
        "React": {
            "category": "Frontend",
            "prerequisites": ["JavaScript", "HTML", "CSS"],
            "difficulty": "Intermediate",
            "learning_time": "2-3 months",
            "job_relevance": "Very High"
        },
        "TypeScript": {
            "category": "Language",
            "prerequisites": ["JavaScript"],
            "difficulty": "Intermediate",
            "learning_time": "1-2 months",
            "job_relevance": "Very High"
        },
        "Docker": {
            "category": "DevOps",
            "prerequisites": ["Linux basics", "CLI"],
            "difficulty": "Intermediate",
            "learning_time": "2-4 weeks",
            "job_relevance": "Very High"
        },
        "Kubernetes": {
            "category": "DevOps",
            "prerequisites": ["Docker", "Linux", "Networking"],
            "difficulty": "Advanced",
            "learning_time": "2-3 months",
            "job_relevance": "High"
        },
        "AWS": {
            "category": "Cloud",
            "prerequisites": ["Networking basics", "Linux"],
            "difficulty": "Intermediate-Advanced",
            "learning_time": "3-6 months",
            "job_relevance": "Very High"
        },
        "PostgreSQL": {
            "category": "Database",
            "prerequisites": ["SQL basics"],
            "difficulty": "Intermediate",
            "learning_time": "1-2 months",
            "job_relevance": "High"
        },
        "GraphQL": {
            "category": "API",
            "prerequisites": ["REST APIs", "JavaScript"],
            "difficulty": "Intermediate",
            "learning_time": "2-4 weeks",
            "job_relevance": "Medium-High"
        },
        "TensorFlow": {
            "category": "ML",
            "prerequisites": ["Python", "NumPy", "Math basics"],
            "difficulty": "Advanced",
            "learning_time": "3-6 months",
            "job_relevance": "High"
        },
        "Spring Boot": {
            "category": "Backend",
            "prerequisites": ["Java", "OOP"],
            "difficulty": "Intermediate",
            "learning_time": "2-3 months",
            "job_relevance": "High"
        },
        "Node.js": {
            "category": "Backend",
            "prerequisites": ["JavaScript"],
            "difficulty": "Intermediate",
            "learning_time": "1-2 months",
            "job_relevance": "Very High"
        }
    }
    
    # Learning resources database
    LEARNING_RESOURCES = [
        {
            "title": "The Complete Web Developer Bootcamp",
            "provider": "Udemy",
            "skills": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
            "difficulty": "Beginner",
            "duration": "50+ hours",
            "url": "https://udemy.com",
            "type": "Course"
        },
        {
            "title": "AWS Certified Solutions Architect",
            "provider": "AWS",
            "skills": ["AWS", "Cloud", "Networking"],
            "difficulty": "Intermediate",
            "duration": "40+ hours",
            "url": "https://aws.amazon.com/training",
            "type": "Certification"
        },
        {
            "title": "Machine Learning Specialization",
            "provider": "Coursera (Stanford)",
            "skills": ["Python", "TensorFlow", "ML", "NumPy"],
            "difficulty": "Intermediate",
            "duration": "3 months",
            "url": "https://coursera.org",
            "type": "Specialization"
        },
        {
            "title": "Docker & Kubernetes: The Practical Guide",
            "provider": "Udemy",
            "skills": ["Docker", "Kubernetes", "DevOps"],
            "difficulty": "Intermediate",
            "duration": "23 hours",
            "url": "https://udemy.com",
            "type": "Course"
        },
        {
            "title": "Java Programming Masterclass",
            "provider": "Udemy",
            "skills": ["Java", "OOP", "Spring Boot"],
            "difficulty": "Beginner-Intermediate",
            "duration": "80+ hours",
            "url": "https://udemy.com",
            "type": "Course"
        },
        {
            "title": "CS50: Introduction to Computer Science",
            "provider": "Harvard (edX)",
            "skills": ["C", "Python", "SQL", "Algorithms"],
            "difficulty": "Beginner",
            "duration": "12 weeks",
            "url": "https://cs50.harvard.edu",
            "type": "Course"
        },
        {
            "title": "Full Stack Open",
            "provider": "University of Helsinki",
            "skills": ["React", "Node.js", "MongoDB", "GraphQL", "TypeScript"],
            "difficulty": "Intermediate",
            "duration": "Self-paced",
            "url": "https://fullstackopen.com",
            "type": "Course"
        },
        {
            "title": "System Design Primer",
            "provider": "GitHub",
            "skills": ["System Design", "Distributed Systems", "Databases"],
            "difficulty": "Advanced",
            "duration": "Self-paced",
            "url": "https://github.com/donnemartin/system-design-primer",
            "type": "Resource"
        }
    ]
    
    # Project templates by difficulty
    PROJECT_TEMPLATES = [
        {
            "title": "Personal Portfolio Website",
            "skills": ["HTML", "CSS", "JavaScript"],
            "difficulty": "Beginner",
            "description": "Create a responsive portfolio showcasing your projects and skills.",
            "estimated_time": "1-2 weeks",
            "learning_goals": ["Responsive Design", "CSS Layouts", "DOM Manipulation"]
        },
        {
            "title": "REST API with Authentication",
            "skills": ["Node.js", "Express", "JWT", "MongoDB"],
            "difficulty": "Intermediate",
            "description": "Build a secure REST API with user authentication and CRUD operations.",
            "estimated_time": "2-3 weeks",
            "learning_goals": ["API Design", "Authentication", "Database Integration"]
        },
        {
            "title": "E-commerce Platform",
            "skills": ["React", "Node.js", "PostgreSQL", "Stripe"],
            "difficulty": "Advanced",
            "description": "Full-stack e-commerce with cart, payment processing, and order management.",
            "estimated_time": "4-6 weeks",
            "learning_goals": ["Full Stack Development", "Payment Integration", "State Management"]
        },
        {
            "title": "Real-time Chat Application",
            "skills": ["React", "Socket.io", "Node.js", "MongoDB"],
            "difficulty": "Intermediate",
            "description": "Build a real-time messaging app with rooms and private messages.",
            "estimated_time": "2-3 weeks",
            "learning_goals": ["WebSockets", "Real-time Communication", "State Sync"]
        },
        {
            "title": "ML Image Classifier",
            "skills": ["Python", "TensorFlow", "Keras", "NumPy"],
            "difficulty": "Intermediate",
            "description": "Train a CNN model to classify images with a web interface.",
            "estimated_time": "3-4 weeks",
            "learning_goals": ["Deep Learning", "Model Training", "Deployment"]
        },
        {
            "title": "DevOps Pipeline",
            "skills": ["Docker", "Kubernetes", "GitHub Actions", "AWS"],
            "difficulty": "Advanced",
            "description": "Set up a complete CI/CD pipeline with automated testing and deployment.",
            "estimated_time": "3-4 weeks",
            "learning_goals": ["CI/CD", "Container Orchestration", "Infrastructure as Code"]
        },
        {
            "title": "Task Management API (Spring Boot)",
            "skills": ["Java", "Spring Boot", "PostgreSQL", "JPA"],
            "difficulty": "Intermediate",
            "description": "RESTful task management API with authentication and role-based access.",
            "estimated_time": "2-3 weeks",
            "learning_goals": ["Spring Framework", "JPA/Hibernate", "Security"]
        },
        {
            "title": "Data Dashboard",
            "skills": ["Python", "Pandas", "Plotly", "Flask"],
            "difficulty": "Intermediate",
            "description": "Interactive dashboard visualizing data with filters and charts.",
            "estimated_time": "2-3 weeks",
            "learning_goals": ["Data Visualization", "Web Frameworks", "Data Processing"]
        }
    ]

    # Skill aliases for normalization
    SKILL_ALIASES = {
        "js": "JavaScript",
        "javascript": "JavaScript",
        "ts": "TypeScript",
        "typescript": "TypeScript",
        "py": "Python",
        "python": "Python",
        "rb": "Ruby",
        "ruby": "Ruby",
        "go": "Go",
        "golang": "Go",
        "rs": "Rust",
        "rust": "Rust",
        "java": "Java",
        "cpp": "C++",
        "c++": "C++",
        "csharp": "C#",
        "c#": "C#",
        "html": "HTML",
        "css": "CSS",
        "scss": "CSS",
        "sass": "CSS",
        "react": "React",
        "reactjs": "React",
        "vue": "Vue",
        "vuejs": "Vue",
        "angular": "Angular",
        "angularjs": "Angular",
        "node": "Node.js",
        "nodejs": "Node.js",
        "express": "Express",
        "expressjs": "Express",
        "django": "Django",
        "flask": "Flask",
        "spring": "Spring Boot",
        "springboot": "Spring Boot",
        "docker": "Docker",
        "kubernetes": "Kubernetes",
        "k8s": "Kubernetes",
        "aws": "AWS",
        "azure": "Azure",
        "gcp": "GCP",
        "postgresql": "PostgreSQL",
        "postgres": "PostgreSQL",
        "mysql": "MySQL",
        "mongodb": "MongoDB",
        "mongo": "MongoDB",
        "redis": "Redis",
        "graphql": "GraphQL",
        "tensorflow": "TensorFlow",
        "pytorch": "PyTorch",
        "pandas": "Pandas",
        "numpy": "NumPy",
        "scikit-learn": "Scikit-learn",
        "sklearn": "Scikit-learn",
        "git": "Git",
        "github": "Git",
        "machine-learning": "ML",
        "machinelearning": "ML",
        "deep-learning": "Deep Learning",
        "deeplearning": "Deep Learning",
        "api": "REST APIs",
        "rest": "REST APIs",
        "restapi": "REST APIs",
    }


class FeatureEngineering:
    """Feature engineering utilities for skill and project analysis."""
    
    def __init__(self):
        self.tfidf = TfidfVectorizer(
            stop_words='english',
            max_features=500,
            ngram_range=(1, 2)
        )
        self.knowledge = KnowledgeBase()
    
    def normalize_skill(self, skill: str) -> str:
        """Normalize skill names using aliases."""
        skill_lower = skill.lower().strip().replace(" ", "").replace("-", "")
        return self.knowledge.SKILL_ALIASES.get(skill_lower, skill.title())
    
    def extract_skills_from_repos(self, repos: List[Dict]) -> Dict[str, Dict[str, Any]]:
        """
        Extract and score skills from repository data.
        
        Returns dict with skill name -> {score, evidence, repos_count}
        """
        skills = {}
        
        for repo in repos:
            repo_name = repo.get('name', '')
            stars = repo.get('stars', 0)
            
            # Calculate recency weight (decay over time)
            recency_weight = 1.0  # Could be calculated from pushedAt
            
            # Process languages
            languages = repo.get('languages', {})
            for lang, size in languages.items():
                normalized = self.normalize_skill(lang)
                if normalized not in skills:
                    skills[normalized] = {
                        'score': 0.0,
                        'evidence': [],
                        'repos_count': 0,
                        'category': 'Language'
                    }
                
                # Weighted score: log(size) * star_boost * recency
                star_boost = 1.0 + np.log1p(stars) * 0.15
                score = np.log1p(size) * star_boost * recency_weight
                
                skills[normalized]['score'] += score
                skills[normalized]['repos_count'] += 1
                skills[normalized]['evidence'].append({
                    'repo': repo_name,
                    'bytes': size,
                    'stars': stars
                })
            
            # Process topics
            topics = repo.get('topics', [])
            for topic in topics:
                normalized = self.normalize_skill(topic)
                if normalized not in skills:
                    skills[normalized] = {
                        'score': 0.0,
                        'evidence': [],
                        'repos_count': 0,
                        'category': 'Technology/Framework'
                    }
                
                # Flat score for topics with star boost
                star_boost = 1.0 + np.log1p(stars) * 0.1
                skills[normalized]['score'] += 5.0 * star_boost
                skills[normalized]['repos_count'] += 1
                skills[normalized]['evidence'].append({
                    'repo': repo_name,
                    'from': 'topic',
                    'stars': stars
                })
        
        return skills
    
    def calculate_complexity_score(self, repos: List[Dict]) -> Dict[str, float]:
        """Calculate repository complexity indicators."""
        if not repos:
            return {'diversity': 0, 'depth': 0, 'activity': 0}
        
        all_languages = set()
        all_topics = set()
        total_stars = 0
        
        for repo in repos:
            all_languages.update(repo.get('languages', {}).keys())
            all_topics.update(repo.get('topics', []))
            total_stars += repo.get('stars', 0)
        
        return {
            'language_diversity': len(all_languages),
            'topic_diversity': len(all_topics),
            'total_repos': len(repos),
            'total_stars': total_stars,
            'avg_languages_per_repo': sum(len(r.get('languages', {})) for r in repos) / len(repos)
        }
    
    def extract_text_features(self, repos: List[Dict]) -> str:
        """Combine all text from repos for TF-IDF analysis."""
        texts = []
        for repo in repos:
            description = repo.get('description', '') or ''
            name = repo.get('name', '')
            topics = ' '.join(repo.get('topics', []))
            texts.append(f"{name} {description} {topics}")
        return ' '.join(texts)


class RecommenderSystem:
    """
    Advanced ML Recommendation System.
    
    Analyzes GitHub profile data to provide:
    - Career path recommendations with confidence scores
    - Skill gap analysis with priorities
    - Technology learning recommendations
    - Personalized project ideas
    - Learning resources
    - Strength/weakness analysis
    """
    
    def __init__(self):
        self.knowledge = KnowledgeBase()
        self.feature_eng = FeatureEngineering()
    
    def generate_recommendations(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate comprehensive recommendations from user profile.
        
        Args:
            user_profile: Dict with 'user_id' and 'repos' list
            
        Returns:
            Dict with career_paths, skill_gaps, project_ideas, 
            technologies, learning_resources, skill_analysis
        """
        repos = user_profile.get('repos', [])
        
        if not repos:
            return self._get_empty_recommendations()
        
        # Extract features
        user_skills = self.feature_eng.extract_skills_from_repos(repos)
        complexity = self.feature_eng.calculate_complexity_score(repos)
        
        # Generate recommendations
        career_paths = self._score_career_paths(user_skills)
        skill_gaps = self._analyze_skill_gaps(user_skills, career_paths)
        skill_analysis = self._analyze_strengths_weaknesses(user_skills)
        technologies = self._recommend_technologies(user_skills, career_paths)
        projects = self._recommend_projects(user_skills, skill_gaps)
        resources = self._recommend_resources(skill_gaps, career_paths)
        repo_improvements = self._suggest_repo_improvements(repos, user_skills)
        
        return {
            "career_paths": career_paths,
            "skill_gaps": skill_gaps,
            "project_ideas": projects,
            "technologies": technologies,
            "learning_resources": resources,
            "skill_analysis": skill_analysis,
            "repo_improvements": repo_improvements,
            "profile_stats": complexity
        }
    
    def _get_empty_recommendations(self) -> Dict[str, Any]:
        """Return empty recommendation structure."""
        return {
            "career_paths": [],
            "skill_gaps": [],
            "project_ideas": [],
            "technologies": [],
            "learning_resources": [],
            "skill_analysis": {"strengths": [], "weaknesses": [], "skills": []},
            "repo_improvements": [],
            "profile_stats": {}
        }
    
    def _score_career_paths(self, user_skills: Dict[str, Dict]) -> List[Dict]:
        """
        Score each career path based on skill overlap.
        
        Uses weighted Jaccard similarity with skill strength consideration.
        """
        user_skill_names = set(user_skills.keys())
        scored_paths = []
        
        for career, data in self.knowledge.CAREER_PATHS.items():
            required = set(data["required_skills"])
            preferred = set(data.get("preferred_skills", []))
            all_skills = required.union(preferred)
            
            # Calculate overlaps
            required_overlap = user_skill_names.intersection(required)
            preferred_overlap = user_skill_names.intersection(preferred)
            
            # Weighted scoring
            required_score = len(required_overlap) / len(required) if required else 0
            preferred_score = len(preferred_overlap) / len(preferred) if preferred else 0
            
            # Combined score (required skills weigh more)
            match_score = required_score * 0.7 + preferred_score * 0.3
            
            # Confidence based on coverage
            total_overlap = len(required_overlap) + len(preferred_overlap)
            confidence = min(1.0, total_overlap / (len(required) * 0.8))
            
            scored_paths.append({
                "title": career,
                "score": round(match_score, 2),
                "confidence": round(confidence, 2),
                "description": data["description"],
                "matched_skills": list(required_overlap.union(preferred_overlap)),
                "salary_range": data.get("salary_range", "N/A"),
                "demand": data.get("demand", "N/A")
            })
        
        # Sort by score and return top 3
        scored_paths.sort(key=lambda x: x['score'], reverse=True)
        return scored_paths[:3]
    
    def _analyze_skill_gaps(
        self, 
        user_skills: Dict[str, Dict], 
        career_paths: List[Dict]
    ) -> List[Dict]:
        """
        Identify skill gaps for recommended career paths.
        
        Prioritizes gaps by:
        1. Required vs preferred
        2. How common the skill is across career paths
        3. Learning difficulty
        """
        user_skill_names = set(user_skills.keys())
        gaps = []
        
        for career in career_paths[:2]:  # Top 2 careers
            career_data = self.knowledge.CAREER_PATHS.get(career['title'], {})
            required = set(career_data.get("required_skills", []))
            preferred = set(career_data.get("preferred_skills", []))
            
            missing_required = list(required - user_skill_names)
            missing_preferred = list(preferred - user_skill_names)
            
            if missing_required or missing_preferred:
                gaps.append({
                    "career": career['title'],
                    "missing_skills": missing_required[:4],  # Top 4 required
                    "nice_to_have": missing_preferred[:3],   # Top 3 preferred
                    "priority": "high" if missing_required else "medium",
                    "completion_percentage": round(career['score'] * 100)
                })
        
        return gaps
    
    def _analyze_strengths_weaknesses(
        self, 
        user_skills: Dict[str, Dict]
    ) -> Dict[str, Any]:
        """
        Analyze user's strengths and areas for improvement.
        """
        if not user_skills:
            return {"strengths": [], "weaknesses": [], "skills": []}
        
        # Sort skills by score
        sorted_skills = sorted(
            user_skills.items(),
            key=lambda x: x[1]['score'],
            reverse=True
        )
        
        # Top skills are strengths
        strengths = []
        for name, data in sorted_skills[:5]:
            strengths.append({
                "skill": name,
                "score": round(data['score'], 1),
                "repos_count": data['repos_count'],
                "category": data['category']
            })
        
        # Skills with low scores but some evidence = areas to improve
        weaknesses = []
        for name, data in sorted_skills:
            if data['repos_count'] == 1 and data['score'] < 10:
                weaknesses.append({
                    "skill": name,
                    "reason": "Limited exposure",
                    "suggestion": f"Build more projects with {name}"
                })
        
        # All skills for display
        all_skills = []
        max_score = max(d['score'] for _, d in sorted_skills) if sorted_skills else 1
        for name, data in sorted_skills:
            normalized_score = min(100, (data['score'] / max_score) * 100)
            all_skills.append({
                "skill": name,
                "proficiency": round(normalized_score),
                "repos_count": data['repos_count'],
                "category": data['category']
            })
        
        return {
            "strengths": strengths,
            "weaknesses": weaknesses[:3],
            "skills": all_skills[:15]  # Top 15 skills
        }
    
    def _recommend_technologies(
        self, 
        user_skills: Dict[str, Dict],
        career_paths: List[Dict]
    ) -> List[Dict]:
        """
        Recommend technologies to learn based on career goals.
        """
        user_skill_names = set(user_skills.keys())
        recommendations = []
        
        # Get skills needed for top careers
        target_skills = set()
        for career in career_paths[:2]:
            career_data = self.knowledge.CAREER_PATHS.get(career['title'], {})
            target_skills.update(career_data.get("required_skills", []))
            target_skills.update(career_data.get("preferred_skills", []))
        
        # Find technologies that match gaps
        for tech, data in self.knowledge.TECHNOLOGY_PATHS.items():
            # Check if user knows prerequisites
            prereqs = set(data.get("prerequisites", []))
            has_prereqs = prereqs.issubset(user_skill_names) or not prereqs
            
            # Check if tech is needed and not known
            if tech in target_skills and tech not in user_skill_names and has_prereqs:
                recommendations.append({
                    "technology": tech,
                    "category": data["category"],
                    "difficulty": data["difficulty"],
                    "learning_time": data["learning_time"],
                    "job_relevance": data["job_relevance"],
                    "prerequisites_met": list(prereqs.intersection(user_skill_names)),
                    "reason": f"Required for {career_paths[0]['title']}" if career_paths else ""
                })
        
        # Sort by job relevance and limit
        relevance_order = {"Very High": 4, "High": 3, "Medium-High": 2, "Medium": 1}
        recommendations.sort(
            key=lambda x: relevance_order.get(x['job_relevance'], 0),
            reverse=True
        )
        
        return recommendations[:5]
    
    def _recommend_projects(
        self, 
        user_skills: Dict[str, Dict],
        skill_gaps: List[Dict]
    ) -> List[Dict]:
        """
        Recommend projects based on current skills and gaps.
        """
        user_skill_names = set(user_skills.keys())
        recommendations = []
        
        # Get skills to learn from gaps
        skills_to_learn = set()
        for gap in skill_gaps:
            skills_to_learn.update(gap.get("missing_skills", []))
        
        for project in self.knowledge.PROJECT_TEMPLATES:
            project_skills = set(project["skills"])
            known = project_skills.intersection(user_skill_names)
            unknown = project_skills - user_skill_names
            
            # Score: have some skills, will learn others
            if len(known) > 0 and len(unknown) <= 2:
                match_ratio = len(known) / len(project_skills)
                
                # Prioritize if project teaches needed skills
                teaches_needed = unknown.intersection(skills_to_learn)
                priority = len(teaches_needed)
                
                if match_ratio >= 0.3:  # At least 30% skill overlap
                    reason = "Practice existing skills" if match_ratio > 0.8 else "Learn new skills"
                    if teaches_needed:
                        reason = f"Learn {', '.join(list(teaches_needed)[:2])}"
                    
                    recommendations.append({
                        **project,
                        "skills_you_have": list(known),
                        "skills_to_learn": list(unknown),
                        "match_percentage": round(match_ratio * 100),
                        "reason": reason,
                        "priority": priority
                    })
        
        # Sort by priority and match
        recommendations.sort(key=lambda x: (x['priority'], x['match_percentage']), reverse=True)
        return recommendations[:4]
    
    def _recommend_resources(
        self, 
        skill_gaps: List[Dict],
        career_paths: List[Dict]
    ) -> List[Dict]:
        """
        Recommend learning resources based on skill gaps.
        """
        # Collect skills to learn
        skills_to_learn = set()
        for gap in skill_gaps:
            skills_to_learn.update(gap.get("missing_skills", []))
            skills_to_learn.update(gap.get("nice_to_have", []))
        
        recommendations = []
        for resource in self.knowledge.LEARNING_RESOURCES:
            resource_skills = set(resource["skills"])
            overlap = skills_to_learn.intersection(resource_skills)
            
            if overlap:
                recommendations.append({
                    **resource,
                    "relevant_skills": list(overlap),
                    "relevance_score": len(overlap)
                })
        
        # Sort by relevance
        recommendations.sort(key=lambda x: x['relevance_score'], reverse=True)
        return recommendations[:4]
    
    def _suggest_repo_improvements(
        self, 
        repos: List[Dict],
        user_skills: Dict[str, Dict]
    ) -> List[Dict]:
        """
        Suggest improvements for existing repositories.
        """
        suggestions = []
        
        for repo in repos[:5]:  # Analyze top 5 repos
            repo_name = repo.get('name', '')
            description = repo.get('description', '')
            topics = repo.get('topics', [])
            languages = repo.get('languages', {})
            stars = repo.get('stars', 0)
            
            improvements = []
            
            # Check for missing description
            if not description or len(description) < 20:
                improvements.append({
                    "type": "documentation",
                    "suggestion": "Add a detailed description",
                    "impact": "Improves discoverability"
                })
            
            # Check for missing topics
            if len(topics) < 3:
                improvements.append({
                    "type": "topics",
                    "suggestion": "Add relevant topics/tags",
                    "impact": "Increases visibility"
                })
            
            # Suggest testing for larger projects
            if len(languages) > 2 and 'testing' not in [t.lower() for t in topics]:
                improvements.append({
                    "type": "quality",
                    "suggestion": "Add automated tests",
                    "impact": "Demonstrates code quality"
                })
            
            if improvements:
                suggestions.append({
                    "repo": repo_name,
                    "current_stars": stars,
                    "improvements": improvements[:2]  # Top 2 suggestions per repo
                })
        
        return suggestions[:3]
