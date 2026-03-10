import React, { useState, useEffect } from 'react';
import { Box, Flex, Image, VStack, Text, Input, Button, HStack } from '@chakra-ui/react';
import { AiFillFacebook } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { login, signup, clearError } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import InstagramAlert from '../components/common/InstagramAlert';

const Divider = () => <Box h="1px" bg="gray.200" flex={1} />;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', email: '', fullName: '' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Alert for general system errors
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: '' });

  const authImages = [
    'https://www.instagram.com/static/images/homepage/screenshots/screenshot1-2x.png/cfd999368de3.png',
    'https://www.instagram.com/static/images/homepage/screenshots/screenshot2-2x.png/80b3ad71f90b.png',
    'https://www.instagram.com/static/images/homepage/screenshots/screenshot3-2x.png/fe2540681fd5.png',
    'https://www.instagram.com/static/images/homepage/screenshots/screenshot4-2x.png/8e2292e57938.png',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % authImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(clearError());
  }, [isLogin, dispatch]);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(login({ username: formData.username, password: formData.password }));
    } else {
      dispatch(signup(formData));
    }
  };

  const getFieldError = (fieldName) => {
    if (typeof error === 'object' && error?.errors) {
      return error.errors.find(err => err.field === fieldName)?.message;
    }
    return null;
  };

  const generalErrorMessage = typeof error === 'string' ? error : error?.message;

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
          <Text fontSize="4xl" fontWeight="bold" textAlign="center" mb={6} fontFamily="cursive" color="black">
            Instagram
          </Text>

          {!isLogin && (
            <Text fontSize="sm" fontWeight="bold" color="gray.500" textAlign="center" mb={4}>
              Sign up to see photos and videos from your friends.
            </Text>
          )}

          <form onSubmit={handleSubmit}>
            <VStack gap={2} align="stretch">
              {!isLogin && (
                <Box>
                  <Input 
                    placeholder="Email" 
                    fontSize="xs" 
                    bg="gray.50" 
                    borderColor={getFieldError('email') ? 'red.400' : 'gray.200'}
                    _placeholder={{ color: "gray.400" }}
                    color="black"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  {getFieldError('email') && <Text fontSize="10px" color="red.500" mt={1}>{getFieldError('email')}</Text>}
                </Box>
              )}
              {!isLogin && (
                <Box>
                  <Input 
                    placeholder="Full Name" 
                    fontSize="xs" 
                    bg="gray.50" 
                    borderColor="gray.200"
                    _placeholder={{ color: "gray.400" }}
                    color="black"
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </Box>
              )}
              <Box>
                <Input 
                  placeholder="Username" 
                  fontSize="xs" 
                  bg="gray.50" 
                  borderColor={getFieldError('username') ? 'red.400' : 'gray.200'}
                  _placeholder={{ color: "gray.400" }}
                  color="black"
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                {getFieldError('username') && <Text fontSize="10px" color="red.500" mt={1}>{getFieldError('username')}</Text>}
              </Box>
              <Box>
                <Input 
                  placeholder="Password" 
                  type="password" 
                  fontSize="xs" 
                  bg="gray.50" 
                  borderColor="gray.200"
                  _placeholder={{ color: "gray.400" }}
                  color="black"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </Box>
              <Button 
                type="submit"
                bg="#0095f6"
                _hover={{ bg: "#1877f2" }}
                color="white"
                width="full" 
                size="sm" 
                fontSize="sm"
                fontWeight="bold"
                isLoading={loading}
                mt={2}
              >
                {isLogin ? 'Log In' : 'Sign Up'}
              </Button>
            </VStack>
          </form>

          <HStack width="full" my={4}>
            <Divider />
            <Text fontSize="xs" fontWeight="bold" color="gray.500">OR</Text>
            <Divider />
          </HStack>

          <Button 
            variant="ghost" 
            color="#385185" 
            fontSize="sm" 
            fontWeight="bold"
            _hover={{ bg: 'transparent' }}
          >
            {isLogin ? 'Log in with Facebook' : 'Sign up with Facebook'}
          </Button>

          {isLogin && (
            <Text fontSize="xs" textAlign="center" mt={2} cursor="pointer" color="#385185">
              Forgot password?
            </Text>
          )}

          {generalErrorMessage && !getFieldError('username') && !getFieldError('email') && (
            <Text fontSize="xs" color="red.500" textAlign="center" mt={2}>
              {generalErrorMessage}
            </Text>
          )}
        </VStack>

        <Box bg="white" p={6} border="1px solid" borderColor="gray.200" width="full" textAlign="center">
          <Text fontSize="sm" color="black">
            {isLogin ? "Don't have an account? " : "Have an account? "}
            <Text as="span" color="#0095f6" fontWeight="bold" cursor="pointer" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign up' : 'Log in'}
            </Text>
          </Text>
        </Box>

        <VStack gap={4} mt={2}>
          <Text fontSize="sm" color="black">Get the app.</Text>
          <HStack gap={2}>
            <Image src="https://static.cdninstagram.com/rsrc.php/v3/yt/r/Y23_5k_bt99.png" h="40px" />
            <Image src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym_f0n.png" h="40px" />
          </HStack>
        </VStack>
      </VStack>

      <InstagramAlert 
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        title="Error"
        message={alertConfig.message}
      />
    </Flex>
  );
};

export default Auth;
