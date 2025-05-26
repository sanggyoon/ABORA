'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import LoadingComponent from '../Components/LoadingComponent';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';
import AvatarScene from '../Components/Avatar/AvatarScene';
import slideData from '../slideData';
import handleSendMessage from '../Components/handleSendMessage';

import {
  UserBubble,
  AgentABubble,
  AgentBBubble,
} from '../Components/ChatBubble';

function ConversationContent() {
  const searchParams = useSearchParams();
  const agentA = searchParams?.get('agentA') || '';
  const agentB = searchParams?.get('agentB') || '';
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<
    'agentA' | 'agentB' | null
  >(null);

  const chatBoxRef = useRef<HTMLDivElement>(null); // 채팅 영역 참조

  // 립싱크 제어
  const [lipSyncA, setLipSyncA] = useState<{
    json: string;
    mp3: string;
  } | null>(null);
  const [lipSyncB, setLipSyncB] = useState<{
    json: string;
    mp3: string;
  } | null>(null);

  // agent 이름과 같은 slideData에서 찾음
  const agentDataA = slideData.find((item) => item.name === agentA) || null;
  const agentDataB = slideData.find((item) => item.name === agentB) || null;

  // voice 탐색
  const voiceA = agentDataA?.voice;
  const voiceB = agentDataB?.voice;

  // 모션 제어
  const currentActionA = isLoading ? 'left_pending' :
      isFocused ? 'left_reading' : 'breath';

  const currentActionB = isLoading ? 'right_pending' :
      isFocused ? 'right_reading' : 'breath';


  const renderAvatar = (
    agent: (typeof slideData)[0] | null,
    currentAction: string,
    lipSync: { json: string; mp3: string } | null
  ) => {
    if (!agent) return null;
    return (
      <AvatarScene
        ModelComponent={agent.Component}
        glbPath={agent.glb}
        currentAction={currentAction}
        jsonFilename={lipSync?.json}
        mp3Filename={lipSync?.mp3}
      />
    );
  };

  // 메시지가 변경될 때 마지막 메시지를 기반으로 currentSpeaker 업데이트
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'agentA' || lastMessage.type === 'agentB') {
        setCurrentSpeaker(lastMessage.type);
      }
    }
  }, [messages]);

  // 메시지가 추가될 때마다 스크롤을 가장 하단으로 이동
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessageWithLoading = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      // 메시지 전송 로직
      await handleSendMessage(
        voiceA || 'defaultVoiceA',
        voiceB || 'defaultVoiceB',
        inputValue,
        setLipSyncA,
        setLipSyncB,
        setInputValue,
        setMessages
      );
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <>
      <div className={styles.conversationRoomContainer}>
        {/* 에이전트 A */}
        <div className={styles.choosenAgent_A}>
          {isLoading && (
            <LoadingComponent
              type="agentA"
              isActive={currentSpeaker === 'agentA'}
            />
          )}
          <div className={styles.agent_A_avatar}>
            <p className={styles.name_agentA}>{agentA}</p>
            {renderAvatar(agentDataA, currentActionA, lipSyncA)}
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className={styles.chatBox} ref={chatBoxRef}>
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
          {isLoading && (
            <LoadingComponent
              type="agentB"
              isActive={currentSpeaker === 'agentB'}
            />
          )}
          <div className={styles.agent_B_avatar}>
            <p className={styles.name_agentB}>{agentB}</p>
            {renderAvatar(agentDataB, currentActionB, lipSyncB)}
          </div>
        </div>
      </div>

      {/* 채팅 입력 영역 */}
      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing && !isLoading) {
              handleSendMessageWithLoading();
            }
          }}
          disabled={isLoading} // isLoading이 true일 때 비활성화
        />
        <button
          className={styles.button_send}
          onClick={handleSendMessageWithLoading}
          disabled={isLoading} // isLoading이 true일 때 비활성화
        >
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
