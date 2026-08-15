import type { Task } from "../../api/tasks"


interface TaskSelectorProps {
    tasks: Task[]
    selectedTaskId: number | null
    onSelect: (taskId: number) => void
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
                font-medium
                text-gray-700
            ">
                What are you working on?
            </label>


            <select
                value={selectedTaskId ?? ""}
                onChange={(event) => {

                    const value = event.target.value

                    if (!value) {
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
                    outline-none
                    focus:border-blue-500
                    disabled:bg-gray-100
                "
            >

                <option value="">
                    Select a task
                </option>


                {tasks.map(task => (

                    <option
                        key={task.id}
                        value={task.id}
                    >
                        {task.title}
                    </option>

                ))}

            </select>

        </div>
    )
}


export default TaskSelector