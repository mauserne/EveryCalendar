import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { user, dates } = req.body;

  if (!user || !Array.isArray(dates)) {
    return res.status(400).json({ error: 'user와 dates가 필요합니다.' });
  }

  const { error } = await supabase
    .from('schedules')
    .upsert({ user_name: user, selected_dates: dates }, { onConflict: 'user_name' });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true });
}
