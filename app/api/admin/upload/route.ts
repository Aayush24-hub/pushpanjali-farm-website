import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const session = await getAdminSession()
        if (!session?.user) throw new Error('Unauthorized')
        if (!/^(gallery|site)\//.test(pathname)) throw new Error('Invalid path')
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
          maximumSizeInBytes: 15 * 1024 * 1024,
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(json)
  } catch (error) {
    console.error('Upload token error:', error)
    return NextResponse.json({ error: 'Upload not allowed' }, { status: 400 })
  }
}
