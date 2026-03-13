import React from "react";
import { Flex, HStack, Text, Icon } from "@chakra-ui/react";
import {
    BsGrid3X3,
    BsBookmark,
    BsBookmarkFill,
    BsCollectionPlay,
    BsCollectionPlayFill,
    BsPersonBoundingBox,
} from "react-icons/bs";

const ProfileTabs = ({ activeTab, setActiveTab, isOwnProfile }) => {
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
            isOwnOnly: true,
        },
        {
            id: "tagged",
            label: "TAGGED",
            icon: BsPersonBoundingBox,
            activeIcon: BsPersonBoundingBox,
        },
    ];

    const visibleTabs = tabs.filter((tab) => !tab.isOwnOnly || isOwnProfile);

    return (
        <Flex
            borderTop="1px solid"
            borderColor="gray.200"
            justify="center"
            gap={12}
        >
            {visibleTabs.map((tab) => {
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
                        color={isActive ? "black" : "gray.500"}
                        onClick={() => setActiveTab(tab.id)}
                        gap={2}
                        transition="all 0.2s"
                    >
                        <Icon
                            as={CurrentIcon}
                            boxSize={3}
                            color={isActive ? "black" : "gray.500"}
                        />
                        <Text
                            fontSize="xs"
                            fontWeight="bold"
                            letterSpacing="widest"
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
