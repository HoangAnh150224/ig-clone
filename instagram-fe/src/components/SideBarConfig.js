import { AiOutlineHome, AiFillHome, AiOutlineSearch, AiOutlineCompass, AiFillCompass, AiOutlineMessage, AiFillMessage, AiOutlineHeart, AiFillHeart, AiOutlinePlusCircle, AiFillPlusCircle } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { RiVideoLine, RiVideoFill } from 'react-icons/ri'


export const mainu = [
    { title: "Home", icon: <AiOutlineHome></AiOutlineHome>, activeIcon: < AiFillHome></AiFillHome>, path: "/" },
    { title: "Search", icon: < AiOutlineSearch></AiOutlineSearch>, activeIcon: < AiOutlineSearch></AiOutlineSearch>, path: "/search" },
    { title: "Explore", icon: < AiOutlineCompass></AiOutlineCompass>, activeIcon: < AiFillCompass></AiFillCompass>, path: "/explore" },
    { title: "Reels", icon: < RiVideoLine></RiVideoLine>, activeIcon: < RiVideoFill></RiVideoFill>, path: "/reels" },
    {
        title: "Message",
        icon: < AiOutlineMessage></AiOutlineMessage>,
        activeIcon: < AiFillMessage></AiFillMessage>,
        path: "/message"
    },
    {
        title: "Notification",
        icon: < AiOutlineHeart></AiOutlineHeart>,
        activeIcon: < AiFillHeart></AiFillHeart>,
        path: "/notifications"
    },
    {
        title: "Create",
        icon: < AiOutlinePlusCircle></AiOutlinePlusCircle>,
        activeIcon: < AiFillPlusCircle></AiFillPlusCircle>,
        path: "/create"
    },
    {
        title: "Profile",
        icon: < CgProfile></CgProfile>,
        activeIcon: < CgProfile></CgProfile>,
        path: "/profile"
    }
]