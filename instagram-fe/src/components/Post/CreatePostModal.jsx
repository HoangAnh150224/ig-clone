import React from "react";
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogBody,
  DialogPositioner,
  CloseButton,
} from "@chakra-ui/react";
import { FaPhotoVideo } from "react-icons/fa";

const CreatePostModal = ({ onClose, isOpen }) => {
  return (
    <DialogRoot
      size="xl"
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement="center"
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <div className="flex justify-between py-1 px-10 items-center">
            <p>Create new post</p>
            {/* <h2 className="font-semibold"></h2> */}
            <button className="" variant={"ghost"} size="sm" color={"blue"}>
              Share
            </button>
          </div>
          <hr />
          <DialogBody>
            <div>
              <div>
                <div>
                  <FaPhotoVideo className="text-3xl" />
                  <p>Drag photos and videos here</p>
                </div>
              </div>
            </div>
          </DialogBody>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CreatePostModal;
