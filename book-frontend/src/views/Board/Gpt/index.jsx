import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useState } from 'react';
import './style.css';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const Chat = () => {
  // setMessage 유즈스텟
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sender: 'ChatGPT',
      direction: 'incoming',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // 샌딩 리퀘스트 핸들러, 채팅창 목록
  const handleSendRequest = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: 'user',
    };

    //메세지 포멧, 채팅창
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: 'ChatGPT',
          direction: 'incoming',
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  //chatGPT에게 전달하는 메세지 처리 함수
  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === 'ChatGPT' ? 'assistant' : 'user';
      return { role, content: messageObject.message };
    });

    //API 요청 바디, 모델을 정의하고 메세지를 포멧
    const apiRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "You're a restaurant recommendation expert. You recommend appropriate restaurants based on what user says.",
        },
        ...apiMessages,
      ],
    };

    //답변 받아옴, 바디에 헤더(API키, 컨텐츠타입) 붙여서 송신
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  //채팅창 레이아웃
  return (
    <div className="root-container Chat">
      <div style={{ position: 'relative', height: '800px', width: '700px' }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="열심히 답변하는 중..." />
                ) : null
              }
            >
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput
              placeholder="메세지 입력"
              onSend={handleSendRequest}
              attachButton="false"
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};

export default Chat;
