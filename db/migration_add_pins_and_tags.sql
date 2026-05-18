-- Migration: Add pinned and tags to conversations
-- Date: 2025-05-18
-- Safe: additive only, backward compatible

ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS pinned BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS conversations_pinned_idx 
ON conversations (user_id, pinned DESC, updated_at DESC);
