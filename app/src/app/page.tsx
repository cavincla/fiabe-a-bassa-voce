import { getStories } from "@/lib/stories";
import { StoryBrowser } from "@/components/home/StoryBrowser";

// Componente server: le fiabe vengono lette dai file YAML mentre Next.js
// pre-genera la pagina, quindi in produzione questa home è HTML statico.
export default function Home() {
  return <StoryBrowser stories={getStories()} />;
}
