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

    const [weekStart, setWeekStart] =
        useState(() => {

            const today = new Date()

            const day = today.getDay()

            const daysSinceSaturday =
                (day + 1) % 7

            const saturday =
                new Date(today)

            saturday.setDate(
                today.getDate()
                - daysSinceSaturday
            )

            return formatDate(saturday)
        })


    function changeWeek(offset: number) {

        const current =
            new Date(
                `${weekStart}T12:00:00`
            )

        current.setDate(
            current.getDate()
            + offset * 7
        )

        setWeekStart(
            formatDate(current)
        )
    }


    useEffect(() => {

        async function loadDashboard() {

            try {

                setLoading(true)
                setError(null)

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

    }, [weekStart])


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

            {/* Header */}

            <div className="
                flex
                items-center
                justify-between
                mb-8
            ">

                <button
                    onClick={() => changeWeek(-1)}
                    className="
                        rounded-xl
                        bg-white
                        px-4
                        py-2
                        shadow-sm
                        border
                        hover:bg-gray-50
                    "
                >
                    ← Previous
                </button>


                <div className="text-center">

                    <h1 className="
                        text-3xl
                        font-bold
                        text-gray-900
                    ">
                        Weekly Dashboard
                    </h1>

                    <p className="
                        mt-2
                        text-gray-500
                    ">
                        {dashboard.week_start}
                        {" → "}
                        {dashboard.week_end}
                    </p>

                </div>


                <button
                    onClick={() => changeWeek(1)}
                    className="
                        rounded-xl
                        bg-white
                        px-4
                        py-2
                        shadow-sm
                        border
                        hover:bg-gray-50
                    "
                >
                    Next →
                </button>

            </div>


            {/* Days */}

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