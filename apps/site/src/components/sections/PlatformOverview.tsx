import { getHomePage } from "@/lib/unique";

import { PlatformOverviewClient } from "./PlatformOverviewClient";

export async function PlatformOverview() {
  const home = await getHomePage();
  const cells = home.methodology?.cells ?? [];
  return <PlatformOverviewClient cells={cells} />;
}
