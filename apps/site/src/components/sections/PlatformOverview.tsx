import { getHomePage } from "@/lib/unique";

import { PlatformOverviewClient } from "./PlatformOverviewClient";

export function PlatformOverview() {
  const home = getHomePage();
  const cells = home.methodology?.cells ?? [];
  return <PlatformOverviewClient cells={cells} />;
}
