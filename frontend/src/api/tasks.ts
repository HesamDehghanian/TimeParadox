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

export interface CreateTaskData {
    category_id: number
    title: string
    description?: string
    date: string
    planned_minutes: number
}


export async function createTask(
    data: CreateTaskData
): Promise<Task> {

    const response =
        await client.post(
            "/tasks",
            data
        )

    return response.data
}

export async function getTasksByDate(
    date: string
): Promise<Task[]> {

    const response =
        await client.get(
            `/tasks?date=${date}`
        )

    return response.data
}