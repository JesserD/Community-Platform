import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, IconButton, Input, useDisclosure, Icon } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent } from 'react';
import { BiMessageDetail } from 'react-icons/bi';
import { useStore } from '../../app/stores/store';
import UserCardMini from '../users/UserCardMini';

const StartConversation = () => {
  const { profileStore: { createHubConnection, stopHubConnection, searchForProfile, profiles } } = useStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  const handleOnNewConversationClicked = () => {
    onOpen();
    createHubConnection();
  };

  const handleOnClosed = () => {
    onClose();
    stopHubConnection();
  };

  const handleOnInputChanged = (e: ChangeEvent<HTMLInputElement>) => {
    searchForProfile(e.currentTarget.value);
  };

  return (
    <>
    <IconButton ref={btnRef} boxSize={'2em'} onClick={handleOnNewConversationClicked} icon={<Icon as={BiMessageDetail} boxSize={'1.5em'} color={'#8f9ba2'} />} aria-label={'Start Conversation'}/>
      <Drawer isOpen={isOpen} placement='left' onClose={handleOnClosed} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Start New Conversation</DrawerHeader>

          <DrawerBody as={Flex} direction={'column'} gap={3}>
            <Input placeholder={'Type username here...'} onChange={e => handleOnInputChanged(e)} />
            <Flex direction={'column'} w={'full'} h={'full'} gap={1} overflowY={'scroll'}>
              {profiles.map(p => <UserCardMini key={p.id} id={p.id} pictureUrl={p.pictureUrl} username={p.username} onClose={onClose} />)}
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={handleOnClosed}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default observer(StartConversation);