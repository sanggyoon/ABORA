'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiSolidLeftArrow } from 'react-icons/bi';
import { BiSolidRightArrow } from 'react-icons/bi';
import slideData from '../slideData';

import styles from './page.module.css';
import AvatarScene from '../Components/Avatar/AvatarScene';
import HoverScramble from '../Components/GSAP/TextScramble';
import TypingText from '../Components/GSAP/TypingText';
import InitialScrambleText from '../Components/GSAP/InitialScrambleText';

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
                currentAction="breath"
              ></AvatarScene>
              <div className={styles.agentDescription}>
                <span><TypingText text = {item.model} className={styles.myTyping} duration={1} /></span>
                <span><TypingText text = {item.description}  className={styles.myTyping} delay={1}/></span>
              </div>
              <div className={styles.agentNameContainer}><InitialScrambleText to = {item.name} duration={1.5}/></div>
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
          <BiSolidLeftArrow
              style={{
                  color: 'white',
                  WebkitTextStroke: '1px white' // 이건 텍스트에만 적용되므로 대부분 무효
              }}
          />
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
                    currentAction="breath"
                ></AvatarScene>
                <div className={styles.agentDescription}>
                  <span><TypingText text={item.model} className="myTyping"/></span>
                  <span><TypingText text={item.description} className="myTyping" delay={1}/></span>
                </div>
                <div className={styles.agentNameContainer}><InitialScrambleText to={item.name} duration={1.5}/></div>
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
        <HoverScramble from = 'SELECT' to = 'START'/>
      </button>
    </div>
  );
}
