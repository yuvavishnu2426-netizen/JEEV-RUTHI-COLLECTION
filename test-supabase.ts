import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://hylbqgzwchitwgoyglwp.supabase.co', 'sb_publishable_kJTO6l2eA-gyF9BsRj-y3A_-ohrg1n8');

async function test() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log('Profiles:', data);
}
test();
