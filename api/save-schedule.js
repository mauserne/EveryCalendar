import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { user, dates } = req.body;

  // upsert: 이름이 같으면 업데이트, 없으면 새로 저장
  const { data, error } = await supabase
    .from('schedules')
    .upsert({ user_name: user, selected_dates: dates }, { onConflict: 'user_name' });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true });
}
