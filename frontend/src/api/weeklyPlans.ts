import client from "./client"

import type {
    WeeklyDashboard,
} from "../types/weeklyDashboard"

export interface WeeklyPlanItem {
    id: number
    category_id: number
    day_of_week: number
    planned_minutes: number
}


export interface WeeklyPlan {
    id: number
    week_start: string
    week_end: string
    items: WeeklyPlanItem[]
}


export interface WeeklyPlanItemInput {
    category_id: number
    day_of_week: number
    planned_minutes: number
}


export interface CreateWeeklyPlanData {
    week_start: string
    items: WeeklyPlanItemInput[]
}

export async function getWeeklyPlan(
    weekStart: string
): Promise<WeeklyPlan> {

    const response = await client.get(
        `/weekly-plans/${weekStart}`
    )

    return response.data
}


export async function createWeeklyPlan(
    data: CreateWeeklyPlanData
): Promise<WeeklyPlan> {

    const response = await client.post(
        "/weekly-plans",
        data
    )

    return response.data
}


export async function updateWeeklyPlanItem(
    itemId: number,
    plannedMinutes: number
): Promise<WeeklyPlan> {

    const response = await client.put(
        `/weekly-plans/items/${itemId}`,
        {
            planned_minutes: plannedMinutes,
        }
    )

    return response.data
}


export async function deleteWeeklyPlanItem(
    itemId: number
): Promise<void> {

    await client.delete(
        `/weekly-plans/items/${itemId}`
    )
}

export async function getWeeklyDashboard(
    weekStart: string
): Promise<WeeklyDashboard> {

    const response =
        await client.get(
            `/weekly-plans/${weekStart}/dashboard`
        )

    return response.data
}

export async function updateWeeklyPlan(
    weekStart: string,
    data: CreateWeeklyPlanData
): Promise<WeeklyPlan> {

    const response =
        await client.put(
            `/weekly-plans/${weekStart}`,
            data
        )

    return response.data
}