import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { API_BASE } from './lib/api'

function App() {
  const [topic, setTopic] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const ping = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/health`)
      const data = await res.json()
      setMessage(data.message)
    } catch (e) {
      setMessage('Error contacting backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold">SlidesDeck.app</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Type a topic (unused for now)" value={topic} onChange={e=>setTopic(e.target.value)} />
          <Button onClick={ping} disabled={loading}>
            {loading ? 'Contacting backend…' : 'Fetch from backend'}
          </Button>
          {message && (
            <div className="text-sm text-gray-700">Backend says: <b>{message}</b></div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App
