import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.CARBONMARK_API_URL || 'https://api.carbonmark.com';
    const apiKey = process.env.CARBONMARK_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiUrl}/v0/projects`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching carbon projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carbon projects' },
      { status: 500 }
    );
  }
}
