export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  category: "SaaS" | "Web App" | "Ecommerce" | "AI" | "Experiment";
  stack: string[];
  role: string;
  metrics: {
    label: string;
    value: string;
  }[];
  demoUrl?: string;
  githubUrl?: string;
  features: string[];
  challenge: string;
  solution: string;
}

export interface Skill {
  name: string;
  proficiency: number;
  icon: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
  icon: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  responsibilities: string[];
  technologies: string[];
  type: "full-time" | "contract" | "freelance";
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: Date;
  tags: string[];
  image: string;
  readTime: number;
}

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
}
