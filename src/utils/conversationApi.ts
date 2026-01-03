import type { Conversation, Message } from '../types';

type ConversationRow = {
  id: string;
  title: string;
  messages: Message[] | Array<Omit<Message, 'timestamp'> & { timestamp: string | number }> | string;
  files?: Conversation['files'] | string;
  created_at: string;
  updated_at: string;
};

const toDate = (value: string | number | Date | undefined) => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const normalizeMessage = (message: Message | (Omit<Message, 'timestamp'> & { timestamp: string | number })) => ({
  ...message,
  timestamp: toDate(message.timestamp),
});

const parseJsonField = <T,>(value: T | string | undefined) => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
};

const deserializeConversation = (row: ConversationRow): Conversation => {
  const rawMessages = parseJsonField<ConversationRow['messages']>(row.messages);
  const rawFiles = parseJsonField<ConversationRow['files']>(row.files);

  return {
    id: row.id,
    title: row.title,
    messages: Array.isArray(rawMessages) ? rawMessages.map(normalizeMessage) : [],
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
    files: Array.isArray(rawFiles) ? rawFiles : [],
  };
};

const serializeConversation = (conversation: Conversation) => ({
  id: conversation.id,
  title: conversation.title,
  messages: (conversation.messages || []).map((message) => ({
    ...message,
    timestamp: toDate(message.timestamp).toISOString(),
  })),
  files: conversation.files || [],
  createdAt: toDate(conversation.createdAt).toISOString(),
  updatedAt: toDate(conversation.updatedAt).toISOString(),
});

const parseJson = async (response: Response) => {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const listConversations = async (token?: string | null) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await fetch('/api/conversations', {
    method: 'GET',
    credentials: 'include',
    headers,
  });

  const data = (await parseJson(response)) as { conversations?: ConversationRow[]; error?: string };
  if (!response.ok) {
    throw new Error(data.error || 'Failed to load conversations');
  }

  return (data.conversations || []).map(deserializeConversation);
};

export const getConversation = async (token?: string | null, id?: string) => {
  if (!id) return null;
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const response = await fetch(`/api/conversations/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    return null;
  }

  const data = (await parseJson(response)) as { conversation?: ConversationRow; error?: string };
  if (!data.conversation) {
    return null;
  }

  return deserializeConversation(data.conversation);
};

export const createConversation = async (token: string | null | undefined, conversation: Conversation) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch('/api/conversations', {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ conversation: serializeConversation(conversation) }),
  });

  const data = (await parseJson(response)) as { error?: string };
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create conversation');
  }
};

export const upsertConversation = async (token: string | null | undefined, conversation: Conversation) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`/api/conversations/${conversation.id}`, {
    method: 'PUT',
    credentials: 'include',
    headers,
    body: JSON.stringify({ conversation: serializeConversation(conversation) }),
  });

  const data = (await parseJson(response)) as { error?: string };
  if (!response.ok) {
    throw new Error(data.error || 'Failed to save conversation');
  }
};

export const deleteConversation = async (token: string | null | undefined, conversationId: string) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  await fetch(`/api/conversations/${conversationId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers,
  });
};

export const clearConversations = async (token: string | null | undefined) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  await fetch('/api/conversations', {
    method: 'DELETE',
    credentials: 'include',
    headers,
  });
};
