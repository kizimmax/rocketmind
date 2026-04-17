"use client";

import type { PageBlock } from "@/lib/types";
import { HeroEditor } from "./hero-editor";
import { HeroImageEditor } from "./hero-image-editor";
import { AboutHeroEditor } from "./about-hero-editor";
import { HomeHeroEditor } from "./home-hero-editor";
import { MethodologyEditor } from "./methodology-editor";
import { HomeSectionsEditor } from "./home-sections-editor";
import { AboutEditor } from "./about-editor";
import { ProjectsEditor } from "./projects-editor";
import { AudienceEditor } from "./audience-editor";
import { ToolsEditor } from "./tools-editor";
import { ResultsEditor } from "./results-editor";
import { ProcessEditor } from "./process-editor";
import { ServicesEditor } from "./services-editor";
import { ExpertsEditor } from "./experts-editor";
import { PartnershipsEditor } from "./partnerships-editor";
import { LogoMarqueeEditor } from "./logo-marquee-editor";
import { AboutRocketmindEditor } from "./about-rocketmind-editor";
import { CaseCardEditor } from "./case-card-editor";
import { GenericEditor } from "./generic-editor";

interface BlockEditorProps {
  block: PageBlock;
  sectionId: string;
  pageSlug?: string;
  hasExperts: boolean;
  experts: Array<{ name: string; image: string | null }>;
  onUpdate: (data: Record<string, unknown>) => void;
}

const IMAGE_HERO_SECTIONS = new Set(["academy", "ai-products"]);

export function BlockEditor({ block, sectionId, pageSlug, hasExperts, experts, onUpdate }: BlockEditorProps) {
  switch (block.type) {
    case "hero":
      if (block.data.variant === "about") {
        const useHeading = sectionId === "unique" && pageSlug === "cases-index";
        return <AboutHeroEditor data={block.data} useHeading={useHeading} onUpdate={onUpdate} />;
      }
      return IMAGE_HERO_SECTIONS.has(sectionId) ? (
        <HeroImageEditor data={block.data} hasExperts={hasExperts} onUpdate={onUpdate} />
      ) : (
        <HeroEditor data={block.data} hasExperts={hasExperts} experts={experts} onUpdate={onUpdate} />
      );
    case "homeHero":
      return <HomeHeroEditor data={block.data} onUpdate={onUpdate} />;
    case "methodology":
      return <MethodologyEditor data={block.data} onUpdate={onUpdate} />;
    case "homeSections":
      return <HomeSectionsEditor data={block.data} onUpdate={onUpdate} />;
    case "about":
    case "customSection":
      return <AboutEditor data={block.data} onUpdate={onUpdate} />;
    case "projects":
      return <ProjectsEditor data={block.data} onUpdate={onUpdate} />;
    case "audience":
      return <AudienceEditor data={block.data} onUpdate={onUpdate} />;
    case "tools":
      return <ToolsEditor data={block.data} onUpdate={onUpdate} />;
    case "results":
      return <ResultsEditor data={block.data} onUpdate={onUpdate} />;
    case "process":
      return <ProcessEditor data={block.data} onUpdate={onUpdate} />;
    case "services":
      return <ServicesEditor data={block.data} onUpdate={onUpdate} />;
    case "experts":
      return <ExpertsEditor data={block.data} onUpdate={onUpdate} />;
    case "partnerships":
      return <PartnershipsEditor data={block.data} onUpdate={onUpdate} />;
    case "logoMarquee":
      return <LogoMarqueeEditor data={block.data} onUpdate={onUpdate} />;
    case "aboutRocketmind":
      return <AboutRocketmindEditor data={block.data} onUpdate={onUpdate} />;
    case "caseCard":
      return <CaseCardEditor data={block.data} onUpdate={onUpdate} />;
    default:
      return <GenericEditor block={block} />;
  }
}
