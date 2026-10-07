'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { ArrowDown, ArrowUp, EyeOff, Loader2, Pencil, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { addGalleryItem, deleteGalleryItem, reorderGallery, updateGalleryItem } from '@/app/actions/admin'
import { uploadImage } from '@/lib/upload-image'
import { GALLERY_CATEGORIES, type GalleryCategory, type GalleryItem } from '@/lib/content-types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { BilingualField } from './fields'

const CATEGORY_LABEL: Record<GalleryCategory, string> = {
  poultry: 'Poultry',
  fish: 'Fish',
  farm: 'Farm',
  other: 'Other',
}

function CategorySelect({
  id,
  value,
  onChange,
}: {
  id?: string
  value: GalleryCategory
  onChange: (c: GalleryCategory) => void
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as GalleryCategory)}
      className="h-11 rounded-md border border-input bg-white px-3 text-sm"
    >
      {GALLERY_CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {CATEGORY_LABEL[c]}
        </option>
      ))}
    </select>
  )
}

export function GalleryManager({ items }: { items: GalleryItem[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadCategory, setUploadCategory] = useState<GalleryCategory>('farm')
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [deleting, setDeleting] = useState<GalleryItem | null>(null)
  const [pending, start] = useTransition()

  async function onFiles(files: FileList | null) {
    if (!files?.length) return
    const list = Array.from(files)
    setProgress({ done: 0, total: list.length })
    let failed = 0
    for (const [i, file] of list.entries()) {
      try {
        const up = await uploadImage(file, 'gallery')
        const res = await addGalleryItem({ ...up, category: uploadCategory })
        if (!res.ok) failed++
      } catch (e) {
        console.error(e)
        failed++
      }
      setProgress({ done: i + 1, total: list.length })
    }
    setProgress(null)
    if (fileRef.current) fileRef.current.value = ''
    if (failed) toast.error(`${failed} photo(s) failed to upload.`)
    else toast.success(`${list.length} photo(s) added.`)
    router.refresh()
  }

  function move(index: number, dir: -1 | 1) {
    const ids = items.map((i) => i.id)
    const j = index + dir
    if (j < 0 || j >= ids.length) return
    ;[ids[index], ids[j]] = [ids[j], ids[index]]
    start(async () => {
      const res = await reorderGallery(ids)
      if (!res.ok) toast.error(res.error)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-label="Upload photos"
        className="flex flex-col gap-4 rounded-[var(--radius-card)] border-2 border-dashed border-sage bg-offwhite p-6 md:flex-row md:items-end"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (!progress) onFiles(e.dataTransfer.files)
        }}
      >
        <div className="flex-1">
          <p className="font-medium text-olive">Add photos</p>
          <p className="text-sm text-ink/60">Drag images here or choose files. JPG, PNG, WebP up to 15 MB.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="upload-category" className="text-xs text-ink/60">
            Category
          </Label>
          <CategorySelect id="upload-category" value={uploadCategory} onChange={setUploadCategory} />
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => onFiles(e.target.files)}
        />
        <Button type="button" className="h-11" disabled={!!progress} onClick={() => fileRef.current?.click()}>
          {progress ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />}
          {progress ? `Uploading ${progress.done}/${progress.total}` : 'Choose photos'}
        </Button>
      </section>

      {items.length === 0 ? (
        <p className="rounded-[var(--radius-card)] bg-offwhite p-10 text-center text-ink/60">
          No photos yet. Upload your first one above.
        </p>
      ) : (
        <ul className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-3', pending && 'opacity-70')}>
          {items.map((item, i) => (
            <li key={item.id} className="overflow-hidden rounded-[var(--radius-card)] bg-offwhite shadow-soft">
              <div className="relative aspect-[4/3] bg-sage-light">
                <Image src={item.url} alt={item.caption.en || item.caption.ne || ''} fill sizes="400px" className="object-cover" />
                <span className="absolute top-2 left-2 rounded-full bg-offwhite/95 px-2.5 py-0.5 text-xs font-medium text-olive">
                  {CATEGORY_LABEL[item.category]}
                </span>
                {!item.published && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-0.5 text-xs text-cream">
                    <EyeOff className="size-3" aria-hidden /> Hidden
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 p-3">
                <p className="min-w-0 flex-1 truncate text-sm text-ink/80">
                  {item.caption.ne || item.caption.en || <span className="text-ink/40">No caption</span>}
                </p>
                <Button size="icon" variant="ghost" disabled={i === 0 || pending} onClick={() => move(i, -1)}>
                  <ArrowUp className="size-4" aria-hidden />
                  <span className="sr-only">Move earlier</span>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={i === items.length - 1 || pending}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown className="size-4" aria-hidden />
                  <span className="sr-only">Move later</span>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditing(item)}>
                  <Pencil className="size-4" aria-hidden />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleting(item)}>
                  <Trash2 className="size-4" aria-hidden />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && <EditDialog key={editing.id} item={editing} onClose={() => setEditing(null)} />}

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from the website and storage. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                const target = deleting
                setDeleting(null)
                if (!target) return
                start(async () => {
                  const res = await deleteGalleryItem(target.id)
                  if (res.ok) toast.success('Photo deleted')
                  else toast.error(res.error)
                  router.refresh()
                })
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function EditDialog({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  const router = useRouter()
  const [caption, setCaption] = useState(item.caption)
  const [category, setCategory] = useState(item.category)
  const [published, setPublished] = useState(item.published)
  const [pending, start] = useTransition()

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit photo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <BilingualField label="Caption" value={caption} onChange={setCaption} />
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-category">Category</Label>
              <CategorySelect id="edit-category" value={category} onChange={setCategory} />
            </div>
            <div className="flex items-center gap-3 pb-2.5">
              <Switch id="edit-published" checked={published} onCheckedChange={setPublished} />
              <Label htmlFor="edit-published">Show on website</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await updateGalleryItem({ id: item.id, caption, category, published })
                if (res.ok) {
                  toast.success('Saved')
                  router.refresh()
                  onClose()
                } else toast.error(res.error)
              })
            }
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
