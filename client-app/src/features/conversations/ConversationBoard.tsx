import { Flex, FlexProps, Icon, Spacer, Text, Image } from '@chakra-ui/react';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useStore } from '../../app/stores/store';
import InputField from './InputField';
import MessageCard from './MessageCard';
import { AiFillCalendar } from 'react-icons/ai';

const ConversationBoard = (Props: FlexProps) => {
    const { userStore: { user }, conversationStore, messageStore } = useStore();
    const { selectedConversation, getSelectedConversationId } = conversationStore;
    const { updateMessageIsSeen, getMessages } = messageStore;
    const [nameColorRegistery, setNameColorRegistery] = useState(new Map());
    const Ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!selectedConversation) return;
        selectedConversation.participantNames.forEach((name) => {
            setNameColorRegistery(nameColorRegistery.set(name, '#' + Math.floor(Math.random() * 16777215).toString(16)));
        });
        updateMessageIsSeen(getSelectedConversationId);
    }, [selectedConversation, nameColorRegistery, updateMessageIsSeen, getSelectedConversationId]);

    useEffect(() => {
        Ref.current?.scrollTo(0, Ref.current?.scrollHeight);
    }, [getMessages]);

    if (selectedConversation === undefined) return <>Opps</>;
    return (
        <Flex {...Props} gap={3} direction={'column'} backgroundImage={process.env.PUBLIC_URL + 'assets/appImages/ConversationBackground.png'} >
            <Flex w={'full'} h={'10%'} p={3} border={'1px lightGray solid'} bg={'#f0f2f5'} gap={2} alignItems={'center'}>
                <Image borderRadius={'full'} boxSize={'2.5em'} fallbackSrc={process.env.PUBLIC_URL + 'assets/appImages/user.png'} alt={''}
                    src={selectedConversation.participantPictureUrls[0] !== user?.image ?
                        selectedConversation.participantPictureUrls[0]
                        :
                        selectedConversation.participantPictureUrls[1]}
                />
                <Text>{
                    selectedConversation.participantNames[0] !== user?.username ?
                        selectedConversation.participantNames[0]
                        :
                        selectedConversation.participantNames[1]
                }</Text>
            </Flex>

            <Flex ref={Ref} direction={'column'} h={'full'} w={'full'} overflowY={'scroll'} >
                <Flex p={2} gap={2} bg={'#ffeecd'} w={'fit-content'} rounded={'xl'} alignSelf={'center'} color={'#7b8588'}>
                    <Icon as={AiFillCalendar} />
                    <Text fontSize={'smaller'}>This conversation was created {format(selectedConversation.createdAt, 'dd MMM yyyy h:mm aa')}</Text>
                </Flex>

                <Flex direction={'column'} gap={1} m={3} >
                    {getMessages.map(message => <MessageCard key={message.id} message={message}
                        nameColor={nameColorRegistery.get(message.username) || ''}
                        isOwnMessage={message.username === user?.username ? true : false}
                    />)}
                </Flex>
            </Flex>

            <Spacer />
            <InputField />
        </Flex>
    );
};

export default observer(ConversationBoard);