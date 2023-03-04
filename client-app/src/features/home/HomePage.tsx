import React from 'react';
import { Button, Heading, Image, Text, HStack, VStack, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';

const HomePage = () => {
    const { userStore : {isLoggedIn, logout}, modalStore } = useStore();
    return (
        <Flex p='auto' textAlign='center' className='masthead'>
            <VStack  >
                <HStack as={'h1'} alignItems={'center'}>
                    <Image  boxSize={'80px'} src={'/assets/appImages/MessengerIconL.png'} style={{ marginBottom: 12 }} />
                    <Text fontSize={'3xl'}>Community</Text>
                </HStack>
                <VStack width='full'>
                    {isLoggedIn ? (
                        <>
                            <Heading as='h2' >Welcome to Community</Heading>
                            <Button as={Link} to='/dashboard' size='md' colorScheme={'messenger'}>Go to the conversations</Button>
                            <Button colorScheme={'messenger'} onClick={logout}>Logout</Button>
                        </>
                    ) : (
                        <Flex direction='row' columnGap={2} w='full' p='auto' alignContent='stretch'>
                            <Button onClick={() => modalStore.openModal(<LoginForm />)}
                             w='full' size='lg' colorScheme={'messenger'} >
                                Login
                            </Button>
                            <Button onClick={() => modalStore.openModal(<RegisterForm />)}
                             w='full' size='lg' _hover={{ bg: 'gray.400' }}>
                                Register
                            </Button>
                        </Flex>
                    )}
                </VStack>
            </VStack>
        </Flex>
    );
};

export default observer(HomePage);