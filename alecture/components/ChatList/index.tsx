import React, { useCallback, useRef } from 'react';
import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import { ChatZone } from './styles';
import Scrollbars from 'react-custom-scrollbars';

interface Props {
  chatData?: IDM[];
}

const ChatList: React.FC<Props> = ({ chatData }) => {
  const scrollRef = useRef(null);

  const onScroll = useCallback(() => {
    // TODO: 스크롤을 맨 위로 올렸을 때, 이전 채팅 보여주기
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
