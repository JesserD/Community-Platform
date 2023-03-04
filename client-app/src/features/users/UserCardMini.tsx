import { Flex, Image, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../../app/stores/store';

interface Props {
    username: string;
    id: string;
    pictureUrl: string;
    onClose: () => void;
}

const UserCardMini = ({ username, id, pictureUrl, onClose }: Props) => {
    const { conversationStore: { selectCreateConversation }, profileStore: { stopHubConnection } } = useStore();
    const handleOnClick = () => {
        selectCreateConversation(id);
        onClose();
        stopHubConnection();
    };
    console.log(pictureUrl);
    return (
        <Flex as={'button'} value={id} onClick={() => handleOnClick()} _hover={{ bg: 'gray.200' }} direction={'row'} w={'full'} h={'10%'} p={3} gap={2} alignItems={'center'}>
            {(pictureUrl !== null && pictureUrl.length > 0) ?
                <Image borderRadius={'full'} boxSize={'2.2em'} src={pictureUrl} alt={''} />
                :
                <Image borderRadius={'full'} boxSize={'2.2em'} src={process.env.PUBLIC_URL + 'assets/appImages/user.png'} alt={''} />
            }
            <Text>{username}</Text>
        </Flex>
    );
};

export default observer(UserCardMini);