import { Flex, FlexProps, Icon, Image, Spacer, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { RiCheckDoubleFill, RiCheckFill } from 'react-icons/ri';
import { useStore } from '../../app/stores/store';
import { formatDistanceToNow } from 'date-fns';


const ConversationList = (Props: FlexProps) => {
    const { conversationStore, userStore: { user }, messageStore: { getLastmessage } } = useStore();
    const { conversationsByDate, setSelectedConversation, selectedConversation } = conversationStore;

    const truncate = (str: string | undefined) => {
        if (str) return str.length > 40 ? str.substring(0, 37) + '...' : str;
    };
    const isOwnMessage = (username: string | undefined) => {
        if (!username) return false;
        return username === user?.username;
    };

    return (
        <Flex {...Props} bg={'white'}>
            {conversationsByDate.map(({ id, participantNames, participantIds, participantPictureUrls }) =>
                <Flex key={id} as={'button'} onClick={() => setSelectedConversation(id)} p={2} gap={2}
                    _hover={{ bgColor: 'gray.100' }} bg={selectedConversation?.id === id ? 'gray.100' : 'white'}
                    color={(!isOwnMessage(getLastmessage(id)?.username) && !getLastmessage(id)?.isSeen) ? 'black' : '#9d92a7'}
                    fontWeight={(!isOwnMessage(getLastmessage(id)?.username) && !getLastmessage(id)?.isSeen) ? 'semibold' : 'normal'}
                >
                 <Image borderRadius={'full'} boxSize={'3em'} fallbackSrc={process.env.PUBLIC_URL + 'assets/appImages/user.png'}
                        src={participantPictureUrls[0] !== user?.image ? participantPictureUrls[0] : participantPictureUrls[1]}
                        alt={''} />
                    <Flex direction={'column'} w={{ md: 'full' }} display={{ base: 'none', md: 'flex' }} alignItems={'start'}>

                        <Flex w={'full'}>
                            <Text>{participantNames[0] !== user?.username ? participantNames[0] : participantNames[1]}</Text>
                            <Spacer />
                            {getLastmessage(id)?.createdAt && <Text fontSize={'xs'}>{formatDistanceToNow(getLastmessage(id)!.createdAt)}</Text>}
                        </Flex>

                        <Flex gap={1} alignItems={'center'} w={'full'}>
                            {(isOwnMessage(getLastmessage(id)?.username) && getLastmessage(id)?.isSeen) && <Icon as={RiCheckDoubleFill} boxSize={5} color={'#75cde5'} />}
                            {(isOwnMessage(getLastmessage(id)?.username) && getLastmessage(id)?.isDelivered && !getLastmessage(id)?.isSeen) && <Icon as={RiCheckDoubleFill} boxSize={5} color={'#95a3ac'} />}
                            {(isOwnMessage(getLastmessage(id)?.username) && getLastmessage(id)?.isSent && !getLastmessage(id)?.isDelivered) && <Icon as={RiCheckFill} boxSize={5} color={'#95a3ac'} />}
                            <Text fontSize={'xs'}>
                                {truncate(getLastmessage(id)?.body)}
                            </Text>
                            <Spacer />
                            {(!isOwnMessage(getLastmessage(id)?.username) && !getLastmessage(id)?.isSeen) &&
                                <Icon as={AiFillExclamationCircle} boxSize={'5'} color={'#25d366'} />}
                        </Flex>
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
};

export default observer(ConversationList);