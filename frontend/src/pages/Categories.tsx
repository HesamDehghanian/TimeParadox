import {
    useEffect,
    useState,
} from "react"

import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from "../api/categories"

import type {
    Category,
    CreateCategoryData,
} from "../api/categories"


const DEFAULT_FORM: CreateCategoryData = {
    name: "",
    description: "",
    priority: 3,
    color: "#3B82F6",
    icon: "✦",
    is_active: true,
}


function Categories() {

    const [
        categories,
        setCategories,
    ] = useState<Category[]>([])

    const [
        loading,
        setLoading,
    ] = useState(true)

    const [
        error,
        setError,
    ] = useState<string | null>(null)

    const [
        form,
        setForm,
    ] = useState<CreateCategoryData>(
        DEFAULT_FORM
    )

    const [
        editingId,
        setEditingId,
    ] = useState<number | null>(null)

    const [
        saving,
        setSaving,
    ] = useState(false)


    async function loadCategories() {

        try {

            setLoading(true)
            setError(null)

            const data = await getCategories()

            setCategories(data)

        } catch (error) {

            console.error(error)

            setError(
                "Failed to load categories."
            )

        } finally {

            setLoading(false)

        }
    }


    useEffect(() => {
        loadCategories()
    }, [])


    function resetForm() {

        setForm({
            ...DEFAULT_FORM,
        })

        setEditingId(null)
    }


    function handleChange(
        field: keyof CreateCategoryData,
        value: string | number | boolean
    ) {

        setForm(current => ({
            ...current,
            [field]: value,
        }))
    }


    function startEditing(
        category: Category
    ) {

        setEditingId(category.id)

        setForm({
            name: category.name,
            description: category.description ?? "",
            priority: category.priority,
            color: category.color,
            icon: category.icon ?? "✦",
            is_active: category.is_active,
        })

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }


    async function handleSubmit(
        event: React.FormEvent
    ) {

        event.preventDefault()

        if (!form.name.trim()) {
            return
        }

        try {

            setSaving(true)
            setError(null)

            if (editingId === null) {

                await createCategory({
                    ...form,
                    name: form.name.trim(),
                })

            } else {

                await updateCategory(
                    editingId,
                    {
                        ...form,
                        name: form.name.trim(),
                    }
                )
            }

            resetForm()

            await loadCategories()

        } catch (error) {

            console.error(error)

            setError(
                "Failed to save category."
            )

        } finally {

            setSaving(false)

        }
    }


    async function handleDelete(
        category: Category
    ) {

        const confirmed = window.confirm(
            `Delete "${category.name}"?`
        )

        if (!confirmed) {
            return
        }

        try {

            setError(null)

            await deleteCategory(
                category.id
            )

            if (editingId === category.id) {
                resetForm()
            }

            await loadCategories()

        } catch (error) {

            console.error(error)

            setError(
                "Failed to delete category."
            )

        }
    }


    async function toggleActive(
        category: Category
    ) {

        try {

            await updateCategory(
                category.id,
                {
                    is_active:
                        !category.is_active,
                }
            )

            await loadCategories()

        } catch (error) {

            console.error(error)

            setError(
                "Failed to update category."
            )
        }
    }


    if (loading) {

        return (
            <div className="text-xl">
                Loading categories...
            </div>
        )
    }


    return (

        <div className="
            mx-auto
            max-w-7xl
        ">

            {/* Header */}

            <div className="
                mb-10
                relative
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

                <div
                    className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/10"
                />

                <div className="
                    absolute
                    bottom-6
                    right-24
                    h-3
                    w-3
                    rounded-full
                    bg-white
                "/>

                <div className="
                    absolute
                    right-16
                    top-12
                    h-2
                    w-2
                    rounded-full
                    bg-blue-300
                "/>

                <p className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-blue-300
                ">
                    TIME / SPACE
                </p>

                <h1 className="
                    mt-3
                    text-4xl
                    font-bold
                    tracking-tight
                ">
                    Your Universe
                </h1>

                <p className="
                    mt-3
                    max-w-2xl
                    text-gray-400
                ">
                    The areas of your life that currently
                    occupy your time, attention and energy.
                </p>

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


            {/* Create / Edit */}

            <div className="
                mb-10
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-6
                shadow-sm
            ">

                <div className="
                    mb-6
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <p className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-widest
                            text-gray-400
                        ">
                            {editingId
                                ? "Modify Orbit"
                                : "New Orbit"}
                        </p>

                        <h2 className="
                            mt-1
                            text-2xl
                            font-bold
                            text-gray-900
                        ">
                            {editingId
                                ? "Edit Category"
                                : "Create Category"}
                        </h2>

                    </div>

                    {editingId !== null && (

                        <button
                            type="button"
                            onClick={resetForm}
                            className="
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                font-semibold
                                text-gray-500
                                hover:bg-gray-100
                            "
                        >
                            Cancel
                        </button>

                    )}

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="
                        grid
                        grid-cols-1
                        gap-5
                        md:grid-cols-2
                    "
                >

                    {/* Name */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">
                            Name
                        </label>

                        <input
                            value={form.name}
                            onChange={event =>
                                handleChange(
                                    "name",
                                    event.target.value
                                )
                            }
                            placeholder="AI Engineer"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                px-4
                                py-3
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    {/* Priority */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">
                            Priority
                        </label>

                        <select
                            value={form.priority}
                            onChange={event =>
                                handleChange(
                                    "priority",
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                px-4
                                py-3
                                outline-none
                            "
                        >

                            <option value={1}>
                                1 — Low
                            </option>

                            <option value={2}>
                                2
                            </option>

                            <option value={3}>
                                3 — Medium
                            </option>

                            <option value={4}>
                                4
                            </option>

                            <option value={5}>
                                5 — Critical
                            </option>

                        </select>

                    </div>


                    {/* Description */}

                    <div className="md:col-span-2">

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
                            value={
                                form.description ?? ""
                            }
                            onChange={event =>
                                handleChange(
                                    "description",
                                    event.target.value
                                )
                            }
                            rows={3}
                            placeholder="What does this area represent?"
                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-gray-200
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>


                    {/* Color */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">
                            Orbit Color
                        </label>

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <input
                                type="color"
                                value={form.color}
                                onChange={event =>
                                    handleChange(
                                        "color",
                                        event.target.value
                                    )
                                }
                                className="
                                    h-12
                                    w-16
                                    cursor-pointer
                                    rounded-xl
                                    border-0
                                    bg-transparent
                                "
                            />

                            <span className="
                                font-mono
                                text-sm
                                text-gray-500
                            ">
                                {form.color}
                            </span>

                        </div>

                    </div>


                    {/* Icon */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">
                            Symbol
                        </label>

                        <input
                            value={form.icon ?? ""}
                            onChange={event =>
                                handleChange(
                                    "icon",
                                    event.target.value
                                )
                            }
                            placeholder="✦"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                px-4
                                py-3
                                outline-none
                            "
                        />

                    </div>


                    {/* Active */}

                    <label className="
                        flex
                        cursor-pointer
                        items-center
                        gap-3
                        md:col-span-2
                    ">

                        <input
                            type="checkbox"
                            checked={
                                form.is_active
                            }
                            onChange={event =>
                                handleChange(
                                    "is_active",
                                    event.target.checked
                                )
                            }
                            className="
                                h-4
                                w-4
                            "
                        />

                        <span className="
                            text-sm
                            font-medium
                            text-gray-700
                        ">
                            Active category
                        </span>

                    </label>


                    <div className="
                        md:col-span-2
                    ">

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                !form.name.trim()
                            }
                            className="
                                rounded-xl
                                bg-gray-900
                                px-6
                                py-3
                                font-semibold
                                text-white
                                transition
                                hover:bg-gray-800
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Save Changes"
                                    : "Create Category"}
                        </button>

                    </div>

                </form>

            </div>


            {/* Category Universe */}

            <div>

                <div className="
                    mb-5
                    flex
                    items-end
                    justify-between
                ">

                    <div>

                        <p className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-widest
                            text-gray-400
                        ">
                            Active Orbits
                        </p>

                        <h2 className="
                            mt-1
                            text-2xl
                            font-bold
                            text-gray-900
                        ">
                            Current Focus
                        </h2>

                    </div>

                    <span className="
                        text-sm
                        text-gray-500
                    ">
                        {categories.length}{" "}
                        {categories.length === 1
                            ? "category"
                            : "categories"}
                    </span>

                </div>


                {categories.length === 0 ? (

                    <div className="
                        rounded-2xl
                        border
                        border-dashed
                        border-gray-300
                        bg-white
                        p-12
                        text-center
                    ">
                        <div className="
                            text-4xl
                        ">
                            ✦
                        </div>

                        <p className="
                            mt-4
                            font-semibold
                            text-gray-700
                        ">
                            Your universe is empty.
                        </p>

                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                        ">
                            Create your first category above.
                        </p>
                    </div>

                ) : (

                    <div className="
                        grid
                        grid-cols-1
                        gap-5
                        md:grid-cols-2
                        xl:grid-cols-3
                    ">

                        {categories.map(
                            category => (

                                <div
                                    key={category.id}
                                    className="
                                        relative
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-gray-100
                                        bg-white
                                        p-6
                                        shadow-sm
                                        transition
                                        hover:-translate-y-1
                                        hover:shadow-lg
                                    "
                                >

                                    {/* orbit */}

                                    <div
                                        className="
                                            absolute
                                            -right-12
                                            -top-12
                                            h-32
                                            w-32
                                            rounded-full
                                            border
                                            opacity-30
                                        "
                                        style={{
                                            borderColor:
                                                category.color,
                                        }}
                                    />

                                    <div
                                        className="
                                            absolute
                                            -right-4
                                            top-4
                                            h-2
                                            w-2
                                            rounded-full
                                        "
                                        style={{
                                            backgroundColor:
                                                category.color,
                                        }}
                                    />


                                    <div className="
                                        relative
                                        flex
                                        items-start
                                        justify-between
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-4
                                        ">

                                            <div
                                                className="
                                                    flex
                                                    h-12
                                                    w-12
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    text-xl
                                                    text-white
                                                "
                                                style={{
                                                    backgroundColor:
                                                        category.color,
                                                }}
                                            >
                                                {
                                                    category.icon ||
                                                    "✦"
                                                }
                                            </div>

                                            <div>

                                                <h3 className="
                                                    text-lg
                                                    font-bold
                                                    text-gray-900
                                                ">
                                                    {
                                                        category.name
                                                    }
                                                </h3>

                                                <p className="
                                                    text-xs
                                                    font-semibold
                                                    text-gray-400
                                                ">
                                                    Priority{" "}
                                                    {
                                                        category.priority
                                                    } / 5
                                                </p>

                                            </div>

                                        </div>

                                        <span
                                            className="
                                                rounded-full
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-semibold
                                            "
                                            style={{
                                                backgroundColor:
                                                    category.is_active
                                                        ? `${category.color}18`
                                                        : "#F3F4F6",
                                                color:
                                                    category.is_active
                                                        ? category.color
                                                        : "#9CA3AF",
                                            }}
                                        >
                                            {
                                                category.is_active
                                                    ? "Active"
                                                    : "Paused"
                                            }
                                        </span>

                                    </div>


                                    <p className="
                                        relative
                                        mt-5
                                        min-h-10
                                        text-sm
                                        leading-6
                                        text-gray-500
                                    ">
                                        {
                                            category.description ||
                                            "No description."
                                        }
                                    </p>


                                    <div className="
                                        relative
                                        mt-6
                                        flex
                                        items-center
                                        justify-between
                                        border-t
                                        border-gray-100
                                        pt-4
                                    ">

                                        <button
                                            onClick={() =>
                                                toggleActive(
                                                    category
                                                )
                                            }
                                            className="
                                                text-sm
                                                font-semibold
                                                text-gray-500
                                                hover:text-gray-900
                                            "
                                        >
                                            {
                                                category.is_active
                                                    ? "Pause"
                                                    : "Activate"
                                            }
                                        </button>


                                        <div className="
                                            flex
                                            gap-2
                                        ">

                                            <button
                                                onClick={() =>
                                                    startEditing(
                                                        category
                                                    )
                                                }
                                                className="
                                                    rounded-lg
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    font-semibold
                                                    text-gray-600
                                                    hover:bg-gray-100
                                                "
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        category
                                                    )
                                                }
                                                className="
                                                    rounded-lg
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    font-semibold
                                                    text-red-500
                                                    hover:bg-red-50
                                                "
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    )
}


export default Categories