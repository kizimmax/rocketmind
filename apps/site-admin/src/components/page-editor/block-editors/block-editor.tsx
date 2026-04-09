"use client";

import type { PageBlock } from "@/lib/types";
import { HeroEditor } from "./hero-editor";
import { AboutEditor } from "./about-editor";
import { AudienceEditor } from "./audience-editor";
import { ResultsEditor } from "./results-editor";
import { ProcessEditor } from "./process-editor";
import { ExpertsEditor } from "./experts-editor";
import { GenericEditor } from "./generic-editor";

interface BlockEditorProps {
  block: PageBlock;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function BlockEditor({ block, onUpdate }: BlockEditorProps) {
  switch (block.type) {
    case "hero":
      return <HeroEditor data={block.data} onUpdate={onUpdate} />;
    case "about":
      return <AboutEditor data={block.data} onUpdate={onUpdate} />;
    case "audience":
      return <AudienceEditor data={block.data} onUpdate={onUpdate} />;
    case "results":
      return <ResultsEditor data={block.data} onUpdate={onUpdate} />;
    case "process":
      return <ProcessEditor data={block.data} onUpdate={onUpdate} />;
    case "experts":
      return <ExpertsEditor data={block.data} onUpdate={onUpdate} />;
    default:
      return <GenericEditor block={block} />;
  }
}
