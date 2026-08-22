import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom"

import MainLayout from "./components/layout/MainLayout"

import Dashboard from "./pages/Dashboard"
import WeeklyDashboard from "./pages/WeeklyDashboard"
import Categories from "./pages/Categories"
import Planner from "./pages/Planner"


function App() {

    return (

        <BrowserRouter>

            <MainLayout>

                <Routes>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/weekly"
                        element={<WeeklyDashboard />}
                    />

                    <Route
                        path="/categories"
                        element={<Categories />}
                    />
                    <Route
                        path="/planner"
                        element={<Planner />}
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/"
                                replace
                            />
                        }
                    />

                </Routes>

            </MainLayout>

        </BrowserRouter>

    )
}


export default App