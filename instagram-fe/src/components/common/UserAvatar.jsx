import React from "react";
import { Box, Image } from "@chakra-ui/react";

const UserAvatar = ({ src, size = "32px", border = false }) => {
    return (
        <Box
            width={size}
            height={size}
            borderRadius="full"
            overflow="hidden"
            border={border ? "2px solid" : "none"}
            borderColor="brand.blue"
            p={border ? "2px" : "0"}
            flexShrink={0}
        >
            <Image
                src={src || "https://via.placeholder.com/150"}
                alt="User Avatar"
                width="100%"
                height="100%"
                objectFit="cover"
            />
        </Box>
    );
};

export default UserAvatar;
