import React, { forwardRef, useCallback } from 'react';
import Chat from '@components/Chat';
import { IChat, IDM } from '@typings/db';
import { ChatZone, Section, StickyHeader } from './styles';
import Scrollbars from 'react-custom-scrollbars';

interface Props {
  chatSections: { [key: string]: (IDM | IChat)[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | IChat[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }, scrollRef) => {
  const onScroll = useCallback((values: { scrollTop: number; scrollHeight: number }) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      // 스크롤이 가장 위로 올라갔을 때
      // 페이지를 하나 더 불러온다.
      setSize((prevSize) => prevSize + 1).then(() => {
        const current = (scrollRef as React.MutableRefObject<Scrollbars>)?.current;
        if (current) {
          current.scrollTop(current.getScrollHeight() - values.scrollHeight);
        }
      });
    }
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
});

export default ChatList;
