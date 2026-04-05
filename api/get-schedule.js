import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { name } = req.query;

  try {
    const { data: rows, error } = await supabase
      .from('schedules')
      .select('user_name, selected_dates');
    if (error) throw error;

    // 날짜별 이름 목록 (로그인 전에도 달력 표시에 사용)
    const usersByDate = {};
    rows.forEach(row => {
      (row.selected_dates || []).forEach(date => {
        if (!usersByDate[date]) usersByDate[date] = [];
        usersByDate[date].push(row.user_name);
      });
    });

    // 내 선택 날짜 (name 없이 호출 시 빈 배열)
    const myData = rows.find(r => r.user_name === name);
    const userDates = myData ? myData.selected_dates : [];

    return res.status(200).json({ userDates, usersByDate });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
