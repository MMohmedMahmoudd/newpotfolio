import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    title: "Rhythm",
    description: "Modern e-commerce storefront for a fashion & lifestyle brand",
    longDescription:
      "Rhythm is a fast, mobile-first e-commerce experience built for a fashion & lifestyle brand. The storefront focuses on smooth product discovery, frictionless cart and checkout, and a clean, content-rich product page that converts.",
    image: "/rhythm-website.jpeg",
    tags: ["E-commerce", "Storefront", "Next.js"],
    category: "Ecommerce",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "React",
      "Vercel",
    ],
    role: "Full-Stack Developer",
    metrics: [
      { label: "Page Speed", value: "<1.5s LCP" },
      { label: "Lighthouse", value: "95+" },
      { label: "Mobile Ready", value: "100%" },
      { label: "Checkout Steps", value: "3" },
    ],
    demoUrl: "https://rhythm-seven-beta.vercel.app",
    features: [
      "Product Catalog & Filtering",
      "Cart & Checkout Flow",
      "Responsive Mobile-first UI",
      "Optimized Product Pages",
      "SEO-friendly Routing",
      "Image Optimization",
    ],
    challenge:
      "Delivering a snappy, mobile-first storefront with rich product pages without sacrificing load speed",
    solution:
      "Used Next.js App Router with image optimization, route-level code splitting, and a Tailwind-driven design system tuned for Core Web Vitals",
  },
  {
    id: "2",
    title: "Rhythm Dashboard",
    description: "Admin dashboard to manage the Rhythm e-commerce store",
    longDescription:
      "Rhythm Dashboard is the admin companion to the Rhythm storefront. It gives the team full control over products, orders, inventory, and customers through a fast, data-dense interface designed for daily operations.",
    image: "/dashboard-rhythm.jpeg",
    tags: ["Dashboard", "Admin", "E-commerce"],
    category: "Web App",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "React",
      "Vercel",
    ],
    role: "Full-Stack Developer",
    metrics: [
      { label: "Modules", value: "6+" },
      { label: "Render Time", value: "<200ms" },
      { label: "Tables", value: "Sortable + Paged" },
      { label: "Auth", value: "Role-based" },
    ],
    demoUrl: "https://dashboard-rhythm-eta.vercel.app",
    features: [
      "Product Management",
      "Order Management",
      "Inventory Tracking",
      "Customer Overview",
      "Sales Analytics",
      "Role-based Access",
    ],
    challenge:
      "Building a data-dense admin UI that stays fast and usable as catalog and order volume grow",
    solution:
      "Implemented server-side pagination, optimistic UI updates, and a reusable table/component layer to keep interactions consistently snappy",
  },
  {
    id: "3",
    title: "EchoCart Commerce",
    description: "Next-generation e-commerce platform with AI recommendations",
    longDescription:
      "EchoCart is a modern e-commerce platform featuring AI-powered product recommendations, advanced search, and seamless checkout experience designed for high conversion.",
    image: "/projects/echocart.png",
    tags: ["E-commerce", "AI", "Performance"],
    category: "Ecommerce",
    stack: ["Next.js", "TypeScript", "Stripe", "MongoDB", "Elasticsearch", "Redis"],
    role: "Full-Stack Lead",
    metrics: [
      { label: "Conversion Rate", value: "4.2%" },
      { label: "Page Speed", value: "1.2s FCP" },
      { label: "Products", value: "500K+" },
      { label: "Daily Orders", value: "1.2K" },
    ],
    demoUrl: "https://demo.example.com",
    features: [
      "AI Product Recommendations",
      "Advanced Search",
      "Dynamic Pricing",
      "Inventory Management",
      "Order Tracking",
      "Payment Processing",
    ],
    challenge:
      "Delivering personalized recommendations at scale while maintaining sub-second response times",
    solution:
      "Built ML pipeline with real-time feature engineering and implemented multi-tier caching",
  },
  {
    id: "4",
    title: "MindFlow Productivity",
    description: "AI-powered task management and workflow automation",
    longDescription:
      "MindFlow is an intelligent productivity suite that uses AI to help teams organize work, automate repetitive tasks, and maintain focus on high-value activities.",
    image: "/projects/mindflow.png",
    tags: ["Productivity", "AI", "Collaboration"],
    category: "AI",
    stack: [
      "React",
      "Node.js",
      "MongoDB",
      "OpenAI API",
      "Socket.io",
      "Docker",
    ],
    role: "Full-Stack Engineer",
    metrics: [
      { label: "Time Saved/user", value: "5h/week" },
      { label: "Automation Rate", value: "78%" },
      { label: "Team Size", value: "200+" },
      { label: "Satisfaction", value: "4.8/5" },
    ],
    demoUrl: "https://demo.example.com",
    features: [
      "AI Task Prioritization",
      "Workflow Automation",
      "Team Collaboration",
      "Time Tracking",
      "Analytics",
      "Integration Hub",
    ],
    challenge:
      "Processing natural language inputs and generating accurate task automations across diverse workflows",
    solution:
      "Fine-tuned GPT models on workflow data and implemented rule-based validation system",
  },
];

export const filteredProjects = (category: string) => {
  if (category === "All") return projects;
  return projects.filter((p) => p.category === category);
};
