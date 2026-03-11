import React, { useState } from "react";
import { Box, Image, HStack } from "@chakra-ui/react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const ImageCarousel = ({ images, height = "100%" }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const next = (e) => {
        e.stopPropagation();
        if (currentIndex < images.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const prev = (e) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    return (
        <Box
            position="relative"
            width="100%"
            height={height}
            overflow="hidden"
            bg="white"
            display="flex"
            alignItems="center"
            group="true"
        >
            <Image
                src={images[currentIndex]}
                alt="Post"
                width="100%"
                height="100%"
                objectFit="cover"
                transition="all 0.3s"
            />

            {images.length > 1 && (
                <>
                    {/* LEFT arrow button - Use Box to ensure display */}
                    {currentIndex > 0 && (
                        <Box
                            position="absolute"
                            left={2}
                            zIndex={10}
                            width="26px"
                            height="26px"
                            borderRadius="full"
                            bg="rgba(255, 255, 255, 0.9)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            onClick={prev}
                            boxShadow="md"
                            _hover={{ bg: "white" }}
                        >
                            <AiOutlineLeft size={16} color="black" />
                        </Box>
                    )}

                    {/* RIGHT arrow button - Use Box to ensure display */}
                    {currentIndex < images.length - 1 && (
                        <Box
                            position="absolute"
                            right={2}
                            zIndex={10}
                            width="26px"
                            height="26px"
                            borderRadius="full"
                            bg="rgba(255, 255, 255, 0.9)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            onClick={next}
                            boxShadow="md"
                            _hover={{ bg: "white" }}
                        >
                            <AiOutlineRight size={16} color="black" />
                        </Box>
                    )}

                    {/* Dots */}
                    <HStack
                        position="absolute"
                        bottom={4}
                        width="100%"
                        justify="center"
                        gap={1.5}
                        zIndex={10}
                    >
                        {images.map((_, i) => (
                            <Box
                                key={i}
                                boxSize="6px"
                                borderRadius="full"
                                bg={
                                    i === currentIndex
                                        ? "#0095f6"
                                        : "whiteAlpha.600"
                                }
                                boxShadow="0 0 2px rgba(0,0,0,0.3)"
                                transition="all 0.2s"
                            />
                        ))}
                    </HStack>
                </>
            )}
        </Box>
    );
};

export default ImageCarousel;
