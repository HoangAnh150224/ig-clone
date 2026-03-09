import React from "react";
import { TbCircleDashed } from "react-icons/tb";

export const ProfileUserDetails = () => {
  return (
    <div className="py-10 w-full">
      <div className="flex items-center">
        <div className="w-[15%]">
          <img
            className="w-32 h-32 rounded-full"
            src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/11/tai-hinh-nen-dep-mien-phi.jpg"
            alt=""
          />
        </div>

        <div>
          <div className="flex space-x-10 items-center">
            <h1 className="text-2xl font-bold">Username</h1>
            <button className="ml-5 px-4 py-1 border border-gray-300 rounded text-sm font-semibold">
              Edit Profile
            </button>
            <TbCircleDashed />
          </div>

          <div className="space-y-5 ">
            <div className="flex space-x-10">
              <div>
                <span className="font-semibold mr-2">10</span>
                <span>posts</span>
              </div>
              <div>
                <span className="font-semibold mr-2">5</span>
                <span>followers</span>
              </div>
              <div>
                <span className="font-semibold mr-2">18</span>
                <span>following</span>
              </div>
            </div>
          </div>
          <div >
            <p className="font-semibold">Full Name</p>
            <p className="font-thin text-sm">Tiểu sử</p>
          </div>
        </div>
      </div>
    </div>
  );
};
