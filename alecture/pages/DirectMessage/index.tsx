import React from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import { Container, Header } from './styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  const { data: userData, error, mutate } = useSWR<IUser | false>(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR('/api/users', fetcher);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat="" />
    </Container>
  );
};

export default DirectMessage;
