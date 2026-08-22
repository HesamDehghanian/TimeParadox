import {
    useEffect,
    useMemo,
    useState,
} from "react"

import {
    getCategories,
} from "../api/categories"

import type {
    Category,
} from "../api/categories"

import type {
    WeeklyPlanItemInput,
} from "../api/weeklyPlans"

import {
    createWeeklyPlan,
    getWeeklyPlan,
    updateWeeklyPlan,
} from "../api/weeklyPlans"

import {
    getTasksByDate,
} from "../api/tasks"

import type {
    Task,
} from "../api/tasks"

import CreateTaskModal from "../components/planner/CreateTaskModal"

const DAY_NAMES = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
]


function getSaturday(
    date: Date
): Date {

    const result = new Date(date)

    const day = result.getDay()

    // JS:
    // Sunday = 0
    // Saturday = 6

    const daysSinceSaturday =
        (day + 1) % 7

    result.setDate(
        result.getDate()
        - daysSinceSaturday
    )

    return result
}


function formatDate(
    date: Date
): string {

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


function formatDisplayDate(
    date: Date
): string {

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
        }
    )
}



function Planner() {

    const [
        categories,
        setCategories,
    ] = useState<Category[]>([])

    const [
        weekStart,
        setWeekStart,
    ] = useState(
        getSaturday(new Date())
    )

    const [
        items,
        setItems,
    ] = useState<
        WeeklyPlanItemInput[]
    >([])

    const [
        planId,
        setPlanId,
    ] = useState<number | null>(
        null
    )

    const [
        loading,
        setLoading,
    ] = useState(true)

    const [
        saving,
        setSaving,
    ] = useState(false)

    const [
        error,
        setError,
    ] = useState<string | null>(
        null
    )


    const weekEnd = useMemo(() => {

        const date =
            new Date(weekStart)

        date.setDate(
            date.getDate() + 6
        )

        return date

    }, [weekStart])


    const weekStartString =
        formatDate(weekStart)

    const [
        taskModal,
        setTaskModal,
    ] = useState<{
        category: Category
        date: string
    } | null>(null)


    const [
        tasks,
        setTasks,
    ] = useState<Task[]>([])

    function getCellTasks(
        categoryId: number,
        dayOfWeek: number
    ): Task[] {

        const date =
            new Date(weekStart)

        date.setDate(
            date.getDate() + dayOfWeek
        )

        const dateString =
            formatDate(date)

        return tasks.filter(
            task =>
                task.category_id
                === categoryId
                &&
                task.date
                === dateString
        )
    }


    async function loadPlanner() {

        try {
            setLoading(true)
            setError(null)

            const categoryData = await getCategories()

            setCategories(
                categoryData.filter(
                    category =>
                        category.is_active
                )
            )
            const weekTasks: Task[] = []

            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {

                const date =
                    new Date(weekStart)

                date.setDate(
                    date.getDate() + dayIndex
                )

                const dateString =
                    formatDate(date)

                const dayTasks =
                    await getTasksByDate(
                        dateString
                    )

                weekTasks.push(
                    ...dayTasks
                )
            }

            setTasks(weekTasks)


            try {
                const plan =
                    await getWeeklyPlan(
                        weekStartString
                    )

                setPlanId(plan.id)

                setItems(
                    plan.items.map(
                        item => ({
                            category_id:
                                item.category_id,

                            day_of_week:
                                item.day_of_week,

                            planned_minutes:
                                item.planned_minutes,
                        })
                    )
                )

            } catch (planError) {
                // 404 means this week
                // has no plan yet.
                setPlanId(null)
                setItems([])
            }

        } catch (error) {

            console.error(error)

            setError(
                "Failed to load planner."
            )

        } finally {

            setLoading(false)

        }
    }


    useEffect(() => {
        loadPlanner()
    }, [weekStartString])


    function changeWeek(
        amount: number
    ) {

        setWeekStart(
            current => {

                const next =
                    new Date(current)

                next.setDate(
                    next.getDate()
                    + amount * 7
                )

                return next
            }
        )
    }


    function getMinutes(
        categoryId: number,
        dayOfWeek: number
    ): number {

        const item =
            items.find(
                current =>
                    current.category_id
                    === categoryId
                    &&
                    current.day_of_week
                    === dayOfWeek
            )

        return item?.planned_minutes ?? 0
    }


    function setMinutes(
        categoryId: number,
        dayOfWeek: number,
        value: number
    ) {

        const safeValue =
            Math.max(
                0,
                Math.floor(value)
            )


        setItems(current => {

            const index =
                current.findIndex(
                    item =>
                        item.category_id
                        === categoryId
                        &&
                        item.day_of_week
                        === dayOfWeek
                )


            if (safeValue === 0) {

                if (index === -1) {
                    return current
                }

                return current.filter(
                    (_, i) =>
                        i !== index
                )
            }


            if (index === -1) {

                return [
                    ...current,
                    {
                        category_id:
                            categoryId,

                        day_of_week:
                            dayOfWeek,

                        planned_minutes:
                            safeValue,
                    },
                ]
            }


            return current.map(
                (item, i) =>
                    i === index
                        ? {
                            ...item,
                            planned_minutes:
                                safeValue,
                        }
                        : item
            )
        })
    }


    function formatMinutes(
        minutes: number
    ): string {

        if (minutes === 0) {
            return "—"
        }

        const hours =
            Math.floor(minutes / 60)

        const mins =
            minutes % 60

        if (hours === 0) {
            return `${mins}m`
        }

        if (mins === 0) {
            return `${hours}h`
        }

        return `${hours}h ${mins}m`
    }


    function getDayTotal(
        dayOfWeek: number
    ): number {

        return items
            .filter(
                item =>
                    item.day_of_week
                    === dayOfWeek
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total
                    + item.planned_minutes,
                0
            )
    }


    function getCategoryTotal(
        categoryId: number
    ): number {

        return items
            .filter(
                item =>
                    item.category_id
                    === categoryId
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total
                    + item.planned_minutes,
                0
            )
    }


    async function handleSave() {

        try {
            setSaving(true)
            setError(null)

            const payload = {
                week_start: weekStartString,
                items,
            }
            let plan
            if (planId === null) {

                plan =
                    await createWeeklyPlan(
                        payload
                    )

            } else {

                plan =
                    await updateWeeklyPlan(
                        weekStartString,
                        payload
                    )
            }


            setPlanId(plan.id)


            await loadPlanner()

        } catch (error) {

            console.error(error)

            setError(
                "Failed to save weekly plan."
            )

        } finally {

            setSaving(false)

        }
    }


    if (loading) {

        return (
            <div className="
                text-xl
                text-gray-600
            ">
                Loading planner...
            </div>
        )
    }


    return (

        <div className="
            mx-auto
            max-w-[1600px]
        ">

            {/* Header */}

            <div className="
                relative
                mb-8
                overflow-hidden
                rounded-3xl
                bg-gray-950
                p-8
                text-white
                shadow-xl
            ">

                <div className="
                    absolute
                    -right-20
                    -top-20
                    h-64
                    w-64
                    rounded-full
                    border
                    border-white/10
                "/>

                <div className="
                    absolute
                    -right-8
                    -top-8
                    h-40
                    w-40
                    rounded-full
                    border
                    border-white/10
                "/>

                <div className="
                    absolute
                    right-24
                    top-12
                    h-2
                    w-2
                    rounded-full
                    bg-white
                "/>

                <div className="
                    relative
                ">

                    <p className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.3em]
                        text-blue-300
                    ">
                        TEMPORAL CONTROL
                    </p>

                    <h1 className="
                        mt-2
                        text-4xl
                        font-bold
                    ">
                        Planner
                    </h1>

                    <p className="
                        mt-3
                        max-w-2xl
                        text-gray-400
                    ">
                        Shape your week before
                        time begins to move.
                    </p>

                </div>

            </div>


            {error && (

                <div className="
                    mb-6
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                ">
                    {error}
                </div>

            )}


            {/* Week selector */}

            <div className="
                mb-6
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-5
                shadow-sm
            ">

                <div>

                    <p className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-widest
                        text-gray-400
                    ">
                        Current Orbit
                    </p>

                    <h2 className="
                        mt-1
                        text-xl
                        font-bold
                        text-gray-900
                    ">
                        {formatDisplayDate(
                            weekStart
                        )}
                        {" — "}
                        {formatDisplayDate(
                            weekEnd
                        )}
                    </h2>

                </div>


                <div className="
                    flex
                    items-center
                    gap-2
                ">

                    <button
                        onClick={() =>
                            changeWeek(-1)
                        }
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-gray-600
                            hover:bg-gray-50
                        "
                    >
                        ← Previous
                    </button>

                    <button
                        onClick={() =>
                            setWeekStart(
                                getSaturday(
                                    new Date()
                                )
                            )
                        }
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-gray-600
                            hover:bg-gray-50
                        "
                    >
                        Today
                    </button>

                    <button
                        onClick={() =>
                            changeWeek(1)
                        }
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-gray-600
                            hover:bg-gray-50
                        "
                    >
                        Next →
                    </button>

                </div>

            </div>


            {/* Planner table */}

            <div className="
                overflow-x-auto
                rounded-2xl
                border
                border-gray-100
                bg-white
                shadow-sm
            ">

                <table className="
                    min-w-[1100px]
                    w-full
                    border-collapse
                ">

                    <thead>

                        <tr className="
                            border-b
                            border-gray-100
                        ">

                            <th className="
                                sticky
                                left-0
                                z-10
                                w-56
                                bg-white
                                px-5
                                py-5
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-gray-400
                            ">
                                Focus
                            </th>


                            {DAY_NAMES.map(
                                (
                                    day,
                                    index
                                ) => {

                                    const date =
                                        new Date(
                                            weekStart
                                        )

                                    date.setDate(
                                        date.getDate()
                                        + index
                                    )

                                    return (

                                        <th
                                            key={day}
                                            className="
                                                min-w-[120px]
                                                px-3
                                                py-5
                                                text-center
                                            "
                                        >

                                            <div className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-gray-400
                                            ">
                                                {day.slice(
                                                    0,
                                                    3
                                                )}
                                            </div>

                                            <div className="
                                                mt-1
                                                text-lg
                                                font-bold
                                                text-gray-900
                                            ">
                                                {
                                                    date.getDate()
                                                }
                                            </div>

                                        </th>
                                    )
                                }
                            )}

                        </tr>

                    </thead>


                    <tbody>

                        {categories.map(
                            category => (

                                <tr
                                    key={
                                        category.id
                                    }
                                    className="
                                        border-b
                                        border-gray-100
                                        last:border-0
                                    "
                                >

                                    {/* Category */}

                                    <td className="
                                        sticky
                                        left-0
                                        z-10
                                        bg-white
                                        px-5
                                        py-4
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-3
                                        ">

                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    text-white
                                                "
                                                style={{
                                                    backgroundColor:
                                                        category.color,
                                                }}
                                            >
                                                {
                                                    category.icon
                                                    || "✦"
                                                }
                                            </div>

                                            <div>

                                                <div className="
                                                    font-semibold
                                                    text-gray-900
                                                ">
                                                    {
                                                        category.name
                                                    }
                                                </div>

                                                <div className="
                                                    text-xs
                                                    text-gray-400
                                                ">
                                                    Total{" "}
                                                    {
                                                        formatMinutes(
                                                            getCategoryTotal(
                                                                category.id
                                                            )
                                                        )
                                                    }
                                                </div>

                                            </div>

                                        </div>

                                    </td>


                                    {/* Days */}

                                    {DAY_NAMES.map(
                                        (
                                            _,
                                            dayIndex
                                        ) => {

                                            const minutes =
                                                getMinutes(
                                                    category.id,
                                                    dayIndex
                                                )

                                            return (

                                                <td
                                                    key={
                                                        dayIndex
                                                    }
                                                    className="
                                                        px-2
                                                        py-4
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            rounded-xl
                                                            p-1
                                                            transition
                                                        "
                                                        style={{
                                                            backgroundColor:
                                                                minutes > 0
                                                                    ? `${category.color}10`
                                                                    : "transparent",
                                                        }}
                                                    >

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="15"
                                                            value={
                                                                minutes
                                                                || ""
                                                            }
                                                            placeholder="0"
                                                            onChange={event =>
                                                                setMinutes(
                                                                    category.id,
                                                                    dayIndex,
                                                                    Number(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            className="
                                                                w-full
                                                                rounded-lg
                                                                border
                                                                border-gray-200
                                                                bg-transparent
                                                                px-2
                                                                py-2
                                                                text-center
                                                                text-sm
                                                                font-semibold
                                                                outline-none
                                                                transition
                                                                focus:border-blue-400
                                                                focus:ring-2
                                                                focus:ring-blue-100
                                                            "
                                                        />

                                                        {getCellTasks(
                                                            category.id,
                                                            dayIndex
                                                        ).map(task => (

                                                            <div
                                                                key={task.id}
                                                                className="
                                                                    mt-2
                                                                    rounded-lg
                                                                    bg-gray-50
                                                                    px-2
                                                                    py-2
                                                                    text-left
                                                                "
                                                            >

                                                                <div className="
                                                                    truncate
                                                                    text-xs
                                                                    font-semibold
                                                                    text-gray-700
                                                                ">
                                                                    {task.title}
                                                                </div>

                                                                <div className="
                                                                    mt-1
                                                                    text-[10px]
                                                                    text-gray-400
                                                                ">
                                                                    {task.planned_minutes}m
                                                                </div>

                                                            </div>

                                                        ))}

                                                        <button
                                                            type="button"
                                                            onClick={() => {

                                                                const date =
                                                                    new Date(weekStart)

                                                                date.setDate(
                                                                    date.getDate()
                                                                    + dayIndex
                                                                )

                                                                setTaskModal({
                                                                    category,
                                                                    date: formatDate(date),
                                                                })
                                                            }}
                                                            className="
                                                                mt-2
                                                                w-full
                                                                rounded-lg
                                                                py-1.5
                                                                text-xs
                                                                font-semibold
                                                                text-gray-400
                                                                transition
                                                                hover:bg-gray-100
                                                                hover:text-gray-700
                                                            "
                                                        >
                                                            + Task
                                                        </button>

                                                        {minutes >
                                                            0 && (

                                                            <div
                                                                className="
                                                                    mt-1
                                                                    text-center
                                                                    text-[10px]
                                                                    font-semibold
                                                                "
                                                                style={{
                                                                    color:
                                                                        category.color,
                                                                }}
                                                            >
                                                                {
                                                                    formatMinutes(
                                                                        minutes
                                                                    )
                                                                }
                                                            </div>

                                                        )}

                                                    </div>

                                                </td>

                                            )
                                        }
                                    )}

                                </tr>

                            )
                        )}


                        {/* Totals */}

                        <tr className="
                            bg-gray-50
                        ">

                            <td className="
                                sticky
                                left-0
                                bg-gray-50
                                px-5
                                py-4
                                text-sm
                                font-bold
                                text-gray-700
                            ">
                                Daily Total
                            </td>


                            {DAY_NAMES.map(
                                (
                                    _,
                                    dayIndex
                                ) => (

                                    <td
                                        key={
                                            dayIndex
                                        }
                                        className="
                                            px-2
                                            py-4
                                            text-center
                                        "
                                    >

                                        <span className="
                                            text-sm
                                            font-bold
                                            text-gray-700
                                        ">
                                            {
                                                formatMinutes(
                                                    getDayTotal(
                                                        dayIndex
                                                    )
                                                )
                                            }
                                        </span>

                                    </td>

                                )
                            )}

                        </tr>

                    </tbody>

                </table>

            </div>


            {/* Footer */}

            <div className="
                mt-6
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
            ">

                <div className="
                    text-sm
                    text-gray-500
                ">

                    {planId !== null
                        ? "Weekly plan saved."
                        : "This week has not been saved yet."}

                </div>


                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="
                        rounded-xl
                        bg-gray-900
                        px-7
                        py-3
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-gray-800
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {saving
                        ? "Saving..."
                        : "Save Weekly Plan"}
                </button>

            </div>
            {taskModal && (

                <CreateTaskModal
                    category={
                        taskModal.category
                    }
                    date={
                        taskModal.date
                    }
                    onClose={() =>
                        setTaskModal(null)
                    }
                    onCreated={async () => {
                        setTaskModal(null)
                        await loadPlanner()
                    }}
                />

            )}

        </div>

    )
}


export default Planner