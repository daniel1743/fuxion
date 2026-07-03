import { evaluateChatEvents, processChatConversation } from './chatEvents.js';

export const analyzeConversation = async ({ conversation, startedAt }) => {
  return await processChatConversation({ conversation, startedAt });
};

export const scoreConversation = ({ conversation, startedAt }) => {
  return evaluateChatEvents({ conversation, startedAt });
};
