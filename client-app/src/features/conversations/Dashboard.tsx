import { Flex, Image } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { useStore } from '../../app/stores/store';
import ConversationBoard from './ConversationBoard';
import ConversationList from './ConversationList';
import SideBar from './SideBar';


const Dashboard = () => {
  const { conversationStore, messageStore } = useStore();
  const { loadConversations, loadingInitial, conversationRegistry, selectedConversation } = conversationStore;
  const { messageRegistry, updateMessageIsDelivered } = messageStore;

  useEffect(() => {
    if (conversationRegistry.size <= 1) {
      loadConversations();
      updateMessageIsDelivered(Array.from(conversationRegistry.values()).map(c => c.id));
    }
  }, [conversationRegistry, loadConversations, messageRegistry, updateMessageIsDelivered]);

  if (loadingInitial) return (<LoadingComponent message='Loading' />);

  return (
    <Flex h={'100vh'}>
      <Flex direction={'column'} w={'25%'} >
        <SideBar />
        <ConversationList direction={'column'} h={'full'} />
      </Flex>
      {
        selectedConversation ? <ConversationBoard w={'75%'} /> : <Image w={'75%'} src={process.env.PUBLIC_URL + 'assets/appImages/WhatsAppBg.png'} alt={''} />
      }
    </Flex>
  );
};

export default observer(Dashboard);