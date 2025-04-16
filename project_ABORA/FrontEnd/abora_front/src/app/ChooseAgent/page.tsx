'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Avatar_GPT from '../Components/Avatar/Avatar_GPT'
import Avatar_Gemini from '../Components/Avatar/Avatar_Gemini'
import Avatar_Claude from '../Components/Avatar/Avatar_Claude'
import Avatar_Llama from '../Components/Avatar/Avatar_Llama'
import AvatarScene from '../Components/Avatar/AvatarScene'

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
    { name: 'Avatar_GPT', Component: Avatar_GPT },
    { name: 'Avatar_Gemini', Component: Avatar_Gemini },
    { name: 'Avatar_Claude', Component: Avatar_Claude },
    { name: 'Avatar_Llama', Component: Avatar_Llama },
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
          {slideData.map(({ name, Component }, index) => (
              <div
                  key={index}
                  className={styles.slide}
                  style={{
                    transform: `translateX(${(index - currentSlideA) * 100}%)`,
                  }}
              >
                <AvatarScene ModelComponent={Component} />
                <p>{name}</p>
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
          {slideData.map(({ name, Component }, index) => (
              <div
                  key={index}
                  className={styles.slide}
                  style={{
                    transform: `translateX(${(index - currentSlideB) * 100}%)`,
                  }}
              >
                <AvatarScene ModelComponent={Component}></AvatarScene>
                <p>{name}</p>
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
