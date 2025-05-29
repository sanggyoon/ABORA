'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

interface HoverScrambleProps {
    from: string;
    to: string;
    className?: string;
}

export default function HoverScramble({ from, to, className }: HoverScrambleProps) {
    const textRef = useRef<HTMLSpanElement>(null);
    const currentTween = useRef<gsap.core.Tween | null>(null);
    const forceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (textRef.current) {
            textRef.current.textContent = from;
        }
    }, [from]);

    const scrambleTo = (targetText: string) => {
        if (!textRef.current) return;

        // 기존 tween 중단 및 강제 텍스트 초기화
        if (currentTween.current) currentTween.current.kill();
        if (forceTimeout.current) clearTimeout(forceTimeout.current);

        const el = textRef.current;
        const tween = gsap.to(el, {
            duration: 1,
            scrambleText: {
                text: targetText,
                chars: "!<>-_\\/[]{}—=+*^?#",
                speed: 0.3,
                revealDelay: 0.2,
            },
            overwrite: 'auto',
            onComplete: () => {
                if (forceTimeout.current) {
                    clearTimeout(forceTimeout.current);
                    forceTimeout.current = null;
                }
            },
        });

        // 1.1초 후에도 아직 제대로 바뀌지 않았다면 강제 보정
        forceTimeout.current = setTimeout(() => {
            if (el.textContent !== targetText) {
                el.textContent = targetText;
            }
        }, 1100);

        currentTween.current = tween;
    };

    const handleMouseEnter = () => scrambleTo(to);
    const handleMouseLeave = () => scrambleTo(from);

    return (
        <span
            ref={textRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={className}
            style={{ cursor: 'pointer', display: 'inline-block' }}
        />
    );
}
