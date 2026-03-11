import { HOST } from "@/lib/constants/constants";
import { getStates } from "@/utils/common";
import { MetadataRoute } from "next";

export const revalidate = 3600;

interface State {
  _id: string;
  state: string;
  state_slug: string;
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const states = await getStates();
  const stateUrls: MetadataRoute.Sitemap = states.map((state: State) => ({
    url: `${HOST}/${state?.state_slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  }));

  return [
    {
      url: HOST,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...stateUrls,
  ];
}
