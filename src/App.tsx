import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { postJSON } from "./lib/api";
import { SlideCard } from "./components/slide-card";

type Slide = { slideTitle: string; talkingPoints: string[]; visualSuggestion?: string | null };
type OutlineResponse = { topic: string; slides: Slide[] };

export default function App() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<OutlineResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setError(null);
    setLoading(true);
    try {
      const data = await postJSON<OutlineResponse>("/api/generate", { topic, slideCount: 6 });
      setOutline(data);
    } catch (e) {
      setError("Failed to generate outline");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card className="shadow-lg">
          <CardHeader>
            <h1 className="text-2xl font-bold">SlidesDeck.app</h1>
            <p className="text-sm text-muted-foreground">Week 2 – Generate Outline</p>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="Enter your topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Button onClick={generate} disabled={loading || !topic.trim()}>
              {loading ? "Thinking…" : "Generate Outline"}
            </Button>
          </CardContent>
        </Card>

        {error && <div className="text-sm text-red-600">{error}</div>}

        {outline && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outline.slides.map((s, i) => (
              <SlideCard key={i} initial={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}