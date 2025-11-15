'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth'
import { AuthModal } from '@/components/auth/auth-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Calendar, 
  MessageCircle, 
  Utensils, 
  Search, 
  CalendarDays,
  AlertTriangle, 
  BookOpen,
  User,
  LogOut,
  Clock,
  Users,
  Wifi,
  Send,
  Camera,
  Upload
} from 'lucide-react'
import RealTimeDashboard from '@/components/RealTimeDashboard'

const features = [
  {
    id: 'dashboard',
    title: 'Live Dashboard',
    description: 'Real-time campus statistics and activity monitoring',
    icon: Users,
    color: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600'
  },
  {
    id: 'rooms',
    title: 'Room & Lab Availability',
    description: 'Find available classrooms and study spaces in real-time',
    icon: MapPin,
    color: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    id: 'timetable',
    title: 'Smart Timetable',
    description: 'Auto-synced schedule with intelligent reminders',
    icon: Calendar,
    color: 'bg-green-500',
    gradient: 'from-green-400 to-green-600'
  },
  {
    id: 'chatbot',
    title: 'AI Assistant',
    description: 'Get answers to all your campus queries instantly',
    icon: MessageCircle,
    color: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600'
  },
  {
    id: 'canteen',
    title: 'Canteen Insights',
    description: 'Live crowd levels and menu predictions',
    icon: Utensils,
    color: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600'
  },
  {
    id: 'lostfound',
    title: 'Lost & Found',
    description: 'AI-powered item matching and recovery',
    icon: Search,
    color: 'bg-red-500',
    gradient: 'from-red-400 to-red-600'
  },
  {
    id: 'events',
    title: 'Events & Clubs',
    description: 'Discover and manage campus activities',
    icon: CalendarDays,
    color: 'bg-pink-500',
    gradient: 'from-pink-400 to-pink-600'
  },
  {
    id: 'issues',
    title: 'Issue Reporting',
    description: 'Report campus problems for quick resolution',
    icon: AlertTriangle,
    color: 'bg-yellow-500',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  {
    id: 'notes',
    title: 'Notes Hub',
    description: 'Centralized resource sharing platform',
    icon: BookOpen,
    color: 'bg-indigo-500',
    gradient: 'from-indigo-400 to-indigo-600'
  }
]

// Simple feature components with error handling
function RoomsFeature() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms')
        const data = await response.json()
        setRooms(data)
        setError('')
      } catch (error) {
        console.error('Error fetching rooms:', error)
        setError('Failed to load rooms')
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading rooms...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room: any) => (
          <Card key={room.id} className="border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{room.name}</h3>
                <Badge className={room.isAvailable ? "bg-green-500" : "bg-red-500"}>
                  {room.isAvailable ? "Available" : "Occupied"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Type: {room.type}</p>
              <p className="text-sm text-gray-600 mb-1">Capacity: {room.capacity}</p>
              <p className="text-sm text-gray-600">
                {room.building} - Floor {room.floor}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ChatbotFeature() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef<HTMLDivElement | null>(null)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        const msg = err?.error || 'Server error: failed to get response'
        setMessages(prev => [...prev, { role: 'assistant', content: msg }])
        return
      }

      const data = await response.json()
      const reply = data?.response || data?.error || 'No response from server'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  // auto-scroll when messages update
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="space-y-4">
  <div ref={messagesRef} className="h-96 border rounded-lg p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <p>Ask me anything about campus!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border'
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about rooms, events, facilities..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={sendMessage} disabled={loading}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function IssuesFeature() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'medium'
  })
  const [submitted, setSubmitted] = useState(false)

  const categories = ['water', 'electricity', 'furniture', 'cleaning', 'other']

  const submitIssue = async () => {
    if (!user) {
      alert('Please login to report an issue')
      return
    }

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id })
      })

      if (response.ok) {
        setFormData({ title: '', description: '', category: '', location: '', priority: 'medium' })
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
      }
    } catch (error) {
      console.error('Error submitting issue:', error)
      alert('Failed to submit issue')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report New Issue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief description of the issue"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Where is the issue?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the issue"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={submitIssue} 
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            disabled={submitted}
          >
            {submitted ? 'Issue Reported Successfully!' : 'Report Issue'}
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

function CanteenFeature() {
  return (
    <div className="text-center py-8">
      <Utensils className="w-16 h-16 mx-auto mb-4 text-orange-500" />
      <h3 className="text-xl font-semibold mb-2">Canteen Insights</h3>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p className="text-sm text-orange-700">🍽️ Current crowd level: Medium</p>
        <p className="text-sm text-orange-700">⏰ Expected busy time: 12:30 PM - 1:30 PM</p>
      </div>
    </div>
  )
}

function LostFoundFeature() {
  const { user } = useAuth()
  const [lostItems, setLostItems] = useState([])
  const [foundItems, setFoundItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    contactInfo: ''
  })

  const categories = ['Electronics', 'Books', 'IDs', 'Jewelry', 'Clothing', 'Bags', 'Keys', 'Others']

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/lostfound')
        const data = await response.json()
        setLostItems(data.lost || [])
        setFoundItems(data.found || [])
      } catch (error) {
        console.error('Error fetching items:', error)
      }
    }

    fetchItems()
  }, [])

  const submitItem = async (type: 'lost' | 'found') => {
    if (!user) {
      alert('Please login to report an item')
      return
    }

    if (!formData.title || !formData.category || !formData.contactInfo) {
      alert('Please fill in title, category, and contact information')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/lostfound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id, type })
      })

      if (response.ok) {
        setFormData({ title: '', description: '', category: '', location: '', contactInfo: '' })
        alert(`${type} item reported successfully!`)
      } else {
        alert('Failed to report item')
      }
    } catch (error) {
      console.error('Error reporting item:', error)
      alert('Error reporting item')
    } finally {
      setLoading(false)
    }
  }

  const currentItems = activeTab === 'lost' ? lostItems : foundItems

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report {activeTab === 'lost' ? 'Lost' : 'Found'} Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2 mb-4">
            <button
              className={`flex-1 px-4 py-2 rounded-md ${
                activeTab === 'lost' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab('lost')}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Report Lost Item
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded-md ${
                activeTab === 'found' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab('found')}
            >
              <Camera className="w-4 h-4 inline mr-2" />
              Report Found Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Item Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Black Wallet, iPhone 13"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Where was it lost/found?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Information</label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
              placeholder="Email or phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the item"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            onClick={() => submitItem(activeTab)} 
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Submitting...' : `Report ${activeTab === 'lost' ? 'Lost' : 'Found'} Item`}
          </button>
        </CardContent>
      </Card>

      {currentItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent {activeTab === 'lost' ? 'Lost' : 'Found'} Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {currentItems.map((item: any) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge variant="outline">{item.location}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">Contact: {item.contactInfo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function EventsFeature() {
  return (
    <div className="text-center py-8">
      <CalendarDays className="w-16 h-16 mx-auto mb-4 text-pink-500" />
      <h3 className="text-xl font-semibold mb-2">Campus Events</h3>
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
        <p className="text-sm text-pink-700">🎉 Tech Talk - Today at 2 PM</p>
        <p className="text-sm text-pink-700">🎭 Cultural Fest - This Weekend</p>
      </div>
    </div>
  )
}

function TimetableFeature() {
  return (
    <div className="text-center py-8">
      <Calendar className="w-16 h-16 mx-auto mb-4 text-green-500" />
      <h3 className="text-xl font-semibold mb-2">Smart Timetable</h3>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-700">📚 Mathematics - 9:00 AM</p>
        <p className="text-sm text-green-700">💻 Computer Lab - 11:00 AM</p>
        <p className="text-sm text-green-700">🔬 Physics - 2:00 PM</p>
      </div>
    </div>
  )
}

function NotesFeature() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    isPublic: false
  })

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Other']

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes')
        const data = await response.json()
        setNotes(data)
      } catch (error) {
        console.error('Error fetching notes:', error)
      }
    }

    fetchNotes()
  }, [])

  const submitNote = async () => {
    if (!user) {
      alert('Please login to upload notes')
      return
    }

    if (!formData.title || !formData.subject) {
      alert('Please fill in title and subject')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id })
      })

      if (response.ok) {
        setFormData({ title: '', description: '', subject: '', isPublic: false })
        alert('Notes uploaded successfully!')
      } else {
        alert('Failed to upload notes')
      }
    } catch (error) {
      console.error('Error uploading notes:', error)
      alert('Error uploading notes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Calculus Chapter 5 Notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select 
                value={formData.subject} 
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="rounded"
            />
            <label>Make public</label>
          </div>

          <button 
            onClick={submitNote} 
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Notes'}
          </button>
        </CardContent>
      </Card>

      {notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notes.map((note: any) => (
                <div key={note.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{note.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{note.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{note.subject}</Badge>
                        {note.isPublic && <Badge className="bg-green-500">Public</Badge>}
                      </div>
                      <p className="text-xs text-gray-500">
                        Uploaded by {note.user?.name} on {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function Home() {
  const { user, logout } = useAuth()
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const renderFeature = () => {
    switch (activeFeature) {
      case 'dashboard':
        return <RealTimeDashboard />
      case 'rooms':
        return <RoomsFeature />
      case 'chatbot':
        return <ChatbotFeature />
      case 'issues':
        return <IssuesFeature />
      case 'timetable':
        return <TimetableFeature />
      case 'canteen':
        return <CanteenFeature />
      case 'lostfound':
        return <LostFoundFeature />
      case 'events':
        return <EventsFeature />
      case 'notes':
        return <NotesFeature />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SIT - CampusHub AI
                </h1>
                <p className="text-sm text-gray-600">Siddaganga Institute of Technology</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)}>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!activeFeature ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center py-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Smart Campus Companion
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Experience the future of campus life with AI-powered features designed to make every day smarter, 
                more connected, and infinitely more productive.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-purple-100 text-purple-700 px-4 py-2 text-sm">
                  🎯 Real-time Updates
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 px-4 py-2 text-sm">
                  🤖 AI-Powered
                </Badge>
                <Badge className="bg-green-100 text-green-700 px-4 py-2 text-sm">
                  📱 Mobile Friendly
                </Badge>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card 
                  key={feature.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 bg-white/70 backdrop-blur-sm"
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4 text-center">
                  <Wifi className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm">Active Users</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm">Smart Rooms</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4 text-center">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">10K+</p>
                  <p className="text-sm">AI Queries</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm">Available</p>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            {!user && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Campus Experience?</h3>
                  <p className="text-purple-100 mb-6">Join thousands of students who are already using CampusHub AI to make their campus life smarter and more connected.</p>
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-white text-purple-600 hover:bg-purple-50"
                  >
                    Get Started Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back Button */}
            <Button 
              variant="outline" 
              onClick={() => setActiveFeature(null)}
              className="mb-6"
            >
              ← Back to Dashboard
            </Button>

            {/* Feature Content */}
            {renderFeature()}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-purple-100 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 CampusHub AI. Making campus life smarter, one feature at a time.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}