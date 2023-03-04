import { Flex, Image, Icon, Spacer, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../app/stores/store';
import { BsThreeDotsVertical } from 'react-icons/bs';
import StartConversation from './StartConversation';

const SideBar = () => {
    const { userStore: { user, logout } } = useStore();
    return (
        <Flex w={'full'} h={'10%'} p={3} border={'1px lightGray solid'} bg={'#f0f2f5'} gap={2} alignItems={'center'}>
            <Image borderRadius={'full'} boxSize={'3em'} alt={''} src={(user !== null && user.image !== null) ? user.image : process.env.PUBLIC_URL + 'assets/appImages/user.png'} />
            <Spacer />
            <StartConversation />
            <Menu>
                <MenuButton as={IconButton} boxSize={'2em'} icon={<Icon as={BsThreeDotsVertical} boxSize={'1.5em'} color={'#8f9ba2'} />} aria-label={'Settings'} />
                <MenuList>
                    <MenuItem onClick={logout}>Log out</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default observer(SideBar);