import React from "react";
import Sidebar from "../components/layout/Sidebar";
import CreatePostModal from "../components/modals/CreatePostModal";

const MainLayout = ({ children }) => {
    return (
        <div className="flex bg-white min-h-screen">
            {/* Sidebar fixed */}
            <Sidebar />

            {/* Main Content Area - Flexible and stretches */}
            <main className="flex-1 bg-white text-black flex flex-col">
                {children}
            </main>

            {/* Global Modals */}
            <CreatePostModal />
        </div>
    );
};

export default MainLayout;
