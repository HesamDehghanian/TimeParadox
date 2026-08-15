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



function Dashboard() {


    const [plan, setPlan] = useState<DailyPlan | null>(null)

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState<string | null>(null)



    useEffect(() => {

        async function loadPlan(){

            try {

                const data = await getTodayPlan()

                setPlan(data)

            }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            catch(error){

                setError(
                    "Failed to load today's plan"
                )

            }
            finally{

                setLoading(false)

            }

        }


        loadPlan()

    },[])



    if(loading){

        return (
            <h2 className="text-xl">
                Loading...
            </h2>
        )

    }



    if(error){

        return (
            <h2 className="text-red-500">
                {error}
            </h2>
        )

    }



    if(!plan){

        return null

    }



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
                                category_name={item.category_name}
                                planned_minutes={item.planned_minutes}
                                actual_minutes={item.actual_minutes}
                                remaining_minutes={item.remaining_minutes}
                                progress_percent={item.progress_percent}
                            />

                        )
                    )
                }


            </div>


        </div>

    )
}



export default Dashboard