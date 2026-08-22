import {
    useState,
} from "react"

import type {
    Category,
} from "../../api/categories"

import {
    createTask,
} from "../../api/tasks"


interface CreateTaskModalProps {

    category: Category
    date: string

    onClose: () => void

    onCreated: () => void
}


function CreateTaskModal({
    category,
    date,
    onClose,
    onCreated,
}: CreateTaskModalProps) {

    const [title, setTitle] =
        useState("")

    const [description, setDescription] =
        useState("")

    const [plannedMinutes, setPlannedMinutes] =
        useState(60)

    const [saving, setSaving] =
        useState(false)

    const [error, setError] =
        useState<string | null>(null)


    async function handleSubmit(
        event: React.FormEvent
    ) {

        event.preventDefault()

        if (!title.trim()) {

            setError(
                "Task title is required."
            )

            return
        }


        try {

            setSaving(true)
            setError(null)


            await createTask({

                category_id:
                    category.id,

                title:
                    title.trim(),

                description:
                    description.trim(),

                date,

                planned_minutes:
                    plannedMinutes,
            })


            onCreated()

        } catch (error) {

            console.error(error)

            setError(
                "Failed to create task."
            )

        } finally {

            setSaving(false)

        }
    }


    return (

        <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
            backdrop-blur-sm
        ">

            <div className="
                w-full
                max-w-lg
                rounded-3xl
                bg-white
                p-6
                shadow-2xl
            ">

                <div className="
                    mb-6
                    flex
                    items-start
                    justify-between
                ">

                    <div>

                        <div className="
                            mb-2
                            flex
                            items-center
                            gap-2
                        ">

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
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

                            <span className="
                                text-sm
                                font-semibold
                                text-gray-500
                            ">
                                {category.name}
                            </span>

                        </div>

                        <h2 className="
                            text-2xl
                            font-bold
                            text-gray-900
                        ">
                            Create Task
                        </h2>

                    </div>


                    <button
                        onClick={onClose}
                        className="
                            rounded-lg
                            px-3
                            py-2
                            text-gray-400
                            hover:bg-gray-100
                            hover:text-gray-700
                        "
                    >
                        ✕
                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="
                        space-y-5
                    "
                >

                    <div>

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">
                            Task title
                        </label>

                        <input
                            value={title}
                            onChange={event =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            placeholder="
                                e.g. Build RAG pipeline
                            "
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-400
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    <div>

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={event =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            rows={3}
                            placeholder="
                                What do you want to accomplish?
                            "
                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-gray-200
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-400
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    <div>

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">
                            Planned time
                        </label>

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <input
                                type="number"
                                min="15"
                                step="15"
                                value={
                                    plannedMinutes
                                }
                                onChange={event =>
                                    setPlannedMinutes(
                                        Math.max(
                                            15,
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            )
                                        )
                                    )
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-gray-200
                                    px-4
                                    py-3
                                    outline-none
                                    focus:border-blue-400
                                "
                            />

                            <span className="
                                text-sm
                                text-gray-500
                            ">
                                minutes
                            </span>

                        </div>

                    </div>


                    <div className="
                        rounded-xl
                        bg-gray-50
                        px-4
                        py-3
                        text-sm
                        text-gray-500
                    ">

                        Date:
                        {" "}
                        <span className="
                            font-semibold
                            text-gray-700
                        ">
                            {date}
                        </span>

                    </div>


                    {error && (

                        <div className="
                            rounded-xl
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-600
                        ">
                            {error}
                        </div>

                    )}


                    <div className="
                        flex
                        justify-end
                        gap-3
                        pt-2
                    ">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                rounded-xl
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-gray-600
                                hover:bg-gray-100
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                rounded-xl
                                bg-gray-900
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-gray-800
                                disabled:opacity-50
                            "
                        >
                            {
                                saving
                                    ? "Creating..."
                                    : "Create Task"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}


export default CreateTaskModal