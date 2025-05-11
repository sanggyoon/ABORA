import React from 'react';
import styles from './ChatBubble.module.css';

type ChatBubbleProps = {
  message: string;
  timestamp?: string;
};

export const UserBubble: React.FC<ChatBubbleProps> = ({
  message,
  timestamp,
}) => (
  <div className={styles.userBubbleContainer}>
    {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
    <div className={styles.userBubble}>
      <p>{message}</p>
    </div>
  </div>
);

export const AgentABubble: React.FC<ChatBubbleProps> = ({
  message,
  timestamp,
}) => (
  <div className={styles.agentABubbleContainer}>
    {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
    <div className={styles.agentABubble}>
      <p>{message}</p>
    </div>
  </div>
);

export const AgentBBubble: React.FC<ChatBubbleProps> = ({
  message,
  timestamp,
}) => (
  <div className={styles.agentBBubbleContainer}>
    {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
    <div className={styles.agentBBubble}>
      <p>{message}</p>
    </div>
  </div>
);
