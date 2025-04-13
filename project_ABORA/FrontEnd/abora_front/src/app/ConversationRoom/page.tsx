'use client';

import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Avatar_A from '../Img/Agent_A.png';
import Avatar_B from '../Img/Agent_B.png';
import Avatar_C from '../Img/Agent_C.png';
import Avatar_D from '../Img/Agent_D.png';

export default function ConversationRoom() {
  const searchParams = useSearchParams();
  const agentA = searchParams.get('agentA');
  const agentB = searchParams.get('agentB');

  const avatarImages = {
    Avatar_GPT: Avatar_A,
    Avatar_Gemini: Avatar_B,
    Avatar_Claude: Avatar_C,
    Avatar_Llama: Avatar_D,
  };

  return (
    <>
      <div className={styles.conversationRoomContainer}>
        {/* 에이전트 A */}
        <div className={styles.choosenAgent_A}>
          <div className={styles.agent_A_avartar}>
            <p>{agentA}</p>
            {agentA && (
              <Image
                src={avatarImages[agentA as keyof typeof avatarImages]}
                alt={`Avatar for ${agentA}`}
                width={100}
                height={100}
              />
            )}
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className={styles.chatBox}>Chat Box</div>

        {/* 에이전트 B */}
        <div className={styles.choosenAgent_B}>
          <div className={styles.agent_B_avartar}>
            <p>{agentB}</p>
            {agentB && (
              <Image
                src={avatarImages[agentB as keyof typeof avatarImages]}
                alt={`Avatar for ${agentB}`}
                width={100}
                height={100}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.chatInput}>
        <button>Stop</button>
        <input type="text" placeholder="Type your message..." />
        <button>Send</button>
      </div>
    </>
  );
}
