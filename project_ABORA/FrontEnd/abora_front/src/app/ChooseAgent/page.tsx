'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function ChooseAgent() {
  const router = useRouter();
  const [currentSlideA, setCurrentSlideA] = useState(0);
  const [currentSlideB, setCurrentSlideB] = useState(0);

  // 선택된 아바타를 파라미터로 전달
  const handleButtonClick = () => {
    const agentA = slideData[currentSlideA];
    const agentB = slideData[currentSlideB];
    router.push(`/ConversationRoom?agentA=${agentA}&agentB=${agentB}`);
  };

  const slideData = [
    '분석적인 상균',
    '감성적인 채영',
    '철학적인 동년',
    '실무적인 정민',
  ];

  const handleNextSlide = (
    setSlide: React.Dispatch<React.SetStateAction<number>>,
    currentSlide: number
  ) => {
    setSlide((currentSlide + 1) % slideData.length);
  };

  const handlePrevSlide = (
    setSlide: React.Dispatch<React.SetStateAction<number>>,
    currentSlide: number
  ) => {
    setSlide((currentSlide - 1 + slideData.length) % slideData.length);
  };

  return (
    <div className={styles.chooseAgentContainer}>
      {/* 슬라이드 A */}
      <div className={styles.chooseAgent_A}>
        <div
          className={styles.arrow}
          onClick={() => handlePrevSlide(setCurrentSlideA, currentSlideA)}
        >
          &#8592; {/* 왼쪽 화살표 */}
        </div>
        <div className={styles.slideBox}>
          {slideData.map((item, index) => (
            <div
              key={index}
              className={styles.slide}
              style={{
                transform: `translateX(${(index - currentSlideA) * 100}%)`,
              }}
            >
              <div className={styles.agentBaseModel}></div>
              <div className={styles.agentNameContainer}>{item}</div>
            </div>
          ))}
        </div>
        <div
          className={styles.arrow}
          onClick={() => handleNextSlide(setCurrentSlideA, currentSlideA)}
        >
          &#8594; {/* 오른쪽 화살표 */}
        </div>
      </div>

      {/* 슬라이드 B */}
      <div className={styles.chooseAgent_B}>
        <div
          className={styles.arrow}
          onClick={() => handlePrevSlide(setCurrentSlideB, currentSlideB)}
        >
          &#8592; {/* 왼쪽 화살표 */}
        </div>
        <div className={styles.slideBox}>
          {slideData.map((item, index) => (
            <div
              key={index}
              className={styles.slide}
              style={{
                transform: `translateX(${(index - currentSlideB) * 100}%)`,
              }}
            >
              <div className={styles.agentBaseModel}></div>
              <div className={styles.agentNameContainer}>{item}</div>
            </div>
          ))}
        </div>
        <div
          className={styles.arrow}
          onClick={() => handleNextSlide(setCurrentSlideB, currentSlideB)}
        >
          &#8594; {/* 오른쪽 화살표 */}
        </div>
      </div>

      <button
        className={styles.moveConversationRoom}
        onClick={handleButtonClick}
      >
        Select
      </button>
    </div>
  );
}
