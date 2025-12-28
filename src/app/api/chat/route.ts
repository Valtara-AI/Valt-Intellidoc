import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

// Mock AI responses for demonstration
const mockResponses = [
  "Based on the documents you've provided, I can help you analyze the content. What specific aspect would you like me to focus on?",
  "I've found several relevant documents in your repository. Here are the key findings...",
  "According to the compliance documentation, the requirements state...",
  "The legal precedent in this case suggests...",
  "I've identified potential risks in the contract terms that you should review...",
]

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message, conversationId } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Generate mock response
    const responseText = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    
    const response = {
      id: Date.now().toString(),
      content: responseText,
      timestamp: new Date().toISOString(),
      conversationId: conversationId || 'default',
      sources: [
        {
          title: 'Legal Contract Analysis.pdf',
          page: 5,
          snippet: 'Relevant contract clause excerpt...'
        },
        {
          title: 'Compliance Guidelines.docx',
          page: 12,
          snippet: 'Policy requirement details...'
        }
      ]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}