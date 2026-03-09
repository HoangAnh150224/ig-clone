import React from 'react'
import { IoReorderThreeOutline } from "react-icons/io5"
import { mainu } from './SideBarConfig'
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import CreatePostModal from './Post/CreatePostModal';

const Sidebar = () => {
    const [activeTab, setActiveTab] = React.useState();
    const navigate = useNavigate();
    const { open, onOpen, onClose } = useDisclosure();
    const handleTabClick = (title) => {
        setActiveTab(title);
        if (title === "Create") {
            onOpen();
            return;
        }
        const item = mainu.find((item) => item.title === title);
        if (item && item.path) {
            navigate(item.path);
        }
    }




    return (
        <div className='sticky top-0 h-[100vh] flex'>
            <div className='flex flex-col justify-between h-full px-10'>
                <div>
                    <div className='pt-10'>
                        <img className='w-40' src="https://i.imgur.com/zqpwkLQ.png" alt="" />
                    </div>
                    <div className='mt-10'>
                        {mainu.map((item) => (
                            <div onClick={() => handleTabClick(item.title)} className='flex items-center mb-5 cursor-pointer text-lg'>
                                {activeTab === item.title ? item.activeIcon : item.icon}
                                <p className={`${activeTab === item.title ? "font-bold" : "font-semibold"}`}>{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex items-center cursor-pointer pb-10'>
                    <IoReorderThreeOutline className="text-2xl" />
                    <p className='ml-5'>More</p>
                </div>

            </div>
            <CreatePostModal isOpen={open} onClose={onClose} />
        </div>
    )
}

export default Sidebar