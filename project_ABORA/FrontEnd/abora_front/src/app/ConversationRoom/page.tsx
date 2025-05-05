'use client';

import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  UserBubble,
  AgentABubble,
  AgentBBubble,
} from '../components/ChatBubble';
import Avatar_A from '../Img/Agent_A.png';
import Avatar_B from '../Img/Agent_B.png';
import Avatar_C from '../Img/Agent_C.png';
import Avatar_D from '../Img/Agent_D.png';

export default function ConversationRoom() {
  const searchParams = useSearchParams();
  const agentA = searchParams.get('agentA');
  const agentB = searchParams.get('agentB');
  const currentTime = new Date().toLocaleString();

  const avatarImages = {
    '분석적인 상균': Avatar_A,
    '감성적인 채영': Avatar_B,
    '철학적인 동년': Avatar_C,
    '실무적인 정민': Avatar_D,
  };

  return (
    <>
      <div className={styles.conversationRoomContainer}>
        {/* 에이전트 A */}
        <div className={styles.choosenAgent_A}>
          <div className={styles.agent_A_avartar}>
            <p className={styles.name_agentA}>{agentA}</p>
            {agentA && (
              <Image
                src={avatarImages[agentA as keyof typeof avatarImages]}
                alt={`Avatar for ${agentA}`}
                layout="responsive"
                height={100}
                width={100}
              />
            )}
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className={styles.chatBox}>
          <UserBubble
            message="Hello, this is a user message!"
            timestamp={currentTime}
          />
          <AgentABubble message="Hi, I am Agent A!" timestamp={currentTime} />
          <AgentBBubble
            message="Hello, I am Agent B!"
            timestamp={currentTime}
          />
        </div>

        {/* 에이전트 B */}
        <div className={styles.choosenAgent_B}>
          <div className={styles.agent_B_avartar}>
            <p className={styles.name_agentB}>{agentB}</p>
            {agentB && (
              <Image
                src={avatarImages[agentB as keyof typeof avatarImages]}
                alt={`Avatar for ${agentB}`}
                layout="responsive"
                height={100}
                width={100}
              />
            )}
          </div>
        </div>
        
      </div>

      <div className={styles.chatInput}>
        <button className={styles.button_stop}>◼︎</button>
        <input type="text" placeholder="Type your message..." />
        <button className={styles.button_send}>Send</button>
      </div>
    </>
  );
}
