import {
    useEffect,
    useState
} from "react"


import TimeCard from "../components/dashboard/TimeCard"

import {
    getTodayPlan
} from "../api/plans"


import type {
    DailyPlan
} from "../types/dashboard"

import Timer from "../components/timer/Timer"

import TaskSelector from "../components/timer/TaskSelector"

import {
    getTasks,
} from "../api/tasks"

import type {
    Task,
} from "../api/tasks"


function Dashboard() {

    const [plan, setPlan] = useState<DailyPlan | null>(null)

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState<string | null>(null)

    const [tasks, setTasks] = useState<Task[]>([])

    const [selectedTaskId, setSelectedTaskId] =
        useState<number | null>(null)


    // -------------------------
    // Load today's plan
    // -------------------------

    async function loadPlan() {

        try {

            const data = await getTodayPlan()

            setPlan(data)

        } catch (error) {

            console.error(error)

            setError(
                "Failed to load today's plan"
            )

        } finally {

            setLoading(false)

        }
    }


    // -------------------------
    // Reload plan after timer stop
    // -------------------------

    async function reloadPlan() {

        try {

            const data = await getTodayPlan()

            setPlan(data)

        } catch (error) {

            console.error(
                "Failed to reload today's plan",
                error
            )

        }
    }


    // -------------------------
    // Initial plan load
    // -------------------------

    useEffect(() => {

        loadPlan()

    }, [])


    // -------------------------
    // Load tasks
    // -------------------------

    useEffect(() => {

        async function loadTasks() {

            try {

                const data = await getTasks(
                    plan?.date
                )

                setTasks(data)

            } catch (error) {

                console.error(
                    "Failed to load tasks",
                    error
                )

            }

        }


        if (plan) {

            loadTasks()

        }

    }, [plan])


    // -------------------------
    // Loading
    // -------------------------

    if (loading) {

        return (
            <h2 className="text-xl">
                Loading...
            </h2>
        )

    }


    // -------------------------
    // Error
    // -------------------------

    if (error) {

        return (
            <h2 className="text-red-500">
                {error}
            </h2>
        )

    }


    // -------------------------
    // No plan
    // -------------------------

    if (!plan) {

        return null

    }


    // -------------------------
    // UI
    // -------------------------

    return (

        <div>

            <div className="mb-8">

                <h1 className="
                    text-3xl
                    font-bold
                ">
                    {plan.day_name}'s Plan
                </h1>


                <p className="
                    text-gray-600
                    mt-2
                ">
                    Total Planned:
                    {" "}
                    {Math.floor(
                        plan.total_planned_minutes / 60
                    )}
                    h
                    {" "}
                    {
                        plan.total_planned_minutes % 60
                    }
                    m
                </p>

            </div>


            {/* Task Selector */}

            <div className="
                mb-4
                max-w-xl
            ">

                <TaskSelector
                    tasks={tasks}
                    selectedTaskId={selectedTaskId}
                    onSelect={setSelectedTaskId}
                />

            </div>


            {/* Timer */}

            <div className="mb-8">

                <Timer
                    taskId={selectedTaskId}
                    onTimerStopped={reloadPlan}
                />

            </div>


            {/* Time Cards */}

            <div className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-6
            ">

                {
                    plan.items.map(
                        item => (

                            <TimeCard
                                key={item.category_id}
                                category_name={
                                    item.category_name
                                }
                                planned_minutes={
                                    item.planned_minutes
                                }
                                actual_minutes={
                                    item.actual_minutes
                                }
                                remaining_minutes={
                                    item.remaining_minutes
                                }
                                progress_percent={
                                    item.progress_percent
                                }
                            />

                        )
                    )
                }

            </div>

        </div>

    )
}


export default Dashboard