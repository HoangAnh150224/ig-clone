import React from 'react';
import { Flex, HStack, Text, Icon, Box } from '@chakra-ui/react';
import { BsGrid3X3, BsBookmark, BsTag } from 'react-icons/bs';

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'posts', label: 'POSTS', icon: BsGrid3X3 },
    { id: 'saved', label: 'SAVED', icon: BsBookmark },
    { id: 'tagged', label: 'TAGGED', icon: BsTag },
  ];

  return (
    <Flex borderTop="1px solid" borderColor="gray.200" justify="center" gap={12}>
      {tabs.map((tab) => (
        <HStack
          key={tab.id}
          py={4}
          cursor="pointer"
          borderTop={activeTab === tab.id ? "1px solid" : "none"}
          borderColor={activeTab === tab.id ? "black" : "transparent"}
          mt="-1px"
          color={activeTab === tab.id ? "black" : "gray.500"}
          onClick={() => setActiveTab(tab.id)}
          gap={2}
          transition="all 0.2s"
        >
          <Icon as={tab.icon} boxSize={3} />
          <Text fontSize="xs" fontWeight="bold" letterSpacing="widest">
            {tab.label}
          </Text>
        </HStack>
      ))}
    </Flex>
  );
};

export default ProfileTabs;
