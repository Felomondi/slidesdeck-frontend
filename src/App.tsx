import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { postJSON } from "./lib/api";
import { SlideCard } from "./components/slide-card";

type Slide = {
  slideTitle: string;
  talkingPoints: string[];
  visualSuggestion?: string | null;
  notes?: string | null;
};

type OutlineResponse = { topic: string; slides: Slide[] };

export default function App() {
  const [brief, setBrief] = useState("");
  const [slideCount, setSlideCount] = useState<number>(8);
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<OutlineResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setError(null);
    setLoading(true);
    try {
      const body = {
        brief,
        slideCount,
        maxBulletsPerSlide: 5,
        includeVisualSuggestions: true,
        includeNotes: true,
      };
      const data = await postJSON<OutlineResponse>("/api/generate", body);
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
            <p className="text-sm text-muted-foreground">Week 2 – Generate Slides from a Brief</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="text-sm font-medium">Describe your presentation</label>
            <Textarea
              placeholder={`Tell us everything:\n• Topic focus and scope\n• Audience & level\n• Desired tone (academic, persuasive, story)\n• Must-include points, examples, data\n• Sections you want\n• Constraints (time limit, no jargon, etc.)`}
              className="min-h-[180px]"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {brief.length} characters
              </span>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Slides</label>
                <Input
                  type="number"
                  min={3}
                  max={25}
                  value={slideCount}
                  onChange={(e) =>
                    setSlideCount(
                      Math.max(3, Math.min(25, Number(e.target.value || 8)))
                    )
                  }
                  className="w-24"
                />
              </div>
              <Button onClick={generate} disabled={loading || brief.trim().length < 20}>
                {loading ? "Drafting…" : "Generate Slides"}
              </Button>
            </div>
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