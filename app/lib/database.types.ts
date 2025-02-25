// app/lib/database.types.ts
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
      admin_users: {
        Row: {
          id: string
          user_id: string
          email: string
          role: 'admin' | 'super_admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          role: 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          role?: 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          slug: string
          name: string
          category: string
          type: 'physical' | 'digital'
          status: 'available' | 'sold'
          price: number
          original_price: number
          monthly_potential: number
          pitch: string
          description: string
          images: Json
          market_analysis: Json
          product_details: Json
          marketing_strategy: Json
          financials: Json
          includes: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          category: string
          type: 'physical' | 'digital'
          status?: 'available' | 'sold'
          price: number
          original_price: number
          monthly_potential: number
          pitch: string
          description: string
          images: Json
          market_analysis: Json
          product_details: Json
          marketing_strategy: Json
          financials: Json
          includes: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          category?: string
          type?: 'physical' | 'digital'
          status?: 'available' | 'sold'
          price?: number
          original_price?: number
          monthly_potential?: number
          pitch?: string
          description?: string
          images?: Json
          market_analysis?: Json
          product_details?: Json
          marketing_strategy?: Json
          financials?: Json
          includes?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          slug: string
          name: string
          category: string
          description: string
          short_description: string
          challenge: string
          solution: string
          metrics: Json
          timeline: Json[]
          images: Json
          testimonials: Json[]
          products: Json[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          category: string
          description: string
          short_description: string
          challenge: string
          solution: string
          metrics: Json
          timeline: Json[]
          images: Json
          testimonials: Json[]
          products: Json[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          category?: string
          description?: string
          short_description?: string
          challenge?: string
          solution?: string
          metrics?: Json
          timeline?: Json[]
          images?: Json
          testimonials?: Json[]
          products?: Json[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}