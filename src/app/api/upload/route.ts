import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Return a dummy image for the template
    return NextResponse.json({ url: 'https://placehold.co/600x400?text=Template+Image' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
