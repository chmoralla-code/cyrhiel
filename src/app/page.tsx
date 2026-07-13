import { About } from "@/components/about";
import { Capabilities } from "@/components/capabilities";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteProvider } from "@/components/site-provider";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <SiteProvider content={content}>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <Capabilities />
        <Contact />
      </main>
    </SiteProvider>
  );
}
