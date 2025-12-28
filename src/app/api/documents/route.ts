import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

// Mock document data
const mockDocuments = [
  {
    id: 1,
    name: 'Legal Contract Analysis.pdf',
    type: 'Legal Document',
    lastModified: '2024-09-20',
    size: '2.4 MB',
    status: 'Processed',
    summary: 'Contract agreement between parties with standard terms and conditions.',
  },
  {
    id: 2,
    name: 'Compliance Report Q3.docx',
    type: 'Compliance',
    lastModified: '2024-09-19',
    size: '1.8 MB',
    status: 'Processing',
    summary: 'Quarterly compliance report covering regulatory requirements.',
  },
  {
    id: 3,
    name: 'Policy Update Guidelines.pdf',
    type: 'Policy',
    lastModified: '2024-09-18',
    size: '956 KB',
    status: 'Processed',
    summary: 'Updated guidelines for policy implementation and enforcement.',
  },
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredDocuments = mockDocuments

    // Apply filters
    if (query) {
      filteredDocuments = filteredDocuments.filter(doc =>
        doc.name.toLowerCase().includes(query.toLowerCase()) ||
        doc.summary.toLowerCase().includes(query.toLowerCase())
      )
    }

    if (type) {
      filteredDocuments = filteredDocuments.filter(doc => doc.type === type)
    }

    // Apply pagination
    const paginatedDocuments = filteredDocuments.slice(offset, offset + limit)

    return NextResponse.json({
      documents: paginatedDocuments,
      total: filteredDocuments.length,
      hasMore: offset + limit < filteredDocuments.length,
    })
  } catch (error) {
    console.error('Documents API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, content } = body

    if (!name || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Mock document upload/creation
    const newDocument = {
      id: Date.now(),
      name,
      type,
      lastModified: new Date().toISOString().split('T')[0],
      size: '1.2 MB', // Mock size
      status: 'Processing',
      summary: 'Document uploaded and processing...',
    }

    return NextResponse.json(newDocument, { status: 201 })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}