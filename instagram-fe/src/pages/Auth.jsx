import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Image,
    VStack,
    Text,
    Input,
    Button,
    HStack,
} from "@chakra-ui/react";
import { AiFillFacebook } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { login, signup, clearError } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import InstagramAlert from "../components/common/InstagramAlert";

import authService from "../services/authService";

const Divider = () => <Box h="1px" bg="gray.200" flex={1} />;

const authImages = [
    "https://www.instagram.com/static/images/homepage/screenshots/screenshot1-2x.png/cfd999368de3.png",
    "https://www.instagram.com/static/images/homepage/screenshots/screenshot2-2x.png/80b3ad71f90b.png",
    "https://www.instagram.com/static/images/homepage/screenshots/screenshot3-2x.png/fe2540681fd5.png",
    "https://www.instagram.com/static/images/homepage/screenshots/screenshot4-2x.png/8e2292e57938.png",
];

const Auth = () => {
    const [view, setView] = useState("login"); // login, signup, forgot-password, reset-password
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        fullName: "",
        otp: "",
        newPassword: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(
        (state) => state.auth,
    );

    // Alert for general system errors
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: "Error",
        message: "",
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % authImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        dispatch(clearError());
    }, [view, dispatch]);

    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (view === "login") {
            dispatch(
                login({
                    identifier: formData.username,
                    password: formData.password,
                }),
            );
        } else if (view === "signup") {
            dispatch(signup(formData));
        } else if (view === "forgot-password") {
            setIsSubmitting(true);
            try {
                await authService.forgotPassword(formData.email);
                setAlertConfig({
                    isOpen: true,
                    title: "Success",
                    message:
                        "If an account exists for this email, we've sent an OTP to reset your password.",
                });
                setView("reset-password");
            } catch (error) {
                setAlertConfig({
                    isOpen: true,
                    title: "Error",
                    message:
                        error.apiResponse?.message ||
                        "Failed to send reset request.",
                });
            } finally {
                setIsSubmitting(false);
            }
        } else if (view === "reset-password") {
            setIsSubmitting(true);
            try {
                await authService.resetPassword({
                    email: formData.email,
                    otp: formData.otp,
                    newPassword: formData.newPassword,
                });
                setAlertConfig({
                    isOpen: true,
                    title: "Success",
                    message:
                        "Password reset successful. You can now log in with your new password.",
                });
                setView("login");
            } catch (error) {
                setAlertConfig({
                    isOpen: true,
                    title: "Error",
                    message:
                        error.apiResponse?.message ||
                        "Failed to reset password.",
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const getFieldError = (fieldName) => {
        if (typeof error === "object" && error?.errors) {
            return error.errors.find((err) => err.field === fieldName)?.message;
        }
        return null;
    };

    const generalErrorMessage =
        typeof error === "string" ? error : error?.message;

    return (
        <Flex h="100vh" align="center" justify="center" bg="white" gap={8}>
            {/* Phone Mockup */}
            <Box
                display={{ base: "none", md: "block" }}
                position="relative"
                width="380px"
                height="580px"
                backgroundImage="url('https://www.instagram.com/static/images/homepage/phones/home-phones-2x.png/cbc7174b121c.png')"
                backgroundSize="468px 634px"
                backgroundPosition="-46px 0"
            >
                <Box position="absolute" top="26px" right="21px">
                    <Image
                        src={authImages[currentImageIndex]}
                        alt="Instagram"
                        width="250px"
                        transition="all 1s ease-in-out"
                    />
                </Box>
            </Box>

            {/* Auth Forms */}
            <VStack gap={3} width="350px">
                <VStack
                    bg="white"
                    p={10}
                    border="1px solid"
                    borderColor="gray.200"
                    width="full"
                    gap={3}
                    align="stretch"
                >
                    <Text
                        fontSize="4xl"
                        fontWeight="bold"
                        textAlign="center"
                        mb={6}
                        fontFamily="cursive"
                        color="black"
                        cursor="pointer"
                        onClick={() => setView("login")}
                    >
                        Instagram
                    </Text>

                    {view === "signup" && (
                        <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="gray.500"
                            textAlign="center"
                            mb={4}
                        >
                            Sign up to see photos and videos from your friends.
                        </Text>
                    )}

                    {view === "forgot-password" && (
                        <VStack mb={4} gap={2}>
                            <Box
                                border="2px solid black"
                                borderRadius="full"
                                p={4}
                            >
                                <LuLock size={40} />
                            </Box>
                            <Text fontWeight="bold" textAlign="center">
                                Trouble Logging In?
                            </Text>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                textAlign="center"
                            >
                                Enter your email and we'll send you an OTP to
                                get back into your account.
                            </Text>
                        </VStack>
                    )}

                    {view === "reset-password" && (
                        <VStack mb={4} gap={2}>
                            <Text fontWeight="bold" textAlign="center">
                                Reset Password
                            </Text>
                            <Text
                                fontSize="xs"
                                color="gray.500"
                                textAlign="center"
                            >
                                Enter the 6-digit OTP sent to your email and
                                your new password.
                            </Text>
                        </VStack>
                    )}

                    <form onSubmit={handleSubmit}>
                        <VStack gap={2} align="stretch">
                            {(view === "signup" ||
                                view === "forgot-password" ||
                                view === "reset-password") && (
                                <Box>
                                    <Input
                                        placeholder="Email"
                                        fontSize="xs"
                                        bg="gray.50"
                                        value={formData.email}
                                        borderColor={
                                            getFieldError("email")
                                                ? "red.400"
                                                : "gray.200"
                                        }
                                        _placeholder={{ color: "gray.400" }}
                                        color="black"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        disabled={view === "reset-password"}
                                    />
                                    {getFieldError("email") && (
                                        <Text
                                            fontSize="10px"
                                            color="red.500"
                                            mt={1}
                                        >
                                            {getFieldError("email")}
                                        </Text>
                                    )}
                                </Box>
                            )}

                            {view === "reset-password" && (
                                <Box>
                                    <Input
                                        placeholder="OTP"
                                        fontSize="xs"
                                        bg="gray.50"
                                        value={formData.otp}
                                        borderColor="gray.200"
                                        _placeholder={{ color: "gray.400" }}
                                        color="black"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                otp: e.target.value,
                                            })
                                        }
                                    />
                                </Box>
                            )}

                            {view === "signup" && (
                                <Box>
                                    <Input
                                        placeholder="Full Name"
                                        fontSize="xs"
                                        bg="gray.50"
                                        borderColor="gray.200"
                                        _placeholder={{ color: "gray.400" }}
                                        color="black"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                fullName: e.target.value,
                                            })
                                        }
                                    />
                                </Box>
                            )}

                            {(view === "login" || view === "signup") && (
                                <Box>
                                    <Input
                                        placeholder="Username"
                                        fontSize="xs"
                                        bg="gray.50"
                                        borderColor={
                                            getFieldError("username")
                                                ? "red.400"
                                                : "gray.200"
                                        }
                                        _placeholder={{ color: "gray.400" }}
                                        color="black"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                username: e.target.value,
                                            })
                                        }
                                    />
                                    {getFieldError("username") && (
                                        <Text
                                            fontSize="10px"
                                            color="red.500"
                                            mt={1}
                                        >
                                            {getFieldError("username")}
                                        </Text>
                                    )}
                                </Box>
                            )}

                            {(view === "login" || view === "signup") && (
                                <Box>
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        fontSize="xs"
                                        bg="gray.50"
                                        borderColor="gray.200"
                                        _placeholder={{ color: "gray.400" }}
                                        color="black"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                password: e.target.value,
                                            })
                                        }
                                    />
                                </Box>
                            )}

                            {view === "reset-password" && (
                                <Box>
                                    <Input
                                        placeholder="New Password"
                                        type="password"
                                        fontSize="xs"
                                        bg="gray.50"
                                        borderColor="gray.200"
                                        _placeholder={{ color: "gray.400" }}
                                        color="black"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                newPassword: e.target.value,
                                            })
                                        }
                                    />
                                </Box>
                            )}

                            <Button
                                type="submit"
                                bg="#0095f6"
                                _hover={{ bg: "#1877f2" }}
                                color="white"
                                width="full"
                                size="sm"
                                fontSize="sm"
                                fontWeight="bold"
                                isLoading={loading || isSubmitting}
                                mt={2}
                            >
                                {view === "login"
                                    ? "Log In"
                                    : view === "signup"
                                      ? "Sign Up"
                                      : view === "forgot-password"
                                        ? "Send Login Link"
                                        : "Reset Password"}
                            </Button>
                        </VStack>
                    </form>

                    {view === "login" && (
                        <>
                            <HStack width="full" my={4}>
                                <Divider />
                                <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    color="gray.500"
                                >
                                    OR
                                </Text>
                                <Divider />
                            </HStack>

                            <Button
                                variant="ghost"
                                color="#385185"
                                fontSize="sm"
                                fontWeight="bold"
                                _hover={{ bg: "transparent" }}
                            >
                                Log in with Facebook
                            </Button>

                            <Text
                                fontSize="xs"
                                textAlign="center"
                                mt={2}
                                cursor="pointer"
                                color="#385185"
                                onClick={() => setView("forgot-password")}
                            >
                                Forgot password?
                            </Text>
                        </>
                    )}

                    {(view === "forgot-password" ||
                        view === "reset-password") && (
                        <Text
                            fontSize="sm"
                            fontWeight="bold"
                            textAlign="center"
                            mt={4}
                            cursor="pointer"
                            onClick={() => setView("login")}
                            color="black"
                        >
                            Back to Login
                        </Text>
                    )}

                    {generalErrorMessage &&
                        !getFieldError("username") &&
                        !getFieldError("email") && (
                            <Text
                                fontSize="xs"
                                color="red.500"
                                textAlign="center"
                                mt={2}
                            >
                                {generalErrorMessage}
                            </Text>
                        )}
                </VStack>

                <Box
                    bg="white"
                    p={6}
                    border="1px solid"
                    borderColor="gray.200"
                    width="full"
                    textAlign="center"
                >
                    <Text fontSize="sm" color="black">
                        {view === "login"
                            ? "Don't have an account? "
                            : "Have an account? "}
                        <Text
                            as="span"
                            color="#0095f6"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={() =>
                                setView(view === "login" ? "signup" : "login")
                            }
                        >
                            {view === "login" ? "Sign up" : "Log in"}
                        </Text>
                    </Text>
                </Box>

                <VStack gap={4} mt={2}>
                    <Text fontSize="sm" color="black">
                        Get the app.
                    </Text>
                    <HStack gap={2}>
                        <Image
                            src="https://static.cdninstagram.com/rsrc.php/v3/yt/r/Y23_5k_bt99.png"
                            h="40px"
                        />
                        <Image
                            src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym_f0n.png"
                            h="40px"
                        />
                    </HStack>
                </VStack>
            </VStack>

            <InstagramAlert
                isOpen={alertConfig.isOpen}
                onClose={() =>
                    setAlertConfig({ ...alertConfig, isOpen: false })
                }
                title={alertConfig.title}
                message={alertConfig.message}
            />
        </Flex>
    );
};

export default Auth;
