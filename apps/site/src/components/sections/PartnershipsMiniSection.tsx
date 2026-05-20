import { PartnershipsMini } from "@rocketmind/ui";
import { getHomePage } from "@/lib/unique";

export async function PartnershipsMiniSection() {
  const home = await getHomePage();
  if (!home.partnershipsMini) return null;
  return (
    <PartnershipsMini
      title={home.partnershipsMini.title}
      description={home.partnershipsMini.description}
      logos={home.partnershipsMini.logos}
    />
  );
}
