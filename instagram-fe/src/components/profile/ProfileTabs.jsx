import React from "react";
import { Flex, HStack, Text, Icon, Box } from "@chakra-ui/react";
import {
    BsGrid3X3,
    BsBookmark,
    BsBookmarkFill,
    BsCollectionPlay,
    BsCollectionPlayFill,
} from "react-icons/bs";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: "posts", label: "POSTS", icon: BsGrid3X3, activeIcon: BsGrid3X3 },
        {
            id: "reels",
            label: "REELS",
            icon: BsCollectionPlay,
            activeIcon: BsCollectionPlayFill,
        },
        {
            id: "saved",
            label: "SAVED",
            icon: BsBookmark,
            activeIcon: BsBookmarkFill,
            activeColor: "#FFD700",
        },
    ];

    return (
        <Flex
            borderTop="1px solid"
            borderColor="gray.200"
            justify="center"
            gap={12}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const CurrentIcon = isActive ? tab.activeIcon : tab.icon;

                return (
                    <HStack
                        key={tab.id}
                        py={4}
                        cursor="pointer"
                        borderTop={isActive ? "1px solid" : "none"}
                        borderColor={isActive ? "black" : "transparent"}
                        mt="-1px"
                        color={
                            isActive ? tab.activeColor || "black" : "gray.500"
                        }
                        onClick={() => setActiveTab(tab.id)}
                        gap={2}
                        transition="all 0.2s"
                    >
                        <Icon
                            as={CurrentIcon}
                            boxSize={3}
                            color={
                                isActive
                                    ? tab.activeColor || "black"
                                    : "gray.500"
                            }
                        />
                        <Text
                            fontSize="xs"
                            fontWeight="bold"
                            letterSpacing="widest"
                            color={isActive ? "black" : "gray.500"}
                        >
                            {tab.label}
                        </Text>
                    </HStack>
                );
            })}
        </Flex>
    );
};

export default ProfileTabs;
