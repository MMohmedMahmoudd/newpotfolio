import HeroSection from "@/components/sections/hero";
import AboutSection from "@/components/sections/about";
import SkillsSection from "@/components/sections/skills";
import ProjectsSection from "@/components/sections/projects";
import ExperienceSection from "@/components/sections/experience";
import KnowledgeSection from "@/components/sections/knowledge";
import TestimonialsSection from "@/components/sections/testimonials";
import WritingSection from "@/components/sections/writing";
import ContactSection from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <KnowledgeSection />
      <TestimonialsSection />
      <WritingSection />
      <ContactSection />
    </>
  );
}
