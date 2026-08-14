export interface DailyPlanItem {
    category_id: number
    category_name: string
    planned_minutes: number
}


export interface DailyPlan {
    date: string
    day_of_week: number
    day_name: string
    items: DailyPlanItem[]
    total_planned_minutes: number
}