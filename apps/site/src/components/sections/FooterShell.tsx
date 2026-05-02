"use client";

import { useRef, useState, useEffect } from "react";
import { SiteFooter } from "@rocketmind/ui";
import type { NavSection } from "@rocketmind/ui/content";
import { FloatingMascot } from "@/components/blocks/FloatingMascot";
import {
  ConsultantPanel,
  type ConsultantPanelHandle,
} from "@/components/blocks/ConsultantPanel";
import { AiConsultant } from "./AiConsultant";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

type Link = { href: string; label: string };

export function FooterShell({
  nav,
  companyLinks,
  legalLinks,
}: {
  nav: NavSection[];
  companyLinks: Link[];
  legalLinks: Link[];
}) {
  const panelRef = useRef<ConsultantPanelHandle>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <FloatingMascot
        onOpenChat={() => panelRef.current?.open()}
        hidden={sectionVisible}
        flyUp={panelOpen}
      />
      <ConsultantPanel ref={panelRef} onOpenChange={setPanelOpen} />
      <div ref={sentinelRef}>
        <SiteFooter
          basePath={BASE_PATH}
          nav={nav}
          companyLinks={companyLinks}
          legalLinks={legalLinks}
        >
          <AiConsultant />
        </SiteFooter>
      </div>
    </>
  );
}
