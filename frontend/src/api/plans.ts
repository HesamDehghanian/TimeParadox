import client from "./client"

import type { DailyPlan } from "../types/dashboard"


export async function getTodayPlan(): Promise<DailyPlan> {

    const response = await client.get(
        "/plans/today"
    )

    return response.data
}