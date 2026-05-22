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
import { ContactsEditor } from "./contacts-editor";
import { ToolsEditor } from "./tools-editor";
import { ResultsEditor } from "./results-editor";
import { ProcessEditor } from "./process-editor";
import { ServicesEditor } from "./services-editor";
import { ExpertsEditor } from "./experts-editor";
import { PartnershipsEditor } from "./partnerships-editor";
import { PartnershipsMiniEditor } from "./partnerships-mini-editor";
import { LogoMarqueeEditor } from "./logo-marquee-editor";
import { AboutRocketmindEditor } from "./about-rocketmind-editor";
import { CaseCardEditor } from "./case-card-editor";
import { PageBottomEditor } from "./page-bottom-editor";
import { GenericEditor } from "./generic-editor";

interface BlockEditorProps {
  block: PageBlock;
  sectionId: string;
  hasExperts: boolean;
  experts: Array<{ name: string; image: string | null }>;
  onUpdate: (data: Record<string, unknown>) => void;
  /** Данные блока partnershipsMini — прокидываются в HomeSectionsEditor, чтобы
   *  жёлтый блок «Программы с бизнес-школами» редактировался внутри секции академии. */
  partnerData?: Record<string, unknown>;
  onUpdatePartner?: (data: Record<string, unknown>) => void;
}

const IMAGE_HERO_SECTIONS = new Set(["academy", "ai-products"]);

export function BlockEditor({ block, sectionId, hasExperts, experts, onUpdate, partnerData, onUpdatePartner }: BlockEditorProps) {
  switch (block.type) {
    case "hero":
      if (block.data.variant === "about") {
        return <AboutHeroEditor data={block.data} experts={experts} onUpdate={onUpdate} />;
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
      return (
        <HomeSectionsEditor
          data={block.data}
          onUpdate={onUpdate}
          partnerData={partnerData}
          onUpdatePartner={onUpdatePartner}
        />
      );
    case "about":
    case "customSection":
      return <AboutEditor data={block.data} onUpdate={onUpdate} />;
    case "projects":
      return <ProjectsEditor data={block.data} onUpdate={onUpdate} />;
    case "audience":
      return <AudienceEditor data={block.data} onUpdate={onUpdate} />;
    case "contacts":
      return <ContactsEditor data={block.data} onUpdate={onUpdate} />;
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
    case "partnershipsMini":
      return <PartnershipsMiniEditor data={block.data} onUpdate={onUpdate} />;
    case "logoMarquee":
      return <LogoMarqueeEditor data={block.data} onUpdate={onUpdate} />;
    case "aboutRocketmind":
      return <AboutRocketmindEditor data={block.data} onUpdate={onUpdate} />;
    case "caseCard":
      return <CaseCardEditor data={block.data} onUpdate={onUpdate} />;
    case "pageBottom":
      return <PageBottomEditor block={block} onUpdate={onUpdate} />;
    default:
      return <GenericEditor block={block} />;
  }
}
