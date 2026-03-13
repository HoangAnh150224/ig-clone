import React, { useState } from "react";
import {
    Box,
    Image,
    Flex,
    HStack,
    Text,
    Grid,
    GridItem,
    Icon,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { BsCollectionPlayFill } from "react-icons/bs";
import PostDetailModal from "../modals/PostDetailModal";

const ExploreItem = ({ post, onClick }) => {
    const isReel = post.type === "REEL";

    return (
        <Box
            position="relative"
            width="100%"
            height="100%"
            cursor="pointer"
            role="group"
            overflow="hidden"
            borderRadius="0"
            onClick={() => onClick(post)}
            bg="gray.100"
        >
            {isReel ? (
                <Box
                    as="video"
                    src={post.media?.[0]?.url}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                        e.target.pause();
                        e.target.currentTime = 0;
                    }}
                />
            ) : (
                <Image
                    src={post.media?.[0]?.url}
                    alt="Explore post"
                    w="100%"
                    h="100%"
                    objectFit="cover"
                />
            )}

            {/* Reel Icon Indicator */}
            {isReel && (
                <Box
                    position="absolute"
                    top={3}
                    right={3}
                    color="white"
                    zIndex={5}
                    filter="drop-shadow(0 0 2px rgba(0,0,0,0.5))"
                >
                    <Icon as={BsCollectionPlayFill} boxSize={5} />
                </Box>
            )}

            {/* Overlay on Hover */}
            <Flex
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                bg="blackAlpha.600"
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.2s"
                align="center"
                justify="center"
                gap={6}
                color="white"
                zIndex={10}
            >
                <HStack gap={1}>
                    <AiFillHeart size={24} />
                    <Text fontWeight="bold">{post.likeCount || 0}</Text>
                </HStack>
                <HStack gap={1}>
                    <FaComment size={20} />
                    <Text fontWeight="bold">{post.commentCount || 0}</Text>
                </HStack>
            </Flex>
        </Box>
    );
};

const ExploreGrid = ({ posts }) => {
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    return (
        <>
            <Grid
                templateColumns="repeat(3, 1fr)"
                gap="4px"
                autoRows="calc((100vw - 72px - 8px) / 3)" // Sidebar width + total gaps
                gridAutoFlow="dense" // Fill in the gaps (Fix empty gap error)
                maxW="935px"
                mx="auto"
            >
                {Array.from(new Map(posts.map(p => [p.id, p])).values()).map((post, index) => {
                    // Instagram Explore Logic:
                    // Every 10 posts, there are 2 large posts (positions 3 and 6 in the cluster of 10)
                    const isLargeRight = index % 10 === 2;
                    const isLargeLeft = index % 10 === 5;
                    const isLarge = isLargeRight || isLargeLeft;

                    return (
                        <GridItem
                            key={post.id}
                            colSpan={isLarge ? 2 : 1}
                            rowSpan={isLarge ? 2 : 1}
                            overflow="hidden"
                        >
                            <ExploreItem
                                post={post}
                                onClick={handlePostClick}
                            />
                        </GridItem>
                    );
                })}
            </Grid>

            {selectedPost && (
                <PostDetailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    post={selectedPost}
                    isLiked={false}
                    handleLike={() => {}}
                    isSaved={false}
                    handleSave={() => {}}
                />
            )}
        </>
    );
};

export default ExploreGrid;
