import client from "./client"

import type {
    TimeSession,
    ActiveTimer,
} from "../types/timer"


export async function startTimer(
    taskId: number
): Promise<TimeSession> {

    const response = await client.post(
        `/timer/start/${taskId}`
    )

    return response.data
}


export async function stopTimer(): Promise<TimeSession> {

    const response = await client.post(
        "/timer/stop"
    )

    return response.data
}


export async function getActiveTimer(): Promise<ActiveTimer> {

    const response = await client.get(
        "/timer/active"
    )

    return response.data
}