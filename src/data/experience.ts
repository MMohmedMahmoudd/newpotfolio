import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "1",
    title: "Senior Full-Stack Engineer",
    company: "TechCorp Inc.",
    period: "2022 - Present",
    startDate: new Date("2022-01-15"),
    description:
      "Leading development of scalable SaaS platform serving 500+ enterprise clients",
    responsibilities: [
      "Architected microservices infrastructure handling 1M+ requests/day",
      "Led team of 5 engineers in building cloud infrastructure platform",
      "Reduced infrastructure costs by 40% through optimization",
      "Implemented real-time monitoring and alerting systems",
      "Mentored junior engineers and established best practices",
    ],
    technologies: [
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Kubernetes",
      "Redis",
      "GraphQL",
    ],
    type: "full-time",
  },
  {
    id: "2",
    title: "Full-Stack Engineer",
    company: "StartupXYZ",
    period: "2020 - 2021",
    startDate: new Date("2020-06-01"),
    endDate: new Date("2021-12-31"),
    description:
      "Built analytics platform from scratch, achieving product-market fit",
    responsibilities: [
      "Built full analytics platform with real-time dashboards",
      "Implemented data pipeline processing 100M+ events/day",
      "Designed and optimized database schemas for complex queries",
      "Created reusable component library reducing development time by 35%",
      "Established monitoring and logging infrastructure",
    ],
    technologies: [
      "React",
      "Express",
      "PostgreSQL",
      "D3.js",
      "AWS",
      "Elasticsearch",
    ],
    type: "full-time",
  },
  {
    id: "3",
    title: "Freelance Full-Stack Developer",
    company: "Self-Employed",
    period: "2018 - 2020",
    startDate: new Date("2018-03-01"),
    endDate: new Date("2020-05-31"),
    description:
      "Developed custom web applications and SaaS platforms for various clients",
    responsibilities: [
      "Delivered 15+ projects for startup and enterprise clients",
      "Architected scalable solutions for e-commerce and SaaS platforms",
      "Achieved 98% client satisfaction rating",
      "Managed project timelines and client communications",
      "Optimized applications resulting in 60% performance improvement",
    ],
    technologies: [
      "React",
      "Node.js",
      "MongoDB",
      "Next.js",
      "TypeScript",
      "AWS",
    ],
    type: "contract",
  },
  {
    id: "4",
    title: "Junior Full-Stack Developer",
    company: "WebAgency Pro",
    period: "2017 - 2018",
    startDate: new Date("2017-01-10"),
    endDate: new Date("2018-02-28"),
    description: "Built and maintained web applications for various clients",
    responsibilities: [
      "Developed responsive web applications using React and Node.js",
      "Fixed bugs and optimized existing codebases",
      "Participated in code reviews and team discussions",
      "Learned best practices from senior developers",
      "Contributed to 20+ client projects",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Express", "jQuery"],
    type: "full-time",
  },
];

export const timelineEvents = experiences.map((exp, index) => ({
  ...exp,
  index,
  color: ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500"][index % 4],
}));
