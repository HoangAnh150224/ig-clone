import React from 'react'
import { ProfileUserDetails, ReqUserPostPart } from '../../components/ProfileComponets'

const Profile = () => {
    return (
        <div className='px-20'>
            <div>
                <ProfileUserDetails/>
            </div>
            <div>
                <ReqUserPostPart/>
            </div>
        </div>
    )
}

export default Profile
