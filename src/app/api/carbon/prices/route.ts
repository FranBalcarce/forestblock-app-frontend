import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.CARBONMARK_API_URL || 'https://api.carbonmark.com';
    
    // For now, return carbonProjects which includes price information
    // In the future, this could be expanded to support specific price queries
    const response = await fetch(`${apiUrl}/carbonProjects`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching carbon prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carbon prices' },
      { status: 500 }
    );
  }
}
