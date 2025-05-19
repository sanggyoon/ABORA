'use client';

import React, { Suspense, useState } from 'react';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';
import AvatarScene from '../Components/Avatar/AvatarScene';
import slideData from '../slideData';
import handleSendMessage from '../Components/handleSendMessage'

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

  //립싱크 제어
  const [lipSyncA, setLipSyncA] = useState<{ json: string, mp3: string } | null>(null);
  const [lipSyncB, setLipSyncB] = useState<{ json: string, mp3: string } | null>(null);

  //agent이름과 같은 slideData에서 찾음.
  const agentDataA = slideData.find((item) => item.name === agentA) || null;
  const agentDataB = slideData.find((item) => item.name === agentB) || null;

  //voice 탐색
  const voiceA = agentDataA?.voice;
  const voiceB = agentDataB?.voice;

  //모션 제어
  const currentActionA = isFocused ? 'left_reading' : 'breath';
  const currentActionB = isFocused ? 'right_reading' : 'breath';


  const renderAvatar = (
    agent: (typeof slideData)[0] | null,
    currentAction: string,
    lipSync : {json: string; mp3: string } | null
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

  return (
    <>
      <div className={styles.conversationRoomContainer}>
        {/* 에이전트 A */}
        <div className={styles.choosenAgent_A}>
          <div className={styles.agent_A_avatar}>
            <p className={styles.name_agentA}>{agentA}</p>
            {renderAvatar(agentDataA, currentActionA, lipSyncA)}
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
            {renderAvatar(agentDataB, currentActionB, lipSyncB)}
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
              handleSendMessage(voiceA ,voiceB, inputValue, setLipSyncA, setLipSyncB,setInputValue, setMessages);
            }
          }}
        />
        <button className={styles.button_send} onClick={()=>handleSendMessage(voiceA,voiceB,inputValue, setLipSyncA, setLipSyncB,setInputValue, setMessages)}>
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
