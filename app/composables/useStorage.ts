// Storage composable – upload and delete product images
import { ref } from 'vue'

export function useStorage() {
  const supabase = useSupabaseClient()
  const isUploading = ref(false)

  // Upload a single image, returns public URL or null
  async function uploadImage(file: File, userId: string): Promise<string | null> {
    isUploading.value = true

    const ext = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    isUploading.value = false

    if (error) {
      console.error('Upload error:', error.message)
      return null
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  // Upload multiple images
  async function uploadImages(files: File[], userId: string): Promise<string[]> {
    const urls: string[] = []

    for (const file of files) {
      const url = await uploadImage(file, userId)
      if (url) urls.push(url)
    }

    return urls
  }

  // Delete image by URL
  async function deleteImage(url: string): Promise<boolean> {
    const path = url.split('/product-images/')[1]
    if (!path) return false

    const { error } = await supabase.storage
      .from('product-images')
      .remove([path])

    return !error
  }

  return {
    isUploading,
    uploadImage,
    uploadImages,
    deleteImage,
  }
}