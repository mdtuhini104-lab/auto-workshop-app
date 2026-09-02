import { NextResponse } from 'next/server';

export async function PATCH() {
  return NextResponse.json({
    success: true,
    message: 'All notifications marked as read'
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'All notifications marked as read'
  });
}
