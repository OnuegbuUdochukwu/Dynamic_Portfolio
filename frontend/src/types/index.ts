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
