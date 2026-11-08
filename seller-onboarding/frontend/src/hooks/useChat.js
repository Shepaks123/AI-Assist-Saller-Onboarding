import { useCallback, useRef, useState } from 'react';
import * as chatbotAPI from '../services/chatbotAPI';
import { getErrorMessage } from '../services/apiClient';

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hi! I can explain each onboarding step, list the documents you need, and tell you what is still missing. What would you like to know?',
  suggestions: ['What is still missing?', 'Which documents do I need?', 'Explain this step'],
};

export function useChat(currentStep = 0) {
  const [messages, setMessages] = useState([WELCOME]);
  const [sending, setSending] = useState(false);
  const counter = useRef(0);

  const send = useCallback(
    async (text) => {
      const message = text.trim();
      if (!message || sending) return;
      const userMsg = { id: `u${++counter.current}`, role: 'user', text: message };
      const history = [...messages, userMsg].filter((m) => m.id !== 'welcome').slice(-10).map((m) => ({ role: m.role, text: m.text }));
      setMessages((m) => [...m, userMsg]);
      setSending(true);
      try {
        const data = await chatbotAPI.sendMessage({ message, step: currentStep, history });
        setMessages((m) => [...m, { id: `a${++counter.current}`, role: 'assistant', text: data.reply, suggestions: data.suggestions || [] }]);
      } catch (err) {
        setMessages((m) => [...m, { id: `e${++counter.current}`, role: 'assistant', error: true, text: getErrorMessage(err, 'I could not answer that. Please try again.') }]);
      } finally {
        setSending(false);
      }
    },
    [messages, sending, currentStep]
  );

  const reset = useCallback(() => setMessages([WELCOME]), []);
  return { messages, sending, send, reset };
}
