import React from 'react';
import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import { ChatZone } from './styles';

interface Props {
  chatData?: IDM[];
}

const ChatList: React.FC<Props> = ({ chatData }) => {
  return (
    <ChatZone>
      {chatData?.map((chat) => (
        <Chat key={chat.id} data={chat} />
      ))}
    </ChatZone>
  );
};

export default ChatList;
