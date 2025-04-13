'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/ChooseAgent');
  };

  return (
    <button className={styles.moveConversationRoom} onClick={handleButtonClick}>
      Start!
    </button>
  );
}
