import React from 'react';
import {
  DialogRoot,
  DialogContent,
  DialogBody,
  DialogPositioner,
  DialogBackdrop,
  VStack,
  Text,
  Box
} from '@chakra-ui/react';

/**
 * Instagram-style Alert Modal
 * Used for system errors or quick notifications.
 */
const InstagramAlert = ({ isOpen, onClose, title, message, buttonText = "OK" }) => {
  return (
    <DialogRoot open={isOpen} onOpenChange={onClose} placement="center">
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent 
          borderRadius="12px" 
          maxW="400px" 
          bg="white" 
          overflow="hidden"
          animation="zoom-in 0.1s ease-out"
        >
          <DialogBody p={0}>
            <VStack gap={0} align="stretch">
              <Box p={8} textAlign="center">
                {title && (
                  <Text fontWeight="bold" fontSize="18px" mb={2} color="black">
                    {title}
                  </Text>
                )}
                <Text fontSize="14px" color="black">
                  {message}
                </Text>
              </Box>

              <Box height="1px" bg="gray.100" />

              <Box 
                as="button" 
                py={3} 
                width="100%" 
                color="#0095f6" 
                fontWeight="bold" 
                fontSize="14px"
                _hover={{ bg: "gray.50" }}
                _active={{ bg: "gray.100" }}
                onClick={onClose}
                transition="background 0.2s"
              >
                {buttonText}
              </Box>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default InstagramAlert;
