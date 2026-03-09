import React from "react";
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogBody,
  DialogPositioner,
} from "@chakra-ui/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill, BsEmojiSmile } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import "./CommentModal.css";
import { useState } from "react";

import { BsThreeDots } from "react-icons/bs";
import CommentCard from "./CommentCard";
const CommentModal = ({
  onClose,
  isOpen,
  isSave,
  isPostLiked,
  handlePostLike,
  handleSavePost,
}) => {
  return (
    <DialogRoot
      size={"xl"}
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement="center"
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogBody>
            <div className="flex h-[75vh]">
              <div className="w-[45%] flex flex-col justify-center">
                <img
                  className="max-h-full w-full"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYzEro350kZ_IIV-7C0jbrfb3GIwZ20JJC32LPCrPMcQ&s"
                  alt=""
                />
              </div>
              <div className=" w-[55%] pl-10 flex flex-col h-full">
                <div className="flex justify-between items-center py-5">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="w-9 h-9 rounded-full"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYzEro350kZ_IIV-7C0jbrfb3GIwZ20JJC32LPCrPMcQ&s"
                        alt=""
                      />
                    </div>
                    <div className="ml-2">
                      <p>Username</p>
                    </div>
                  </div>
                  <BsThreeDots />
                </div>
                <hr />
                <div className="comment flex-1">
                  {[1, 1, 1, 1].map((item) => (
                    <CommentCard key={item} />
                  ))}
                </div> 
               <div className="mt-auto w-full">
                 <div className="flex justify-between items-center w-full py-4">
                  <div className="flex items-center space-x-2">
                    {isPostLiked ? (
                      <AiFillHeart
                        className="text-2xl hover:opacity-50 cursor-pointer text-red-500"
                        onClick={handlePostLike}
                      />
                    ) : (
                      <AiOutlineHeart
                        className="text-2xl hover:opacity-50 cursor-pointer"
                        onClick={handlePostLike}
                      />
                    )}
                    <FaRegComment className="text-2xl hover:opacity-50 cursor-pointer" />
                    <RiSendPlaneFill className="text-2xl hover:opacity-50 cursor-pointer" />
                  </div>
                  <div className="cursor-pointer">
                    {isSave ? (
                      <BsBookmarkFill
                        onClick={handleSavePost}
                        className="text-2xl hover:opacity-50 cursor-pointer"
                      />
                    ) : (
                      <BsBookmark
                        onClick={handleSavePost}
                        className="text-2xl hover:opacity-50 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
                <div className="w-full py-2 ">
                  <p>10 likes</p>
                  <p className="opacity-50 py-2 cursor-pointer">1 day ago</p>
                </div>
                  <div className="flex items-center w-full ">
                    <BsEmojiSmile />
                    <input
                      className=" commentInput w-[70%]"
                      type="text"
                      placeholder="Add a comment..."
                    />
                  </div>
               </div>
              </div>
            </div>
          </DialogBody>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};
export default CommentModal;
