'use client'

import { upload } from '@vercel/blob/client'

function readDimensions(file: File) {
  return new Promise<{ width: number | null; height: number | null }>((resolve) => {
    const src = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(src)
    }
    img.onerror = () => {
      resolve({ width: null, height: null })
      URL.revokeObjectURL(src)
    }
    img.src = src
  })
}

export async function uploadImage(file: File, folder: 'gallery' | 'site') {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').slice(-60) || 'image.jpg'
  const [blob, dims] = await Promise.all([
    upload(`${folder}/${safeName}`, file, {
      access: 'public',
      handleUploadUrl: '/api/admin/upload',
      contentType: file.type,
    }),
    readDimensions(file),
  ])
  return { url: blob.url, ...dims }
}
