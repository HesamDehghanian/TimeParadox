import {
    useEffect,
    useState,
} from "react"

import WeeklyDayCard from "../components/weekly/WeeklyDayCard"

import {
    getWeeklyDashboard,
} from "../api/weeklyPlans"

import type {
    WeeklyDashboard as WeeklyDashboardData,
} from "../types/weeklyDashboard"

function formatDate(date: Date): string {

    const year =
        date.getFullYear()

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0")

    const day =
        String(
            date.getDate()
        ).padStart(2, "0")

    return `${year}-${month}-${day}`
}

function WeeklyDashboard() {

    const [dashboard, setDashboard] =
    useState<WeeklyDashboardData | null>(null)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState<string | null>(null)


    useEffect(() => {

        async function loadDashboard() {

            try {

                const today = new Date()

                const day = today.getDay()

                const daysSinceSaturday =
                    (day + 1) % 7

                const saturday = new Date(today)

                saturday.setDate(
                    today.getDate()
                    - daysSinceSaturday
                )

                const weekStart =
                    formatDate(saturday)

                const data =
                    await getWeeklyDashboard(
                        weekStart
                    )

                setDashboard(data)

            } catch (error) {

                console.error(error)

                setError(
                    "Failed to load weekly dashboard"
                )

            } finally {

                setLoading(false)

            }

        }

        loadDashboard()

    }, [])


    if (loading) {

        return (
            <h2 className="text-xl">
                Loading...
            </h2>
        )

    }


    if (error) {

        return (
            <h2 className="text-red-500">
                {error}
            </h2>
        )

    }


    if (!dashboard) {

        return null

    }


    return (

        <div>

            <div className="mb-8">

                <h1 className="
                    text-3xl
                    font-bold
                    text-gray-900
                ">
                    This Week
                </h1>

                <p className="
                    mt-2
                    text-gray-500
                ">
                    {
                        dashboard.week_start
                    }
                    {" → "}
                    {
                        dashboard.week_end
                    }
                </p>

            </div>


            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-4
                xl:grid-cols-7
                gap-4
            ">

                {
                    dashboard.days.map(
                        day => (

                            <WeeklyDayCard
                                key={day.date}
                                day={day}
                            />

                        )
                    )
                }

            </div>

        </div>

    )
}


export default WeeklyDashboard