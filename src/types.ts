export type Slide = {
    slideTitle: string;
    talkingPoints: string[];
    visualSuggestion?: string | null;
    notes?: string | null;
  };
  
  export type OutlineResponse = {
    topic: string;
    slides: Slide[];
  };