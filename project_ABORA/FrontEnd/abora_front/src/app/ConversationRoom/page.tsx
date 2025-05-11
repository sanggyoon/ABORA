'use client';

import React, { Suspense, useState } from 'react';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';
import AvatarScene from '../Components/Avatar/AvatarScene';
import slideData from '../slideData';
import handleSendMessage from "../Components/handleSendMessage"

import {
  UserBubble,
  AgentABubble,
  AgentBBubble,
} from '../Components/ChatBubble';

function ConversationContent() {
  const searchParams = useSearchParams();
  const agentA = searchParams.get('agentA');
  const agentB = searchParams.get('agentB');
  const currentTime = new Date().toLocaleString();

  const [inputValue, setInputValue] = useState('');
  const [userMessages, setUserMessages] = useState<
    { message: string; timestamp: string }[]
  >([]);
  const [isFocused, setIsFocused] = useState(false);
  

  //agent이름과 같은 slideData에서 찾음.
  const agentDataA = slideData.find((item) => item.name === agentA) || null;
  const agentDataB = slideData.find((item) => item.name === agentB) || null;

  const currentActionA = isFocused ? 'left_reading' : 'breath';
  const currentActionB = isFocused ? 'right_reading' : 'breath';

  const renderAvatar = (
    agent: (typeof slideData)[0] | null,
    currentAction: string
  ) => {
    if (!agent) return null;
    return (
      <AvatarScene
        ModelComponent={agent.Component}
        glbPath={agent.glb}
        currentAction={currentAction}
      />
    );
  };

  return (
    <>
      <div className={styles.conversationRoomContainer}>
        {/* 에이전트 A */}
        <div className={styles.choosenAgent_A}>
          <div className={styles.agent_A_avatar}>
            <p className={styles.name_agentA}>{agentA}</p>
            {renderAvatar(agentDataA, currentActionA)}
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className={styles.chatBox}>
          {userMessages.map((msg, index) => (
            <UserBubble
              key={index}
              message={msg.message}
              timestamp={msg.timestamp}
            />
          ))}
          <AgentABubble message="Hi, I am Agent A!" timestamp={currentTime} />
          <AgentBBubble
            message="Hello, I am Agent B!"
            timestamp={currentTime}
          />
        </div>

        {/* 에이전트 B */}
        <div className={styles.choosenAgent_B}>
          <div className={styles.agent_B_avatar}>
            <p className={styles.name_agentB}>{agentB}</p>
            {renderAvatar(agentDataB, currentActionB)}
          </div>
        </div>
      </div>

      <div className={styles.chatInput}>
        <button className={styles.button_stop}>◼︎</button>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage(inputValue, setInputValue, setUserMessages);
            }
          }}
        />
        <button className={styles.button_send} onClick={()=>handleSendMessage(inputValue, setInputValue, setUserMessages)}>
          Send
        </button>
      </div>
    </>
  );
}

export default function ConversationRoom() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConversationContent />
    </Suspense>
  );
}
