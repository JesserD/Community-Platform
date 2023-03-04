import { Flex, Icon, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import { Message } from '../../app/models/Message';
import { RiCheckDoubleFill, RiCheckFill } from 'react-icons/ri';

interface Props {
    message: Message;
    nameColor: string;
    isOwnMessage: Boolean;
}

const MessageCard = ({ message, nameColor, isOwnMessage }: Props) => {
    const { username, createdAt, body, isSeen, isSent, isDelivered } = message;
    const fieldRef = React.useRef<HTMLInputElement>(null);
    if (fieldRef.current != null) fieldRef.current.scrollIntoView();
    return (
        <Flex direction={'column'} border={'1px lightGray solid'} px={3} py={1} bg={isOwnMessage ? '#d9fdd3' : 'white'}
            w={'fit-content'} rounded={'2xl'} boxShadow={'md'} alignSelf={isOwnMessage ? 'end' : 'start'}
        >
            <Text fontSize={'smaller'} color={nameColor}>{isOwnMessage ? 'Me' : username}</Text>
            <Text fontFamily={'body'} style={{ fontFamily: 'Segoe UI' }}>{body}</Text>
            <Flex justifyContent={'end'} alignItems={'center'}>
                <Text fontSize={'smaller'} color={'gray.400'}>{format(createdAt, 'k:mm')}</Text>
                {(isOwnMessage && isSeen) && <Icon as={RiCheckDoubleFill} color={'#75cde5'} />}
                {(isOwnMessage && isDelivered && !isSeen) && <Icon as={RiCheckDoubleFill} color={'#95a3ac'} />}
                {(isOwnMessage && isSent && !isDelivered) && <Icon as={RiCheckFill} color={'#95a3ac'} />}
            </Flex>
        </Flex>
    );
};

export default MessageCard;
