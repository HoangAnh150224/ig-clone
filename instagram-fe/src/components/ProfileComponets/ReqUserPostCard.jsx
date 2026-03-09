import React from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { FaComment } from 'react-icons/fa'
import './ReqUserPostCard.css'


const ReqUserPostCard = () => {
    return (
        <div className='p-2'>
            <div className='post w-60 h-60'>
                <img className='cursor-pointer' src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg" alt="" />
                <div className='overlay'>
                    <div className='overlay-text flex justify-between'>
                        <div>
                            <AiFillHeart /> <span>100</span>
                        </div>
                        <div>
                            <FaComment /> <span>50</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ReqUserPostCard
