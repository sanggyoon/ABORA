import React from 'react';
import styles from './ChatBubble.module.css';

type ChatBubbleProps = {
  message: string;
};

export const UserBubble: React.FC<ChatBubbleProps> = ({ message }) => (
  <div className={styles.userBubble}>
    <p>{message}</p>
  </div>
);

export const AgentABubble: React.FC<ChatBubbleProps> = ({ message }) => (
  <div className={styles.agentABubble}>
    <p>{message}</p>
  </div>
);

export const AgentBBubble: React.FC<ChatBubbleProps> = ({ message }) => (
  <div className={styles.agentBBubble}>
    <p>{message}</p>
  </div>
);
