import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end()

    const { text } = req.body

    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyC5MCrRINOvp2nmDN7mDLOr_woIZMASqFM`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            input: { text },
            voice: { languageCode: 'ko-KR', name: 'ko-KR-Standard-D' },
            audioConfig: { audioEncoding: 'MP3' }
        }),
    })

    const data = await response.json()
    const audioBuffer = Buffer.from(data.audioContent, 'base64')

    const filePath = path.join(process.cwd(), 'public/tts', 'tts_output.mp3')
    fs.writeFileSync(filePath, audioBuffer)

    return res.status(200).json({ success: true })
}
