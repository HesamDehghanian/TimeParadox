import client from "./client"

export interface Task {
    id: number
    category_id: number
    title: string
    description: string | null
    date: string
    planned_minutes: number
}


export async function getTasks(
    date?: string
): Promise<Task[]> {

    const response = await client.get(
        "/tasks",
        {
            params: date
                ? { date }
                : undefined,
        }
    )

    return response.data
}