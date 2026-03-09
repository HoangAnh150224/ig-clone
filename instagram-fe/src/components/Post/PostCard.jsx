import React, { useState } from "react";
import {
  BsBookmark,
  BsBookmarkFill,
  BsEmojiSmile,
  BsThreeDots,
} from "react-icons/bs";
import "./PostCard.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import CommentModal from "../Comment/CommentModal";
import { useDisclosure } from "@chakra-ui/react";

const PostCard = () => {
  const [showDropDown, setShowDropdown] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSavePost = () => {
    setIsSave(!isSave);
  };

  const handleClick = () => {
    setShowDropdown(!showDropDown);
  };
  const handlePostLike = () => {
    setIsPostLiked(!isPostLiked);
  };

  const handleOpenCommentModal = () => {
    onOpen();
  };
  return (
    <div>
      <div className="border rounded-md w-full">
        <div className="flex justify-between items-center w-full py-4 px-5">
          <div className="flex items-center">
            <img
              className="w-12 h-12 rounded-full"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaZwCGQB5JmsN1k6A73FbcBNO2dEbBzzUDlaY4C47Igd2AXwRYZ01VAV4&s"
              alt=""
            />
            <div className="pl-2">
              <p className="font-semibold text-sm">Username</p>
              <p className="font-thin text-sm">location</p>
            </div>
          </div>
          <div className="dropdown">
            <BsThreeDots className="dost" onClick={handleClick} />
            <div className="dropdown-content ">
              {showDropDown && (
                <p className="bg-black text-white py-1 px-4 rounded-md cursor-pointer">
                  Delete
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full">
          <img
            className="w-full"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaZwCGQB5JmsN1k6A73FbcBNO2dEbBzzUDlaY4C47Igd2AXwRYZ01VAV4&s"
            alt=""
          />
        </div>
        <div className="flex justify-between items-center w-full py-4 px-5">
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
            <FaRegComment
              className="text-2xl hover:opacity-50 cursor-pointer"
              onClick={handleOpenCommentModal}
            />
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
        <div className="w-full py-2 px-5">
          <p>10 likes</p>
          <p
            className="opacity-50 py-2 cursor-pointer"
            onClick={() => setIsCommentOpen(true)}
          >
            view all 10 comments
          </p>
        </div>
        <div className="border border-t w-full">
          <div className="flex w-full items-center px-5">
            <BsEmojiSmile />
            <input
              className="commentInput"
              type="text"
              placeholder="Add a comment..."
            />
          </div>
        </div>
      </div>
      <CommentModal
        handlePostLike={handlePostLike}
        onClose={onClose}
        isOpen={isOpen}
        handleSavePost={handleSavePost}
        isPostLiked={isPostLiked}
        isSave={isSave}
      />
    </div>
  );
};

export default PostCard;
