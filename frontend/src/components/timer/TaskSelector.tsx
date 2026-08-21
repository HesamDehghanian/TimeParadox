import type { Task } from "../../api/tasks"


interface TaskSelectorProps {
    tasks: Task[]
    selectedTaskId: number | null
    onSelect: (taskId: number | null) => void
    disabled?: boolean
}


function TaskSelector({
    tasks,
    selectedTaskId,
    onSelect,
    disabled = false,
}: TaskSelectorProps) {

    return (
        <div>

            <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
            ">
                Task
            </label>

            <select
                value={selectedTaskId ?? ""}
                onChange={(event) => {

                    const value = event.target.value

                    if (!value) {
                        onSelect(null)
                        return
                    }

                    onSelect(Number(value))
                }}
                disabled={disabled}
                className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-gray-900
                    shadow-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:text-gray-400
                "
            >

                <option value="">
                    Select a task...
                </option>

                {tasks.map((task) => (

                    <option
                        key={task.id}
                        value={task.id}
                    >
                        {task.title}
                    </option>

                ))}

            </select>

            {disabled && (

                <p className="
                    mt-2
                    text-sm
                    text-gray-500
                ">
                    Stop the timer before changing the task.
                </p>

            )}

        </div>
    )
}


export default TaskSelector