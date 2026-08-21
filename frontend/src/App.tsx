import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import WeeklyDashboard from "./pages/WeeklyDashboard"
import MainLayout from "./components/layout/MainLayout"


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