export interface WeeklyDashboardItem {
    category_id: number
    category_name: string

    planned_minutes: number
    actual_minutes: number
    remaining_minutes: number
    progress_percent: number
}


export interface WeeklyDashboardDay {
    date: string
    day_of_week: number
    day_name: string

    items: WeeklyDashboardItem[]
}


export interface WeeklyDashboard {
    week_start: string
    week_end: string

    days: WeeklyDashboardDay[]
}