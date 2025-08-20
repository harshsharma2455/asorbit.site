import React, { useState, useEffect, useRef, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';

// --- Type Definition ---
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

// --- SVG Icons ---
const ChatIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

// --- Chatbot Component ---
const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! How can I help you with your AI automation needs today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const N8N_WEBHOOK_URL = '/.netlify/functions/proxyWebhookChat';

  useEffect(() => {
    // Generate a unique session ID for the chat session
    setSessionId(crypto.randomUUID());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue, sessionId }),
      });

      if (!response.ok) {
        console.error(`Webhook failed with status ${response.status}`);
        const errorBody = await response.text();
        console.error('Error body:', errorBody);
        throw new Error(`Webhook failed with status ${response.status}`);
      }

      const data = await response.json();

      let responseText: string | undefined;

      // Attempt to parse known response structures from n8n webhooks
      if (Array.isArray(data) && data.length > 0 && data[0].json) {
        const nestedJson = data[0].json;
        responseText = nestedJson.output || nestedJson.response || nestedJson.text || nestedJson.answer || nestedJson.message;
      } else if (typeof data === 'object' && data !== null) {
        responseText = (data as any).output || (data as any).response || (data as any).text || (data as any).answer || (data as any).message;
      } else if (typeof data === 'string') {
        responseText = data;
      }

      if (!(typeof responseText === 'string' && responseText.trim() !== '')) {
        console.warn("Could not find a standard response key. Stringifying the response.", data);
        responseText = JSON.stringify(data);
      }

      const botMessage: Message = { sender: 'bot', text: responseText };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with n8n agent:", error);
      const errorMessage: Message = { sender: 'bot', text: "I'm sorry, but I'm having trouble connecting right now. Please try again in a moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- Chat Window --- */}
      <div
        className={`fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[600px] z-50 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 rounded-t-2xl">
          <h3 className="text-lg font-bold text-slate-800">Asorbit Assistant</h3>
          <button onClick={toggleChat} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors" aria-label="Close chat">
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-100/50 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 text-white flex items-center justify-center font-bold text-xs">AI</div>}
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
                <ReactMarkdown className="prose prose-sm whitespace-pre-wrap">
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 text-white flex items-center justify-center font-bold text-xs">AI</div>
              <div className="max-w-[80%] p-3 rounded-2xl bg-slate-200 text-slate-800 rounded-bl-lg">
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="flex-shrink-0 p-3 border-t border-slate-200 bg-white rounded-b-2xl">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              type="submit"
              className="flex-shrink-0 w-11 h-11 bg-indigo-600 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:scale-100"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>

      {/* --- FAB (Floating Action Button) --- */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-4 sm:right-8 z-50 w-16 h-16 bg-indigo-600 rounded-full text-white shadow-xl flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <div className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-90 scale-75' : 'rotate-0'}`}>
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </div>
      </button>
    </>
  );
};

export default Chatbot;
