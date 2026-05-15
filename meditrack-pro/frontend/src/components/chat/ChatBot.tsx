import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { chatApi } from '../../api/chat.api';
import type { ChatMessage } from '../../types';

const SUGGESTED_PROMPTS = [
  'Give me a dashboard overview',
  'Show offline equipment',
  'What is the total maintenance cost?',
  'Show critical service requests',
  'Tell me about Radiology department',
  'Show staff directory',
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '👋 Hello! I\'m **MediTrack AI**, your intelligent dashboard assistant.\n\nAsk me anything about your equipment, maintenance, staff, alerts, or service requests.\n\nTry typing **"help"** to see what I can do!',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(messageText);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.content,
        timestamp: response.data.timestamp,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple markdown-like renderer for chat messages
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];

    let inTable = false;
    let tableRows: string[][] = [];
    let tableHeaders: string[] = [];

    const flushTable = () => {
      if (tableHeaders.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto my-2 rounded-lg border border-outline-variant/20">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-surface-container-high">
                  {tableHeaders.map((h, i) => (
                    <th key={i} className="px-2 py-1.5 text-left font-bold text-on-surface-variant uppercase tracking-wider">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {tableRows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-surface-container-low transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-2 py-1.5 text-on-surface">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      inTable = false;
      tableRows = [];
      tableHeaders = [];
    };

    lines.forEach((line, idx) => {
      // Table detection
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const cells = line.split('|').filter(c => c.trim() !== '');
        if (cells.every(c => c.trim().match(/^[-:]+$/))) return; // separator line
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        flushTable();
      }

      // Bold headers
      if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(<p key={idx} className="font-bold text-on-surface text-xs mt-2 mb-1">{line.replace(/\*\*/g, '')}</p>);
        return;
      }

      // Headings
      if (line.match(/^#{1,3}\s/)) {
        const text = line.replace(/^#{1,3}\s/, '');
        elements.push(<p key={idx} className="font-bold text-on-surface text-xs mt-2">{text}</p>);
        return;
      }

      // Bullet points
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        const text = line.replace(/^\s*[•-]\s*/, '');
        elements.push(
          <div key={idx} className="flex gap-1.5 text-[11px] text-on-surface-variant ml-1">
            <span className="text-primary mt-0.5">•</span>
            <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-on-surface">$1</strong>') }} />
          </div>
        );
        return;
      }

      // Empty lines
      if (line.trim() === '') {
        elements.push(<div key={idx} className="h-1.5" />);
        return;
      }

      // Regular text with bold formatting
      elements.push(
        <p key={idx} className="text-[11px] text-on-surface-variant leading-relaxed"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-on-surface">$1</strong>') }}
        />
      );
    });

    if (inTable) flushTable();

    return <div className="space-y-0.5">{elements}</div>;
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group ${
          isOpen
            ? 'bg-surface-container-high hover:bg-surface-bright rotate-0'
            : 'bg-gradient-to-br from-primary to-primary-container hover:scale-110'
        }`}
        id="chatbot-toggle"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-on-surface" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 text-on-primary" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-error rounded-full animate-pulse-soft" />
          </>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[99] w-[420px] max-h-[600px] bg-surface-container-low rounded-2xl shadow-2xl border border-outline-variant/15 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary-container/10 px-5 py-4 border-b border-outline-variant/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-headline text-sm font-bold text-on-surface">MediTrack AI</h3>
                <p className="text-[10px] text-primary font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full inline-block" />
                  Online — Ready to assist
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-hide" style={{ maxHeight: '400px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.role === 'user' ? 'bg-primary/20' : 'bg-surface-container-highest'
                }`}>
                  {msg.role === 'user'
                    ? <User className="w-3.5 h-3.5 text-primary" />
                    : <Bot className="w-3.5 h-3.5 text-on-surface-variant" />
                  }
                </div>
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-primary/15 text-on-surface rounded-tr-sm'
                    : 'bg-surface-container text-on-surface-variant rounded-tl-sm'
                }`}>
                  {msg.role === 'user'
                    ? <p className="text-xs text-on-surface">{msg.content}</p>
                    : renderContent(msg.content)
                  }
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-on-surface-variant" />
                </div>
                <div className="bg-surface-container rounded-xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts — only if few messages */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Quick prompts</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/10"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-outline-variant/10 flex-shrink-0">
            <div className="flex gap-2 items-center bg-surface-container rounded-xl px-3 py-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your dashboard data..."
                className="flex-1 bg-transparent text-xs text-on-surface placeholder:text-on-surface-variant/40 outline-none py-2"
                disabled={isLoading}
                id="chatbot-input"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-lg bg-primary/20 hover:bg-primary/30 disabled:opacity-30 flex items-center justify-center transition-colors"
                id="chatbot-send"
              >
                <Send className="w-3.5 h-3.5 text-primary" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
