import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    success: true,
    id: params.id,
    message: `Notification ${params.id} marked as read`
  });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    success: true,
    id: params.id,
    message: `Notification ${params.id} marked as read`
  });
}
