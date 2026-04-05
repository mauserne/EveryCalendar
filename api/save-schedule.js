import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv(); // Vercel에 설정된 환경변수를 자동으로 읽어옴

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { user, dates } = req.body;
    if (!user) return res.status(400).json({ error: '이름 누락' });

    try {
        // Redis에서 전체 데이터 가져오기 (없으면 빈 객체)
        let data = (await redis.get('schedule_data')) || { users: {} };
        
        // 데이터 구조 보장 및 업데이트
        if (!data.users) data.users = {};
        data.users[user] = dates;

        // Redis에 다시 저장
        await redis.set('schedule_data', data);
        
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: '저장 실패' });
    }
}
