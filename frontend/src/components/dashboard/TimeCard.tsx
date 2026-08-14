interface TimeCardProps {

    category_name: string

    planned_minutes: number

}


function TimeCard({
    category_name,
    planned_minutes
}: TimeCardProps) {


    const hours = Math.floor(
        planned_minutes / 60
    )

    const minutes =
        planned_minutes % 60


    return (

        <div className="
            bg-white
            rounded-xl
            shadow
            p-6
        ">

            <h2 className="
                text-xl
                font-bold
            ">
                {category_name}
            </h2>


            <p className="
                mt-3
                text-gray-600
            ">
                Planned:
                {" "}
                {hours}h {minutes}m
            </p>


        </div>

    )
}


export default TimeCard