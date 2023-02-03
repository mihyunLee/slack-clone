import React from 'react';
import { IDM } from '@typings/db';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';

interface Props {
  data: IDM;
}

const Chat: React.FC<Props> = ({ data }) => {
  const user = data.Sender;

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{new Date(data.createdAt).toLocaleDateString()}</span>
        </div>
        <p>{data.content}</p>
      </div>
    </ChatWrapper>
  );
};

export default Chat;
