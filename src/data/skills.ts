import { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    icon: "Zap",
    skills: [
      { name: "React", proficiency: 95, icon: "React" },
      { name: "Next.js", proficiency: 95, icon: "Zap" },
      { name: "TypeScript", proficiency: 90, icon: "Code" },
      { name: "Tailwind CSS", proficiency: 90, icon: "Palette" },
      { name: "Framer Motion", proficiency: 85, icon: "Sparkles" },
      { name: "D3.js", proficiency: 80, icon: "BarChart3" },
    ],
  },
  {
    name: "Backend",
    icon: "Server",
    skills: [
      { name: "Node.js", proficiency: 95, icon: "Server" },
      { name: "Express", proficiency: 90, icon: "Code" },
      { name: "GraphQL", proficiency: 85, icon: "Network" },
      { name: "REST APIs", proficiency: 90, icon: "Zap" },
      { name: "tRPC", proficiency: 80, icon: "Code" },
      { name: "Web Sockets", proficiency: 85, icon: "Radio" },
    ],
  },
  {
    name: "Databases",
    icon: "Database",
    skills: [
      { name: "PostgreSQL", proficiency: 92, icon: "Database" },
      { name: "MongoDB", proficiency: 88, icon: "Database" },
      { name: "Redis", proficiency: 85, icon: "Zap" },
      { name: "Elasticsearch", proficiency: 80, icon: "Search" },
      { name: "Firebase", proficiency: 85, icon: "Flame" },
      { name: "DynamoDB", proficiency: 75, icon: "Cloud" },
    ],
  },
  {
    name: "DevOps & Infrastructure",
    icon: "Cloud",
    skills: [
      { name: "Docker", proficiency: 88, icon: "Box" },
      { name: "Kubernetes", proficiency: 80, icon: "Cloud" },
      { name: "AWS", proficiency: 85, icon: "Cloud" },
      { name: "CI/CD", proficiency: 85, icon: "GitBranch" },
      { name: "GitHub Actions", proficiency: 85, icon: "GitHub" },
      { name: "Terraform", proficiency: 80, icon: "Layers" },
    ],
  },
  {
    name: "AI & Machine Learning",
    icon: "Brain",
    skills: [
      { name: "LLMs (GPT, Claude)", proficiency: 85, icon: "Brain" },
      { name: "Prompt Engineering", proficiency: 88, icon: "Sparkles" },
      { name: "RAG Systems", proficiency: 80, icon: "Network" },
      { name: "Python", proficiency: 82, icon: "Code" },
      { name: "TensorFlow", proficiency: 75, icon: "Zap" },
      { name: "Fine-tuning", proficiency: 78, icon: "Settings" },
    ],
  },
  {
    name: "Tools & Platforms",
    icon: "Wrench",
    skills: [
      { name: "Git", proficiency: 95, icon: "GitBranch" },
      { name: "VS Code", proficiency: 95, icon: "Code" },
      { name: "Figma", proficiency: 80, icon: "Palette" },
      { name: "Vercel", proficiency: 90, icon: "Zap" },
      { name: "Sentry", proficiency: 85, icon: "AlertCircle" },
      { name: "DataDog", proficiency: 80, icon: "BarChart3" },
    ],
  },
];

export const allSkills = skillCategories.flatMap((cat) => cat.skills);

export const skillsRadarData = skillCategories.map((cat) => ({
  name: cat.name,
  value: Math.round(
    cat.skills.reduce((acc, skill) => acc + skill.proficiency, 0) / cat.skills.length
  ),
}));
