interface TimeCardProps {
    category_name: string
    planned_minutes: number
    actual_minutes: number
    remaining_minutes: number
    progress_percent: number
}


function formatMinutes(minutes: number) {

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


function TimeCard({
    category_name,
    planned_minutes,
    actual_minutes,
    remaining_minutes,
    progress_percent,
}: TimeCardProps) {

    return (
        <div className="
            rounded-2xl
            bg-white
            p-6
            shadow-sm
            border
            border-gray-100
        ">

            <div className="
                flex
                items-center
                justify-between
            ">

                <h2 className="
                    text-xl
                    font-bold
                    text-gray-900
                ">
                    {category_name}
                </h2>

                <span className="
                    text-sm
                    font-semibold
                    text-gray-500
                ">
                    {Math.round(progress_percent)}%
                </span>

            </div>


            <div className="
                mt-5
                h-3
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
                        width: `${progress_percent}%`,
                    }}
                />

            </div>


            <div className="
                mt-4
                flex
                justify-between
                text-sm
            ">

                <span className="text-gray-600">
                    {formatMinutes(actual_minutes)}
                    {" / "}
                    {formatMinutes(planned_minutes)}
                </span>

                <span className="text-gray-500">
                    {formatMinutes(remaining_minutes)}
                    {" left"}
                </span>

            </div>

        </div>
    )
}


export default TimeCard