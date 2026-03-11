import React, { useState } from "react";
import {
    SimpleGrid,
    Box,
    Image,
    Flex,
    HStack,
    Text,
    Icon,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { BsCollectionPlayFill } from "react-icons/bs";
import PostDetailModal from "../modals/PostDetailModal";

const PostGridItem = ({ post, onClick }) => {
    const isReel = post.type === "reel" || !!post.videoUrl;

    return (
        <Box
            position="relative"
            width="100%"
            pb="100%" // Square for grid
            cursor="pointer"
            role="group"
            overflow="hidden"
            borderRadius="0"
            onClick={() => onClick(post)}
            bg="black"
        >
            <Box position="absolute" top={0} left={0} w="100%" h="100%">
                {isReel ? (
                    <Box
                        as="video"
                        src={post.videoUrl}
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
                        src={post.imageUrl || (post.images && post.images[0])}
                        alt="User post"
                        w="100%"
                        h="100%"
                        objectFit="cover"
                    />
                )}
            </Box>

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

const PostGrid = ({ posts, loading }) => {
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    if (loading)
        return (
            <Box textAlign="center" py={10}>
                Loading posts...
            </Box>
        );
    if (!posts || posts.length === 0)
        return (
            <Box textAlign="center" py={10} fontWeight="bold">
                No Photos Yet
            </Box>
        );

    return (
        <>
            <SimpleGrid columns={3} spacing="4px">
                {posts.map((post) => (
                    <PostGridItem
                        key={post.id}
                        post={post}
                        onClick={handlePostClick}
                    />
                ))}
            </SimpleGrid>

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

export default PostGrid;
