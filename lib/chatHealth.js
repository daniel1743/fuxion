export const isConversationLong = ({ startedAt }) => {
  const durationMinutes = Math.max(0, Math.round((new Date().getTime() - new Date(startedAt).getTime()) / 60000));
  return durationMinutes >= 10;
};

export const buildChatMetadata = ({ conversation, startedAt }) => ({
  startedAt: new Date(startedAt).toISOString(),
  endedAt: new Date().toISOString(),
  durationMinutes: Math.max(0, Math.round((new Date().getTime() - new Date(startedAt).getTime()) / 60000)),
  messageCount: conversation.length
});
