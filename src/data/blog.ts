import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable Node.js Microservices: A Production-Ready Guide",
    excerpt:
      "Learn how to architect and deploy microservices at scale with Node.js, including service discovery, load balancing, and monitoring strategies.",
    content: `
# Building Scalable Node.js Microservices

Microservices architecture has become the standard for modern applications. In this guide, we'll explore production-ready patterns and practices.

## Key Principles

1. **Service Isolation**: Each service should be independently deployable
2. **API Design**: Use clear, versioned APIs
3. **Data Management**: Each service owns its data
4. **Monitoring**: Implement comprehensive observability

## Implementation Details

[Full article content would go here]
    `,
    author: "Your Name",
    date: new Date("2024-03-15"),
    tags: ["backend", "nodejs", "microservices", "architecture"],
    image: "/blog/microservices.jpg",
    readTime: 12,
  },
  {
    id: "2",
    title: "React Performance Optimization: Techniques That Actually Work",
    excerpt:
      "Deep dive into React performance optimization with practical examples, profiling techniques, and real-world case studies.",
    content: `
# React Performance Optimization

React applications can become slow without proper optimization. Let's explore techniques that actually make a difference.

## Common Bottlenecks

1. Unnecessary re-renders
2. Large bundle sizes
3. Inefficient data fetching
4. Heavy computations in render

[Full article content would go here]
    `,
    author: "Your Name",
    date: new Date("2024-03-08"),
    tags: ["frontend", "react", "performance", "optimization"],
    image: "/blog/react-performance.jpg",
    readTime: 15,
  },
  {
    id: "3",
    title: "System Design Interview Preparation: Pattern Recognition Guide",
    excerpt:
      "Master system design interviews by learning to recognize patterns, ask the right questions, and make architectural decisions.",
    content: `
# System Design Mastery

System design interviews test your ability to think holistically about complex problems.

## Key Patterns

1. **Cache Layer**: When and where to add caching
2. **Load Balancing**: Strategies and implementation
3. **Database Selection**: SQL vs NoSQL decision tree
4. **Message Queues**: Async processing patterns

[Full article content would go here]
    `,
    author: "Your Name",
    date: new Date("2024-02-28"),
    tags: ["system-design", "interviews", "architecture"],
    image: "/blog/system-design.jpg",
    readTime: 18,
  },
  {
    id: "4",
    title: "Next.js 15 Server Components: The Complete Transition Guide",
    excerpt:
      "Everything you need to know about migrating to Next.js 15 Server Components, including benefits, migration strategies, and best practices.",
    content: `
# Next.js 15 Server Components

Server Components represent a paradigm shift in how we build React applications.

## Benefits

1. **Security**: Sensitive data stays on server
2. **Performance**: Reduced JavaScript sent to client
3. **Simplicity**: Direct database access
4. **SEO**: Better control over content

[Full article content would go here]
    `,
    author: "Your Name",
    date: new Date("2024-02-15"),
    tags: ["nextjs", "react", "server-components", "frontend"],
    image: "/blog/nextjs-server.jpg",
    readTime: 14,
  },
];
