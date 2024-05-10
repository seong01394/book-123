// src/components/Chat.tsx
import SendIcon from '@mui/icons-material/Send';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Avatar } from 'antd';
import OpenAI from 'openai';
import React, { useEffect, useState } from 'react';
import dragonIcon from '../../../assets/free-icon-dragon-4475009.png';
import Message from '../Gpt/Message';
import { MessageDto } from '../Gpt/MessageDto';

const Gpt: React.FC = () => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageDto>>(
    new Array<MessageDto>(),
  );
  const [input, setInput] = useState<string>('');
  const [assistant, setAssistant] = useState<any>(null);
  const [thread, setThread] = useState<any>(null);
  const [openai, setOpenai] = useState<any>(null);

  useEffect(() => {
    initChatBot();
  }, []);

  useEffect(() => {
    setMessages([
      {
        content: '안녕하세요, 저는 마니또입니다! 무엇이든 물어보세요!',
        isUser: false,
      },
    ]);
  }, [assistant]);

  const initChatBot = async () => {
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const assistant = await openai.beta.assistants.retrieve(
      'asst_7ndVYiWftSY1lqgMlTa6h0dj',
    );
    const thread = await openai.beta.threads.create();

    setOpenai(openai);
    setAssistant(assistant);
    setThread(thread);
  };

  const createNewMessage = (content: string, isUser: boolean) => {
    const newMessage = new MessageDto(isUser, content);
    return newMessage;
  };

  const handleSendMessage = async () => {
    messages.push(createNewMessage(input, true));
    setMessages([...messages]);
    setInput('');

    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: input,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (response.status === 'in_progress' || response.status === 'queued') {
      console.log('기다리는 중...');
      setIsWaiting(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    setIsWaiting(false);

    const messageList = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messageList.data
      .filter(
        (message: any) =>
          message.run_id === run.id && message.role === 'assistant',
      )
      .pop();

    if (lastMessage) {
      console.log(lastMessage.content[0]['text'].value);
      setMessages([
        ...messages,
        createNewMessage(lastMessage.content[0]['text'].value, false),
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container
      maxWidth="md"
      style={{
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Paper
        elevation={3}
        style={{ padding: '10px', backgroundColor: '#f5f5f5' }}
      >
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Avatar
              src={dragonIcon}
              alt="Dragon"
              style={{ width: 32, height: 32 }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
              마니또
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Box
        sx={{
          flexGrow: 1,
          border: '1px solid #ced4da',
          borderRadius: '8px',
          padding: '10px',
          overflowY: 'auto',
          marginTop: '8px',
          marginBottom: '8px',
        }}
      >
        <Grid container direction="column" spacing={2}>
          {messages.map((message, index) => (
            <Grid
              item
              alignSelf={message.isUser ? 'flex-end' : 'flex-start'}
              key={index}
            >
              <Message key={index} message={message} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Grid
        container
        direction="row"
        alignItems="center"
        spacing={1}
        style={{ padding: '8px' }}
      >
        <Grid item xs={10}>
          <TextField
            label="메시지 입력"
            variant="outlined"
            disabled={isWaiting}
            fullWidth
            value={input}
            size="small" // 이 속성을 추가하여 입력창 크기를 조정합니다.
            InputProps={{
              style: { height: '56px' }, // 버튼의 높이와 일치하도록 입력창 높이 조정
            }}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {isWaiting && <LinearProgress color="inherit" />}
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleSendMessage}
            disabled={isWaiting}
            style={{ height: '56px' }} // 버튼의 높이를 입력창과 일치시킵니다.
          >
            {isWaiting ? <CircularProgress size={24} /> : <SendIcon />}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Gpt;
