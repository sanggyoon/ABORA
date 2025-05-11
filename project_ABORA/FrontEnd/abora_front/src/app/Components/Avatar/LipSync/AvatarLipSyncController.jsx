// components/AvatarLipSyncController.jsx
import React, { useEffect } from 'react'
import Hangul from 'hangul-js'
import mapKoreanToShape from '../utils/mapKoreanToShape'

export default function AvatarLipSyncController({ setCurrentPhoneme }) {
    const play = async () => {
        const res = await fetch('/tts/tts_output.json')
        const segments = await res.json()

        const timeline = []

        segments.forEach(({ text, start, end }) => {
            const jamos = Hangul.disassemble(text).filter(j => j.trim())
            const duration = end - start
            const per = duration / jamos.length

            jamos.forEach((j, i) => {
                timeline.push({
                    phoneme: mapKoreanToShape(j),
                    start: +(start + i * per).toFixed(2),
                    end: +(start + (i + 1) * per).toFixed(2)
                })
            })
        })

        const audio = new Audio(`/tts/tts_output.mp3?ts=${Date.now()}`);
        const startTime = Date.now()

        audio.onplay = () => {
            timeline.forEach(({ phoneme, start, end }) => {
                setTimeout(() => {
                    setCurrentPhoneme(phoneme)
                }, start * 1000 - (Date.now() - startTime))

                setTimeout(() => {
                    setCurrentPhoneme('SLIENCE')
                }, end * 1000 - (Date.now() - startTime))
            })
        }

        audio.play()
    }

    return (
        <button onClick={play}>
            립싱크 테스트
        </button>
    )
}
