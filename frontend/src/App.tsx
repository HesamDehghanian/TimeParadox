import {
    useState,
} from "react"

import Dashboard from "./pages/Dashboard"

import WeeklyDashboard from "./pages/WeeklyDashboard"

import MainLayout from "./components/layout/MainLayout"


function App() {

    const [currentPage, setCurrentPage] =
        useState<"today" | "week">("today")


    return (

        <MainLayout
            currentPage={currentPage}
            onNavigate={setCurrentPage}
        >

            {
                currentPage === "today"
                    ? <Dashboard />
                    : <WeeklyDashboard />
            }

        </MainLayout>
    )
}


export default App