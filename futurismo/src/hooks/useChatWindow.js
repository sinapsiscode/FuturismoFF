import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

const useChatWindow = (chat) => {
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get initial messages based on chat type
  const getInitialMessages = () => {
    if (chat?.isFromAgenda) {
      return [
        {
          id: '1',
          senderId: 'system',
          senderName: 'System',
          content: 'chat.system.coordinationStarted',
          contentData: { name: chat.name },
          timestamp: new Date(),
          type: 'system',
          status: 'read'
        }
      ];
    }
    
    return [
      {
        id: '1',
        senderId: chat?.id,
        senderName: chat?.name,
        content: 'chat.messages.howIsEveryone',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        status: 'read'
      },
      {
        id: '2',
        senderId: 'current-user',
        senderName: 'You',
        content: 'chat.messages.readyForTour',
        timestamp: new Date(Date.now() - 3000000),
        type: 'text',
        status: 'read'
      },
      {
        id: '3',
        senderId: chat?.id,
        senderName: chat?.name,
        content: 'chat.messages.meetingPoint',
        timestamp: new Date(Date.now() - 2400000),
        type: 'text',
        status: 'read'
      },
      {
        id: '4',
        senderId: chat?.id,
        senderName: chat?.name,
        content: 'location',
        timestamp: new Date(Date.now() - 2340000),
        type: 'location',
        location: {
          name: 'Plaza de Armas de Lima',
          address: 'Cercado de Lima 15001',
          lat: -12.0464,
          lng: -77.0428
        },
        status: 'read'
      },
      {
        id: '5',
        senderId: 'current-user',
        senderName: 'You',
        content: 'chat.messages.understood',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
        status: 'delivered'
      },
      {
        id: '6',
        senderId: chat?.id,
        senderName: chat?.name,
        content: 'chat.messages.shareItinerary',
        timestamp: new Date(Date.now() - 600000),
        type: 'text',
        status: 'read'
      },
      {
        id: '7',
        senderId: chat?.id,
        senderName: chat?.name,
        content: 'document',
        timestamp: new Date(Date.now() - 540000),
        type: 'document',
        document: {
          name: 'Itinerario_City_Tour_Lima.pdf',
          size: '2.5 MB'
        },
        status: 'read'
      },
      {
        id: '8',
        senderId: 'current-user',
        senderName: 'You',
        content: chat?.typing ? '' : 'chat.messages.leavingHotel',
        timestamp: new Date(Date.now() - 300000),
        type: 'text',
        status: 'sent'
      }
    ];
  };

  const [messages, setMessages] = useState(() => getInitialMessages());

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      content: message,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate message status change
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate file send
      console.log('File selected:', file.name);
    }
  };

  const canMakeCalls = user?.role === 'agency' || user?.role === 'admin';

  const emojis = ['😊', '👍', '❤️', '😂', '🎉', '👏', '🙏', '😍', '🤔', '👋'];

  return {
    message,
    setMessage,
    messages,
    showEmojiPicker,
    setShowEmojiPicker,
    messagesEndRef,
    fileInputRef,
    handleSendMessage,
    handleFileSelect,
    canMakeCalls,
    emojis
  };
};

export default useChatWindow;