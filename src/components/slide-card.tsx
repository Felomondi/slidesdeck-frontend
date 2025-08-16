import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type Slide = {
  slideTitle: string;
  talkingPoints: string[];
  visualSuggestion?: string | null;
};

export function SlideCard({ initial }: { initial: Slide }) {
  const [slide, setSlide] = useState<Slide>(initial);

  return (
    <Card className="w-full">
      <CardHeader>
        <Input
          value={slide.slideTitle}
          onChange={(e) => setSlide({ ...slide, slideTitle: e.target.value })}
          className="font-semibold text-lg"
        />
      </CardHeader>
      <CardContent className="space-y-2">
        <ul className="list-disc pl-6 text-sm">
          {slide.talkingPoints.map((tp, i) => (
            <li key={i}>
              <input
                className="w-full bg-transparent outline-none"
                value={tp}
                onChange={(e) => {
                  const copy = [...slide.talkingPoints];
                  copy[i] = e.target.value;
                  setSlide({ ...slide, talkingPoints: copy });
                }}
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}