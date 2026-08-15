interface MainLayoutProps {
    children: React.ReactNode
    currentPage: "today" | "week"
    onNavigate: (page: "today" | "week") => void
}


function MainLayout({
    children,
    currentPage,
    onNavigate,
}: MainLayoutProps) {

    return (

        <div className="
            min-h-screen
            bg-gray-100
        ">

            <header className="
                bg-white
                shadow
                px-8
                py-4
            ">

                <div className="
                    flex
                    items-center
                    justify-between
                ">

                    <h1 className="
                        text-2xl
                        font-bold
                    ">
                        TimeParadox 🚀
                    </h1>


                    <nav className="
                        flex
                        gap-2
                    ">

                        <button
                            onClick={() =>
                                onNavigate("today")
                            }
                            className={`
                                rounded-lg
                                px-4
                                py-2
                                text-sm
                                font-medium
                                transition
                                ${
                                    currentPage === "today"
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }
                            `}
                        >
                            Today
                        </button>


                        <button
                            onClick={() =>
                                onNavigate("week")
                            }
                            className={`
                                rounded-lg
                                px-4
                                py-2
                                text-sm
                                font-medium
                                transition
                                ${
                                    currentPage === "week"
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }
                            `}
                        >
                            Week
                        </button>

                    </nav>

                </div>

            </header>


            <main className="
                p-8
            ">
                {children}
            </main>

        </div>
    )
}


export default MainLayout