export interface DailyPlanItem {
    category_id: number
    category_name: string

    planned_minutes: number
    actual_minutes: number
    remaining_minutes: number
    progress_percent: number
}


export interface DailyPlan {
    date: string
    day_of_week: number
    day_name: string

    items: DailyPlanItem[]

    total_planned_minutes: number
    total_actual_minutes: number
    total_remaining_minutes: number
    total_progress_percent: number
}