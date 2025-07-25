import {  Outlet, useNavigate } from "react-router-dom"
import Sidebar from "../UI/SideBar"
import { useEffect } from "react";

export const AppLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/today");
    }, [navigate]);
    
    return (
        <>
            <div className="flex">
                <Sidebar />
                <main className="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
                    <Outlet />
                </main>
            </div>
        </>
    );
}