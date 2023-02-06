import React, { useCallback, useRef } from 'react';
import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import { ChatZone, Section, StickyHeader } from './styles';
import Scrollbars from 'react-custom-scrollbars';

interface Props {
  chatSections: { [key: string]: IDM[] };
}

const ChatList: React.FC<Props> = ({ chatSections }) => {
  const scrollRef = useRef(null);

  const onScroll = useCallback(() => {
    // TODO: 스크롤을 맨 위로 올렸을 때, 이전 채팅 보여주기
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
