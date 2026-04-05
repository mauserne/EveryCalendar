import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    const { name } = req.query;

    try {
        const data = (await redis.get('schedule_data')) || { users: {} };
        const users = data.users || {};

        // 1. 해당 유저가 선택한 날짜
        const userDates = users[name] || [];

        // 2. 전체 날짜별 투표 인원 계산
        const totalCounts = {};
        Object.values(users).forEach(dates => {
            dates.forEach(date => {
                totalCounts[date] = (totalCounts[date] || 0) + 1;
            });
        });

        return res.status(200).json({ userDates, totalCounts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: '조회 실패' });
    }
}
