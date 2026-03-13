import React from "react";
import { Box, Button, Center, Heading, Text, VStack } from "@chakra-ui/react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Center h="100vh" w="100vw" bg="bg.default">
                    <Box
                        p={8}
                        shadow="md"
                        borderWidth="1px"
                        borderRadius="xl"
                        bg="bg.panel"
                        maxW="md"
                        textAlign="center"
                    >
                        <VStack gap={4}>
                            <Heading size="lg" color="red.500">
                                Oops! Something wrong happened.
                            </Heading>
                            <Text color="fg.muted">
                                The application encountered an unexpected error. Please reload the page.
                            </Text>
                            <Button
                                colorScheme="blue"
                                onClick={() => window.location.reload()}
                            >
                                Reload page
                            </Button>
                        </VStack>
                    </Box>
                </Center>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
