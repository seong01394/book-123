import { useState } from 'react';
import './style.css';

export default function Gpt() {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');

  const apiKey: string = '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';
  const apiEndpoint: string = 'https://api.openai.com/v1/chat/completions';

  const handleClick = async () => {
    const message: string = userInput.trim();
    if (message.length === 0) return;

    addMessage('나', message);
    setUserInput('');

    const aiResponse: string = await fetchAIResponse(message);
    addMessage('챗봇', aiResponse);
  };

  const addMessage = (sender: string, message: string): void => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      `${sender}: ${message}`,
    ]);
  };

  const fetchAIResponse = async (prompt: string): Promise<string> => {
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-0125',
        messages: [
          {
            role: 'system',
            content: "You answers based on file 'shorts.json'",
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        stop: ['Human'],
      }),
    };

    try {
      const response = await fetch(apiEndpoint, requestOptions);
      const data = await response.json();
      const aiResponse: string = data.choices[0].message.content;
      return aiResponse;
    } catch (error) {
      console.error('OpenAI API 호출 중 오류 발생:', error);
      return 'OpenAI API 호출 중 오류 발생';
    }
  };

  return (
    <div className="all-container">
      <div id="chat-container">
        <div className="hiword">OpenAI를 이용한 챗봇1</div>
        <div id="chat-messages">
          {chatMessages.map((message, index) => (
            <div key={index} className="message">
              {message}
            </div>
          ))}
        </div>
        <div id="user-input">
          <input
            type="text"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
          />
          <button onClick={handleClick}>전송</button>
        </div>
      </div>
    </div>
  );
}
