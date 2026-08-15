export interface TimeSession {
    id: number
    task_id: number
    started_at: string
    ended_at: string | null
    duration_seconds: number | null
}


export interface ActiveTimer {
    active: boolean
    task_id: number | null
    session_id: number | null
    started_at: string | null
    elapsed_seconds: number | null
}