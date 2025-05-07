'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiSolidLeftArrow } from 'react-icons/bi';
import { BiSolidRightArrow } from 'react-icons/bi';

import styles from './page.module.css';
import Avatar_GPT from '../Components/Avatar/Avatar_GPT';
import Avatar_Gemini from '../Components/Avatar/Avatar_Gemini';
import Avatar_Claude from '../Components/Avatar/Avatar_Claude';
import Avatar_Llama from '../Components/Avatar/Avatar_Llama';
import AvatarScene from '../Components/Avatar/AvatarScene';

export default function ChooseAgent() {
  const router = useRouter();
  const [currentSlideA, setCurrentSlideA] = useState(0);
  const [currentSlideB, setCurrentSlideB] = useState(0);

  // 선택된 아바타를 파라미터로 전달
  const handleButtonClick = () => {
    const agentA = slideData[currentSlideA].name;
    const agentB = slideData[currentSlideB].name;
    router.push(`/ConversationRoom?agentA=${agentA}&agentB=${agentB}`);
  };

  const slideData = [
    {
      name: '분석적인 상균',
      model: 'Chat-GPT',
      description: '사실적 기반 분석',
      Component: Avatar_GPT,
      glb: '/models/sanggyun.glb',
    },
    {
      name: '철학적인 동년',
      model: 'Claude',
      description: '철학적 기반 분석',
      Component: Avatar_Claude,
      glb: '/models/dongnyeon.glb',
    },
    {
      name: '감성적인 채영',
      model: 'Gemini',
      description: '감정 기반 분석',
      Component: Avatar_Gemini,
      glb: '/models/chaeyoung.glb',
    },
    {
      name: '실무적인 정민',
      model: 'Copilot',
      description: '실무적 기반 분석',
      Component: Avatar_Llama,
      glb: '/models/jungmin.glb',
    },
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
          <BiSolidLeftArrow />
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
              <AvatarScene
                ModelComponent={item.Component}
                glbPath={item.glb}
              ></AvatarScene>
              <div className={styles.agentDescription}>
                <span>{item.model}</span>
                <br />
                <span>{item.description}</span>
              </div>
              <div className={styles.agentNameContainer}>{item.name}</div>
            </div>
          ))}
        </div>

        <div
          className={styles.arrow}
          onClick={() => handleNextSlide(setCurrentSlideA, currentSlideA)}
        >
          <BiSolidRightArrow />
        </div>
      </div>

      {/* 슬라이드 B */}
      <div className={styles.chooseAgent_B}>
        <div
          className={styles.arrow}
          onClick={() => handlePrevSlide(setCurrentSlideB, currentSlideB)}
        >
          <BiSolidLeftArrow />
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
              <AvatarScene
                ModelComponent={item.Component}
                glbPath={item.glb}
              ></AvatarScene>
              <div className={styles.agentDescription}>
                <span>{item.model}</span>
                <br />
                <span>{item.description}</span>
              </div>
              <div className={styles.agentNameContainer}>{item.name}</div>
            </div>
          ))}
        </div>
        <div
          className={styles.arrow}
          onClick={() => handleNextSlide(setCurrentSlideB, currentSlideB)}
        >
          <BiSolidRightArrow />
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
