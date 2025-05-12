// pages/api/whisper.js
import { exec } from 'child_process'
import path from 'path'

export default function handler(req, res) {
    const scriptPath = path.join(process.cwd(), 'transcribe_mp3.py')

    exec(`python "${scriptPath}"`, (err, stdout, stderr) => {
        if (err) {
            console.error('❌ Whisper 실행 실패:', stderr)
            return res.status(500).json({ error: 'Whisper 실행 오류' })
        }

        console.log('✅ Whisper 실행 성공:', stdout)
        return res.status(200).json({ success: true })
    })
}
