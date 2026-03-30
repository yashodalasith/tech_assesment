export type ApiListResponse<T> = {
  success: boolean
  message: string
  data: T[]
  pagination?: {
    count: number
    page: number
    page_size: number
    total_pages: number
    next: string | null
    previous: string | null
  }
}

export type ApiItemResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type Organization = {
  id: number
  name: string
  subscription_plan: 'BASIC' | 'PRO'
}

export type User = {
  id: number
  username: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'STAFF'
  organization: Organization
}

export type Company = {
  id: number
  name: string
  industry: string
  country: string
  logo: string | null
  created_at: string
}

export type Contact = {
  id: number
  company: number
  full_name: string
  email: string
  phone: string | null
  role: string
  created_at: string
}

export type Activity = {
  id: number
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  model_name: string
  object_id: string
  actor_username: string
  timestamp: string
}
