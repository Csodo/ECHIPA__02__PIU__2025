import { useState } from 'react';
import './AssistantChat.css';

const systemPrompt = `You are the AI asistent for Energy Portal, a demo React app that simuleaza un portal energetic.
- Rolul tau: raspunzi concis si prietenos la intrebari despre app (login demo, planificare producatori/consumatori/baterii, monitorizare, calculator ROI), nu inventezi functionalitati inexistente.
- Nu oferi chei sau date sensibile. Spune cand lipseste informatia sau daca utilizatorul cere ceva in afara aplicatiei.
- Daca utilizatorul cere instructiuni, explica pasii pe scurt.`;

function AssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Salut! Sunt aici sa te ajut cu aplicatia Energy Portal.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: trimmed },
        {
          role: 'assistant',
          content: 'Seteaza REACT_APP_OPENAI_API_KEY in .env pentru a folosi chat-ul.',
        },
      ]);
      setInput('');
      return;
    }

    const userMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(({ role, content }) => ({ role, content })),
            userMessage,
          ],
          temperature: 0.4,
          max_tokens: 400,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim() || 'Nu am un raspuns acum.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'A aparut o eroare la generarea raspunsului. Incearca din nou.',
        },
      ]);
      // Optionally log error to console for devs
      console.error('Chat error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        type="button"
        className="assistant-bubble"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Inchide asistentul' : 'Deschide asistentul'}
      >
        💬
      </button>

      {isOpen && (
        <div className="assistant-panel">
          <header className="assistant-header">
            <div>
              <strong>Asistent Energy Portal</strong>
              <p>GPT-4o mini · Raspunsuri rapide</p>
            </div>
            <button
              type="button"
              className="assistant-close"
              onClick={() => setIsOpen(false)}
              aria-label="Inchide chat"
            >
              ×
            </button>
          </header>

          <div className="assistant-messages">
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={`assistant-msg ${msg.role}`}>
                <span>{msg.content}</span>
              </div>
            ))}
            {isLoading && (
              <div className="assistant-msg assistant">
                <span>Se genereaza raspuns...</span>
              </div>
            )}
          </div>

          <div className="assistant-input">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Scrie un mesaj..."
              rows={2}
            />
            <button type="button" onClick={handleSend} disabled={isLoading}>
              Trimite
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AssistantChat;
