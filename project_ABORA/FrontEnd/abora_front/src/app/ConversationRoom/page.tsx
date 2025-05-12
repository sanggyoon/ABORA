'use client';

import React, { Suspense, useState } from 'react';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';
import AvatarScene from '../Components/Avatar/AvatarScene';
import slideData from '../slideData';

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
  const [messages, setMessages] = useState<
    {
      speaker: string;
      message: string;
      type: 'user' | 'agentA' | 'agentB';
      timestamp: string;
    }[]
  >([]);
  const [isFocused, setIsFocused] = useState(false);

  //agent이름과 같은 slideData에서 찾음.
  const agentDataA = slideData.find((item) => item.name === agentA) || null;
  const agentDataB = slideData.find((item) => item.name === agentB) || null;

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    // 사용자 메시지 추가
    setMessages((prev) => [
      ...prev,
      {
        speaker: '사용자',
        message: inputValue,
        type: 'user',
        timestamp: new Date().toLocaleString(),
      },
    ]);

    try {
      // 백엔드로 메시지 전송
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userprompt: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from the server');
      }

      const data = await response.json();

      // 백엔드에서 받은 conversation 추가
      const newMessages = data.conversation.map((item: any, index: number) => ({
        speaker: item.speaker,
        message: item.message,
        type: index % 2 === 0 ? 'agentA' : 'agentB', // 짝수는 AgentA, 홀수는 AgentB
        timestamp: new Date().toLocaleString(),
      }));

      setMessages((prev) => [...prev, ...newMessages]);
    } catch (error) {
      console.error('Error:', error);
    }

    setInputValue('');
  };
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
          <AgentABubble
            message={`안녕하세요, 저는 ${agentA} 입니다`}
            timestamp={currentTime}
          />
          <AgentBBubble
            message={`안녕하세요, 저는 ${agentB} 입니다`}
            timestamp={currentTime}
          />
          {messages.map((msg, index) => {
            if (msg.type === 'user') {
              return (
                <UserBubble
                  key={index}
                  message={msg.message}
                  timestamp={msg.timestamp}
                />
              );
            } else if (msg.type === 'agentA') {
              return (
                <AgentABubble
                  key={index}
                  message={msg.message}
                  timestamp={msg.timestamp}
                />
              );
            } else if (msg.type === 'agentB') {
              return (
                <AgentBBubble
                  key={index}
                  message={msg.message}
                  timestamp={msg.timestamp}
                />
              );
            }
            return null;
          })}
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
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              handleSendMessage();
            }
          }}
        />
        <button className={styles.button_send} onClick={handleSendMessage}>
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
