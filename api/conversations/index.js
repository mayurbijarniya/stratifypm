import { setCors } from '../_utils/cors.js';
import { getAuthSession } from '../_utils/auth.js';
import { sql } from '../_utils/db.js';

const parseBody = (req) => {
  return typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
};

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const session = await getAuthSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const rows = await sql`
      select id, title, messages, files, created_at, updated_at
      from conversations
      where user_id = ${session.user.id}
      order by updated_at desc
    `;

    return res.status(200).json({ conversations: rows });
  }

  if (req.method === 'POST') {
    const body = parseBody(req);
    const conversation = body.conversation || body;

    if (!conversation?.id || !conversation?.title) {
      return res.status(400).json({ error: 'Missing conversation id or title' });
    }

    const createdAt = conversation.createdAt ? new Date(conversation.createdAt) : new Date();
    const updatedAt = conversation.updatedAt ? new Date(conversation.updatedAt) : new Date();

    await sql`
      insert into conversations (id, user_id, title, messages, files, created_at, updated_at)
      values (
        ${conversation.id},
        ${session.user.id},
        ${conversation.title},
        ${JSON.stringify(conversation.messages || [])},
        ${JSON.stringify(conversation.files || [])},
        ${createdAt},
        ${updatedAt}
      )
      on conflict (id) do update set
        title = excluded.title,
        messages = excluded.messages,
        files = excluded.files,
        updated_at = excluded.updated_at
      where conversations.user_id = excluded.user_id
    `;

    return res.status(201).json({ success: true });
  }

  if (req.method === 'DELETE') {
    await sql`
      delete from conversations
      where user_id = ${session.user.id}
    `;
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
