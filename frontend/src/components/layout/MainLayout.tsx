import {
    NavLink,
} from "react-router-dom"


interface MainLayoutProps {
    children: React.ReactNode
}


function MainLayout({
    children,
}: MainLayoutProps) {

    return (

        <div className="
            min-h-screen
            bg-gray-100
        ">

            <header className="
                bg-white
                shadow-sm
            ">

                <div className="
                    flex
                    items-center
                    justify-between
                    px-8
                    py-4
                ">

                    <h1 className="
                        text-2xl
                        font-bold
                        text-gray-900
                    ">
                        TimeParadox 🚀
                    </h1>


                    <nav className="
                        flex
                        items-center
                        gap-2
                    ">

                        <NavLink
                            to="/"
                            end
                            className={({
                                isActive,
                            }) =>
                                `
                                rounded-lg
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                transition
                                ${
                                    isActive
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }
                                `
                            }
                        >
                            Today
                        </NavLink>


                        <NavLink
                            to="/weekly"
                            className={({
                                isActive,
                            }) =>
                                `
                                rounded-lg
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                transition
                                ${
                                    isActive
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }
                                `
                            }
                        >
                            Weekly
                        </NavLink>

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