import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import InviteChannelModal from '@components/InviteChannelModal';
import useInput from '@hooks/useInput';
import useSocket from '@hooks/useSocket';
import { IChannel, IChat, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useParams } from 'react-router-dom';
import { Container, Header } from './styles';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const { data: myData } = useSWR<IUser>('/api/users', fetcher);
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}/`, fetcher);
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : '',
    fetcher,
  );

  const [socket] = useSocket(workspace);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const [chat, onChangeChat, setChat] = useInput('');
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const scrollbarRef = useRef<Scrollbars>(null);

  const onSubmitForm = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (chat?.trim() && chatData && channelData) {
        const savedChat = chat;
        mutateChat(
          (prevChatData) => {
            prevChatData?.[0].unshift({
              // DirectMessage의 모든 객체
              id: (chatData[0][0]?.id || 0) + 1,
              content: savedChat,
              UserId: myData!.id,
              User: myData!,
              ChannelId: channelData.id,
              Channel: channelData,
              createdAt: new Date(),
            });
            return prevChatData;
          },
          { revalidate: false },
        ).then(() => {
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
        axios
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, { content: chat })
          .then(() => {
            mutateChat();
          })
          .catch(console.error);
      }
    },
    [chat, chatData, myData, channelData, workspace, channel],
  );

  const onMessage = useCallback(
    (data: IChat) => {
      // id는 상대방 아이디
      if (data.Channel.name === channel && data.UserId !== myData?.id) {
        mutateChat(
          (chatData) => {
            chatData?.[0].unshift(data);
            return chatData;
          },
          { revalidate: false },
        ).then(() => {
          if (scrollbarRef.current) {
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              // '내가' 스크롤바를 150 미만으로 올렸을 때만 스크롤 바를 가장 밑으로 내린다.
              // console.log('scrollToBottom!', scrollbarRef.current?.getValues());
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 100);
            }
          }
        });
      }
    },
    [channel, myData],
  );

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {}, []);

  // 소켓 연결
  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, onMessage]);

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  if (!channelData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container>
      <Header>
        <span>#{channel}</span>
        <div className="header-right">
          <span>{channelMembersData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      <ChatList
        chatSections={chatSections}
        ref={scrollbarRef}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </Container>
  );
};

export default Channel;
