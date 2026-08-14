interface MainLayoutProps {
    children: React.ReactNode
}


function MainLayout({
    children
}: MainLayoutProps) {

    return (
        <div className="min-h-screen bg-gray-100">

            <header className="bg-white shadow px-8 py-4">
                <h1 className="text-2xl font-bold">
                    TimeParadox 🚀
                </h1>
            </header>


            <main className="p-8">
                {children}
            </main>

        </div>
    )
}


export default MainLayout