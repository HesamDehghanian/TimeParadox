import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"

interface MainLayoutProps {
    children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
    const location = useLocation()

    const navItems = [
        {
            label: "Today",
            path: "/",
        },
        {
            label: "Weekly",
            path: "/weekly",
        },
        {
            label: "Categories",
            path: "/categories",
        },
    ]

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-gray-900"
                    >
                        TimeParadox 🚀
                    </Link>

                    <nav className="flex items-center gap-2">
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                        isActive
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl p-8">{children}</main>
        </div>
    )
}

export default MainLayout