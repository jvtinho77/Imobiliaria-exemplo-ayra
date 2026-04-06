import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitizeInput, validateEmail } from '@/lib/security'

// GET /api/contacts - List all contacts (admin only)
export async function GET(request: NextRequest) {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: contacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

// POST /api/contacts - Create new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Name, email and message are required' },
        { status: 400 }
      )
    }

    const email = sanitizeInput(body.email)
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const contact = await prisma.contact.create({
      data: {
        name: sanitizeInput(body.name),
        email: email,
        phone: body.phone ? sanitizeInput(body.phone) : null,
        message: sanitizeInput(body.message),
        propertyId: body.propertyId || null,
      },
    })

    return NextResponse.json(
      { success: true, data: contact, message: 'Contact submitted successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact' },
      { status: 500 }
    )
  }
}
