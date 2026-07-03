import { analyzeConversation } from './eventEngine.js';

export const trackConversation = async ({ conversation, startedAt }) => {
  return await analyzeConversation({ conversation, startedAt });
};

export const isHighInterestConversation = ({ score }) => score >= 80;
