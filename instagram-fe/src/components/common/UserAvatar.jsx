import React from "react";
import { Box, Image } from "@chakra-ui/react";

const UserAvatar = ({ src, size = "32px", border = false, hasBorder = true }) => {
    return (
        <Box
            width={size}
            height={size}
            borderRadius="full"
            overflow="hidden"
            flexShrink={0}
            border={hasBorder ? (border ? "2px solid" : "1px solid") : "none"}
            borderColor={hasBorder ? (border ? "#0095f6" : "#dbdbdb") : "transparent"}
            p={hasBorder && border ? "2px" : "0"}
            bg="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Image
                src={src || "https://via.placeholder.com/150"}
                alt="" 
                width="100%"
                height="100%"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/150"
            />
        </Box>
    );
};

export default UserAvatar;
