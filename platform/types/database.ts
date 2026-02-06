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
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
          company_id: string | null
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
          company_id?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
          company_id?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          logo: string | null
          domain: string | null
          budget: number
          settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo?: string | null
          domain?: string | null
          budget?: number
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo?: string | null
          domain?: string | null
          budget?: number
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          image: string | null
          category: string
          price: number
          currency: string
          sku: string
          type: 'SWAG' | 'GIFT_CARD' | 'PHYSICAL_GIFT' | 'EXPERIENCE'
          company_id: string | null
          stock: number
          warehouse_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image?: string | null
          category: string
          price: number
          currency?: string
          sku: string
          type: 'SWAG' | 'GIFT_CARD' | 'PHYSICAL_GIFT' | 'EXPERIENCE'
          company_id?: string | null
          stock?: number
          warehouse_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image?: string | null
          category?: string
          price?: number
          currency?: string
          sku?: string
          type?: 'SWAG' | 'GIFT_CARD' | 'PHYSICAL_GIFT' | 'EXPERIENCE'
          company_id?: string | null
          stock?: number
          warehouse_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          company_id: string
          campaign_recipient_id: string | null
          status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
          total: number
          currency: string
          shipping_address: string | null
          tracking_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          company_id: string
          campaign_recipient_id?: string | null
          status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
          total: number
          currency?: string
          shipping_address?: string | null
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          company_id?: string
          campaign_recipient_id?: string | null
          status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
          total?: number
          currency?: string
          shipping_address?: string | null
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaign_recipients: {
        Row: {
          id: string
          campaign_id: string
          name: string
          email: string
          designation: string | null
          department: string | null
          phone: string | null
          gift_link_token: string
          link_expires_at: string | null
          gift_selected_at: string | null
          order_id: string | null
          shipping_address: Json | null
          selected_product_id: string | null
          size_color_preference: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          name: string
          email: string
          designation?: string | null
          department?: string | null
          phone?: string | null
          gift_link_token: string
          link_expires_at?: string | null
          gift_selected_at?: string | null
          order_id?: string | null
          shipping_address?: Json | null
          selected_product_id?: string | null
          size_color_preference?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          name?: string
          email?: string
          designation?: string | null
          department?: string | null
          phone?: string | null
          gift_link_token?: string
          link_expires_at?: string | null
          gift_selected_at?: string | null
          order_id?: string | null
          shipping_address?: Json | null
          selected_product_id?: string | null
          size_color_preference?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          email: string
          contact_phone: string | null
          categories: string[]
          sla_days: number
          gstin: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          contact_phone?: string | null
          categories?: string[]
          sla_days?: number
          gstin?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          contact_phone?: string | null
          categories?: string[]
          sla_days?: number
          gstin?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      order_vendor_assignments: {
        Row: {
          id: string
          order_id: string
          vendor_id: string
          status: 'PENDING' | 'ACCEPTED' | 'SHIPPED' | 'DELIVERED'
          cost: number | null
          po_sent_at: string | null
          tracking_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          vendor_id: string
          status?: 'PENDING' | 'ACCEPTED' | 'SHIPPED' | 'DELIVERED'
          cost?: number | null
          po_sent_at?: string | null
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          vendor_id?: string
          status?: 'PENDING' | 'ACCEPTED' | 'SHIPPED' | 'DELIVERED'
          cost?: number | null
          po_sent_at?: string | null
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
    }
  }
}
