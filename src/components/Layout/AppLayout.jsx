import { Outlet } from "react-router-dom"
import Sidebar from "../UI/SideBar"

export const AppLayout = () => {
    return (
        <>
            <div className="flex">
                <Sidebar />
                <main className="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
                    <Outlet />
                </main>
            </div>
            );
        </>
    )
}