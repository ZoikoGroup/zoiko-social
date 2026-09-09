-- 1. Add metadata to messages
ALTER TABLE messages
ADD COLUMN metadata JSONB;

-- 2. Create message_polls table
CREATE TABLE message_polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL UNIQUE REFERENCES messages(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create message_poll_options table
CREATE TABLE message_poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES message_polls(id) ON DELETE CASCADE,
    text TEXT NOT NULL
);

-- 4. Create message_poll_votes table
CREATE TABLE message_poll_votes (
    option_id UUID NOT NULL REFERENCES message_poll_options(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (option_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_message_polls_message_id ON message_polls(message_id);
CREATE INDEX idx_message_poll_options_poll_id ON message_poll_options(poll_id);
CREATE INDEX idx_message_poll_votes_user_id ON message_poll_votes(user_id);
