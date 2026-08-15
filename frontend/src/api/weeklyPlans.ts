import client from "./client"

import type {
    WeeklyDashboard,
} from "../types/weeklyDashboard"


export async function getWeeklyDashboard(
    weekStart: string
): Promise<WeeklyDashboard> {

    const response = await client.get(
        `/weekly-plans/${weekStart}/dashboard`
    )

    return response.data
}