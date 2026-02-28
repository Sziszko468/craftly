export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          bio: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string | null
          price: number
          category: string
          condition: string
          stock: number
          tags: string[] | null
          images: string[] | null
          is_featured: boolean
          rating: number
          review_count: number
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          description?: string | null
          price: number
          category: string
          condition: string
          stock?: number
          tags?: string[] | null
          images?: string[] | null
          is_featured?: boolean
          rating?: number
          review_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          description?: string | null
          price?: number
          category?: string
          condition?: string
          stock?: number
          tags?: string[] | null
          images?: string[] | null
          is_featured?: boolean
          rating?: number
          review_count?: number
          created_at?: string
        }
      }
    }
  }
}