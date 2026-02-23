export interface Category {
  id: string
  title: string
  description?: string | null
  icon: string
  color: string
  transactions?: { id: string }[]
}

export interface CategoriesQueryData {
  categories: Category[]
}

export interface CreateCategoryInput {
  title: string
  description?: string | null
  icon: string
  color: string
}

export interface UpdateCategoryInput {
  title?: string
  description?: string | null
  icon?: string
  color?: string
}
