import type {
    WeeklyDashboardDay,
} from "../../types/weeklyDashboard"


interface WeeklyDayCardProps {
    day: WeeklyDashboardDay
}


function formatMinutes(minutes: number): string {

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) {
        return `${remainingMinutes}m`
    }

    if (remainingMinutes === 0) {
        return `${hours}h`
    }

    return `${hours}h ${remainingMinutes}m`
}


function formatProgress(progress: number): string {

    if (progress === 0) {
        return "0%"
    }

    if (progress < 1) {
        return `${progress.toFixed(1)}%`
    }

    return `${Math.round(progress)}%`
}


function WeeklyDayCard({
    day,
}: WeeklyDayCardProps) {

    const date = new Date(`${day.date}T00:00:00`)

    const formattedDate = date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
        }
    )


    return (

        <div className="
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-sm
        ">

            {/* Day Header */}

            <div className="
                mb-5
            ">

                <h2 className="
                    text-lg
                    font-bold
                    text-gray-900
                ">
                    {day.day_name}
                </h2>

                <p className="
                    mt-1
                    text-sm
                    text-gray-500
                ">
                    {formattedDate}
                </p>

            </div>


            {/* Categories */}

            <div className="
                space-y-5
            ">

                {day.items.map(
                    item => {

                        const progress = Math.min(
                            item.progress_percent,
                            100
                        )


                        return (

                            <div
                                key={item.category_id}
                            >

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                ">

                                    <span className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-gray-800
                                    ">
                                        {item.category_name}
                                    </span>

                                    <span className="
                                        shrink-0
                                        text-xs
                                        font-semibold
                                        text-gray-500
                                    ">
                                        {
                                            formatProgress(
                                                item.progress_percent
                                            )
                                        }
                                    </span>

                                </div>


                                <div className="
                                    mt-2
                                    h-2
                                    overflow-hidden
                                    rounded-full
                                    bg-gray-200
                                ">

                                    <div
                                        className="
                                            h-full
                                            rounded-full
                                            bg-blue-500
                                            transition-all
                                            duration-500
                                        "
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />

                                </div>


                                <div className="
                                    mt-1
                                    flex
                                    justify-between
                                    text-xs
                                ">

                                    <span className="
                                        text-gray-500
                                    ">
                                        {
                                            formatMinutes(
                                                item.actual_minutes
                                            )
                                        }
                                        {" / "}
                                        {
                                            formatMinutes(
                                                item.planned_minutes
                                            )
                                        }
                                    </span>

                                    <span className="
                                        text-gray-400
                                    ">
                                        {
                                            formatMinutes(
                                                item.remaining_minutes
                                            )
                                        }
                                        {" left"}
                                    </span>

                                </div>

                            </div>

                        )
                    }
                )}

            </div>

        </div>

    )
}


export default WeeklyDayCard