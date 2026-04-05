import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { name } = req.query;

  try {
    // 모든 유저의 데이터를 한 번에 가져옴
    const { data: rows, error } = await supabase
      .from('schedules')
      .select('user_name, selected_dates');

    if (error) throw error;

    // 1. 현재 접속한 유저의 데이터만 필터링
    const myData = rows.find(r => r.user_name === name);
    const userDates = myData ? myData.selected_dates : [];

    // 2. 전체 인원수 통계 계산 (달력 표시용)
    const totalCounts = {};
    rows.forEach(row => {
      row.selected_dates.forEach(date => {
        totalCounts[date] = (totalCounts[date] || 0) + 1;
      });
    });

    return res.status(200).json({ userDates, totalCounts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
