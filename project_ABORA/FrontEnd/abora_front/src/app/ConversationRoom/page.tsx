'use client';

import React, { Suspense, useState } from 'react';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';
import AvatarScene from '../Components/Avatar/AvatarScene';
import Avatar_GPT from '../Components/Avatar/Avatar_GPT';
import Avatar_Gemini from '../Components/Avatar/Avatar_Gemini';
import Avatar_Claude from '../Components/Avatar/Avatar_Claude';
import Avatar_Llama from '../Components/Avatar/Avatar_Llama';
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

  const avatarComponents = {
    '분석적인 상균': Avatar_GPT,
    '감성적인 채영': Avatar_Gemini,
    '철학적인 동년': Avatar_Claude,
    '실무적인 정민': Avatar_Llama,
  };

  const avatarGlbPath = '/models/chaeyoung.glb';

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      const timestamp = new Date().toLocaleString();
      setUserMessages((prev) => [...prev, { message: inputValue, timestamp }]);
      setInputValue('');
    }
  };

  return (
    <>
      <div className={styles.conversationRoomContainer}>
        {/* 에이전트 A */}
        <div className={styles.choosenAgent_A}>
          <div className={styles.agent_A_avatar}>
            <p className={styles.name_agentA}>{agentA}</p>
            {agentA && (
              <AvatarScene
                ModelComponent={
                  avatarComponents[agentA as keyof typeof avatarComponents]
                }
                glbPath={avatarGlbPath}
              />
            )}
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
            {agentB && (
              <AvatarScene
                ModelComponent={
                  avatarComponents[agentB as keyof typeof avatarComponents]
                }
                glbPath={avatarGlbPath}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.chatInput}>
        <button className={styles.button_stop}>◼︎</button>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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
