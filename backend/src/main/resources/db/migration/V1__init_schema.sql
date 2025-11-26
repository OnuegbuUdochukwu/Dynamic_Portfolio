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

CREATE TABLE oauth2_authorized_client (
  client_registration_id varchar(100) NOT NULL,
  principal_name varchar(200) NOT NULL,
  access_token_type varchar(100) NOT NULL,
  access_token_value bytea NOT NULL,
  access_token_issued_at timestamp NOT NULL,
  access_token_expires_at timestamp NOT NULL,
  access_token_scopes varchar(1000) DEFAULT NULL,
  refresh_token_value bytea DEFAULT NULL,
  refresh_token_issued_at timestamp DEFAULT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (client_registration_id, principal_name)
);
