CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id BIGINT UNIQUE,
  username VARCHAR(255),
  email VARCHAR(255),
  avatar_url TEXT,
  encrypted_access_token TEXT,
  roles TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_sync TIMESTAMP WITH TIME ZONE
);

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  aliases JSONB,
  category VARCHAR(50)
);

CREATE TABLE repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  gh_repo_id BIGINT,
  full_name TEXT,
  description TEXT,
  primary_language VARCHAR(100),
  languages JSONB,
  topics JSONB,
  stars INT,
  forks INT,
  last_pushed_at TIMESTAMP WITH TIME ZONE,
  raw_payload JSONB
);

CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id),
  score DOUBLE PRECISION,
  evidence JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

CREATE INDEX idx_users_github_id ON users(github_id);
CREATE INDEX idx_repos_topics ON repositories USING GIN (topics);
CREATE INDEX idx_user_skills_user ON user_skills(user_id);
