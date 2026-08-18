import {
    useEffect,
    useState,
} from "react"

import {
    getActiveTimer,
    startTimer,
    stopTimer,
} from "../../api/timer"

import type {
    ActiveTimer,
} from "../../types/timer"


// interface TimerProps {
//     taskId: number | null
//     onTimerStopped?: () => void
// }
interface TimerProps {
    taskId: number | null
    onTimerStopped?: () => void
    onElapsedChange?: (elapsedSeconds: number) => void
}


function formatTime(totalSeconds: number) {

    const hours = Math.floor(
        totalSeconds / 3600
    )

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    )

    const seconds = totalSeconds % 60


    return [
        hours,
        minutes,
        seconds,
    ]
        .map(
            value =>
                String(value).padStart(2, "0")
        )
        .join(":")
}

function Timer({
    taskId,
    onTimerStopped,
    onElapsedChange,
}: TimerProps) {

    const [
        timer,
        setTimer,
    ] = useState<ActiveTimer | null>(null)


    const [
        loading,
        setLoading,
    ] = useState(true)


    const [
        actionLoading,
        setActionLoading,
    ] = useState(false)



    useEffect(() => {

        async function loadTimer() {

            try {

                const data =
                    await getActiveTimer()

                setTimer(data)
                if (
                    data.active &&
                    data.elapsed_seconds !== null
                ) {
                    onElapsedChange?.(
                        data.elapsed_seconds
                    )
                }

            }
            finally {

                setLoading(false)

            }
        }


        loadTimer()

    }, [])



    useEffect(() => {

        if (
            !timer?.active ||
            timer.elapsed_seconds === null
        ) {
            return
        }


        const interval =
            window.setInterval(() => {

                setTimer(
                    current => {

                        if (
                            !current ||
                            !current.active ||
                            current.elapsed_seconds === null
                        ) {
                            return current
                        }


                        const nextElapsed =
                            current.elapsed_seconds + 1

                        onElapsedChange?.(nextElapsed)

                        return {
                            ...current,
                            elapsed_seconds: nextElapsed,
                        }

                    }
                )

            }, 1000)


        return () => {
            window.clearInterval(interval)
        }

    }, [timer?.active])



    async function handleStart() {

        if (taskId === null) {
            return
        }


        try {

            setActionLoading(true)

            const session =
                await startTimer(taskId)


            setTimer({
                active: true,
                task_id: session.task_id,
                session_id: session.id,
                started_at: session.started_at,
                elapsed_seconds: 0,
            })
            onElapsedChange?.(0)

        }
        finally {

            setActionLoading(false)

        }

    }



    async function handleStop() {

        try {

            setActionLoading(true)

            await stopTimer()
            onElapsedChange?.(0)

            setTimer({
                active: false,
                task_id: null,
                session_id: null,
                started_at: null,
                elapsed_seconds: null,
            })
            onTimerStopped?.()

        }
        finally {

            setActionLoading(false)

        }

    }



    if (loading) {

        return (
            <div>
                Loading timer...
            </div>
        )

    }



    const elapsedSeconds =
        timer?.elapsed_seconds ?? 0



    return (

        <div className="
            rounded-2xl
            bg-white
            p-8
            shadow-sm
            border
            border-gray-100
            text-center
        ">

            <h2 className="
                text-lg
                font-semibold
                text-gray-700
            ">
                {timer?.active
                    ? "Timer Running"
                    : "Ready to focus?"}
            </h2>


            <div className="
                mt-6
                text-6xl
                font-mono
                font-bold
                tracking-wider
                text-gray-900
            ">
                {formatTime(elapsedSeconds)}
            </div>


            <div className="mt-8">

                {timer?.active ? (

                    <button
                        onClick={handleStop}
                        disabled={actionLoading}
                        className="
                            rounded-xl
                            bg-red-500
                            px-8
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-red-600
                            disabled:opacity-50
                        "
                    >
                        {actionLoading
                            ? "Stopping..."
                            : "STOP"}
                    </button>

                ) : (

                    <button
                        onClick={handleStart}
                        disabled={
                            actionLoading ||
                            taskId === null
                        }
                        className="
                            rounded-xl
                            bg-blue-500
                            px-8
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-blue-600
                            disabled:opacity-50
                        "
                    >
                        {actionLoading
                            ? "Starting..."
                            : "START"}
                    </button>

                )}

            </div>


            {!timer?.active &&
                taskId === null && (

                    <p className="
                        mt-4
                        text-sm
                        text-gray-500
                    ">
                        Select a task first
                    </p>

                )}

        </div>

    )
}


export default Timer