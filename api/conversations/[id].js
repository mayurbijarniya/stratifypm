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

  const conversationId = req.query?.id || req.params?.id;
  if (!conversationId) {
    return res.status(400).json({ error: 'Missing conversation id' });
  }

  if (req.method === 'GET') {
    const rows = await sql`
      select id, title, messages, files, created_at, updated_at
      from conversations
      where id = ${conversationId} and user_id = ${session.user.id}
      limit 1
    `;

    if (!rows.length) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    return res.status(200).json({ conversation: rows[0] });
  }

  if (req.method === 'PUT') {
    const body = parseBody(req);
    const conversation = body.conversation || body;

    if (!conversation?.title) {
      return res.status(400).json({ error: 'Missing conversation title' });
    }

    const existing = await sql`
      select user_id
      from conversations
      where id = ${conversationId}
      limit 1
    `;

    if (existing.length && existing[0].user_id !== session.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const createdAt = conversation.createdAt ? new Date(conversation.createdAt) : new Date();
    const updatedAt = new Date();

    await sql`
      insert into conversations (id, user_id, title, messages, files, created_at, updated_at)
      values (
        ${conversationId},
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
    `;

    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    await sql`
      delete from conversations
      where id = ${conversationId} and user_id = ${session.user.id}
    `;
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
