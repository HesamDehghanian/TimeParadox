import client from "./client"


export interface Category {
    id: number
    name: string
    description: string | null
    priority: number
    color: string
    icon: string | null
    is_active: boolean
    created_at: string
}


export interface CreateCategoryData {
    name: string
    description?: string | null
    priority: number
    color: string
    icon?: string | null
    is_active: boolean
}


export interface UpdateCategoryData {
    name?: string
    description?: string | null
    priority?: number
    color?: string
    icon?: string | null
    is_active?: boolean
}


export async function getCategories(): Promise<Category[]> {

    const response = await client.get(
        "/categories"
    )

    return response.data
}


export async function createCategory(
    data: CreateCategoryData
): Promise<Category> {

    const response = await client.post(
        "/categories",
        data
    )

    return response.data
}


export async function updateCategory(
    categoryId: number,
    data: UpdateCategoryData
): Promise<Category> {

    const response = await client.put(
        `/categories/${categoryId}`,
        data
    )

    return response.data
}


export async function deleteCategory(
    categoryId: number
): Promise<void> {

    await client.delete(
        `/categories/${categoryId}`
    )
}