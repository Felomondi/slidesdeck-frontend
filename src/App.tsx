import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function ping() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/health`);
      const data = await res.json();
      setMessage(String(data?.message ?? "No message"));
    } catch {
      setMessage("Error contacting backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold">SlidesDeck.app</h1>
          <p className="text-sm text-muted-foreground">Week 1 – Hello World</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Type anything (not used yet)" />
          <Button onClick={ping} disabled={loading}>
            {loading ? "Contacting backend…" : "Fetch from backend"}
          </Button>
          {message && (
            <div className="text-sm">
              Backend says: <b>{message}</b>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}