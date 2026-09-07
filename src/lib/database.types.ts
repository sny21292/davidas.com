// Auto-generated from the Supabase schema (davidas-staging).
// Regenerate with the Supabase CLI: `supabase gen types typescript`.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author: string | null
          content: string | null
          date: string | null
          excerpt: string | null
          id: string
          image: string | null
          sort_order: number
          tag: string | null
          title: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          date?: string | null
          excerpt?: string | null
          id: string
          image?: string | null
          sort_order?: number
          tag?: string | null
          title: string
        }
        Update: {
          author?: string | null
          content?: string | null
          date?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          sort_order?: number
          tag?: string | null
          title?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          id: string
          label: string
          sort_order?: number
        }
        Update: {
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          form_hint: string | null
          id: string
          image: string | null
          karats: string | null
          metals: string | null
          name: string
          sizes: string | null
          slug: string
          sort_order: number
          style: string
          subcategory_id: string
          updated_at: string
          video: string | null
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          form_hint?: string | null
          id?: string
          image?: string | null
          karats?: string | null
          metals?: string | null
          name: string
          sizes?: string | null
          slug: string
          sort_order?: number
          style: string
          subcategory_id: string
          updated_at?: string
          video?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          form_hint?: string | null
          id?: string
          image?: string | null
          karats?: string | null
          metals?: string | null
          name?: string
          sizes?: string | null
          slug?: string
          sort_order?: number
          style?: string
          subcategory_id?: string
          updated_at?: string
          video?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      showcase_items: {
        Row: {
          bench_image: string | null
          case_number: number
          category_id: string | null
          collection: string | null
          created_at: string
          creation_video: string | null
          description: string | null
          display_order: number
          featured: boolean
          front_image: string | null
          gemstone: string | null
          id: string
          image: string | null
          images: string[]
          karats: string | null
          metals: string | null
          mode: string
          motion_video: string | null
          name: string
          price: number | null
          price_options: Json | null
          sketch_image: string | null
          slug: string
          style: string | null
          subcategory_id: string | null
          surface: string
          updated_at: string
          video: string | null
        }
        Insert: {
          bench_image?: string | null
          case_number?: number
          category_id?: string | null
          collection?: string | null
          created_at?: string
          creation_video?: string | null
          description?: string | null
          display_order?: number
          featured?: boolean
          gemstone?: string | null
          id?: string
          image?: string | null
          images?: string[]
          karats?: string | null
          metals?: string | null
          mode?: string
          motion_video?: string | null
          name: string
          price?: number | null
          price_options?: Json | null
          sketch_image?: string | null
          slug: string
          style?: string | null
          subcategory_id?: string | null
          surface?: string
          updated_at?: string
          video?: string | null
        }
        Update: {
          bench_image?: string | null
          case_number?: number
          category_id?: string | null
          collection?: string | null
          created_at?: string
          creation_video?: string | null
          description?: string | null
          display_order?: number
          featured?: boolean
          gemstone?: string | null
          id?: string
          image?: string | null
          images?: string[]
          karats?: string | null
          metals?: string | null
          mode?: string
          motion_video?: string | null
          name?: string
          price?: number | null
          price_options?: Json | null
          sketch_image?: string | null
          slug?: string
          style?: string | null
          subcategory_id?: string | null
          surface?: string
          updated_at?: string
          video?: string | null
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          category_id: string
          id: string
          label: string
          sort_order?: number
        }
        Update: {
          category_id?: string
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
