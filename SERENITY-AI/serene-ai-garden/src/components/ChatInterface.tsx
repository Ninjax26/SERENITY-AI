import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Heart, Sparkles, Smile, MessageCircle, Mic, MicOff, Volume2 } from 'lucide-react';
import { getGeminiAIResponse, detectMood, getDailyAffirmation } from "../aii";
import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js';
import jsPDF from 'jspdf';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI companion, here to listen and support you. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'caring'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loginWarning, setLoginWarning] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (!data.user) {
        setLoginWarning('You must be signed in to chat with the AI Companion. Please sign in.');
      } else {
        setLoginWarning(null);
        supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', data.user.id)
          .order('created_at', { ascending: true })
          .then(({ data: rows, error }) => {
            if (error) {
              setError('Failed to load chat messages.');
            } else if (rows) {
              setMessages(rows.map((row: any) => ({
                id: row.id,
                content: row.content,
                sender: row.sender,
                timestamp: new Date(row.created_at),
                emotion: row.emotion || undefined
              })));
            }
          });
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Voice recognition setup
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNewMessage(transcript);
      setIsListening(false);
    };
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => setIsListening(false);
  }, []);

  const handleSendMessage = async () => {
    setError(null);
    if (!newMessage.trim()) return;
    if (!user) {
      setLoginWarning('You must be signed in to chat with the AI Companion. Please sign in.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    // Save to Supabase
    const { error: insertError } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      content: userMessage.content,
      sender: userMessage.sender,
      created_at: userMessage.timestamp.toISOString(),
      emotion: userMessage.emotion || null
    });
    if (insertError) {
      setError('Failed to save message. Please try again.');
    }

    try {
      // Conversation context: last 6 messages
      const contextMessages = [...messages, userMessage].slice(-6).map(m => ({
        role: m.sender,
        content: m.content
      }));
      console.log('Context for Gemini:', contextMessages);
      // Mood detection
      console.log('Detecting mood for:', userMessage.content);
      const mood = await detectMood(userMessage.content);
      console.log('Detected mood:', mood);
      // Gemini API call
      console.log('Calling Gemini with:', { userMessage: userMessage.content, contextMessages, mood });
      const aiText = await getGeminiAIResponse({
        userMessage: userMessage.content,
        contextMessages,
        mood
      });
      console.log('Gemini response:', aiText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiText,
        sender: 'ai',
        timestamp: new Date(),
        emotion: mood || 'supportive'
      };
      setMessages(prev => [...prev, aiMessage]);
      // Save AI message to Supabase
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        content: aiMessage.content,
        sender: aiMessage.sender,
        created_at: aiMessage.timestamp.toISOString(),
        emotion: aiMessage.emotion
      });
    } catch (err) {
      console.error('Gemini API error:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I had trouble connecting to the AI service.',
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'supportive'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSpeakAI = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }
    const lastAI = [...messages].reverse().find(m => m.sender === 'ai');
    if (!lastAI) return;
    setIsSpeaking(true);
    const utter = new window.SpeechSynthesisUtterance(lastAI.content);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  // Add file import handlers
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    if (file.type === 'text/csv') {
      Papa.parse(file, {
        complete: async (results) => {
          const text = results.data.map((row: any) => row.join(', ')).join('\n');
          const importedMsg = {
            id: Date.now().toString(),
            content: text,
            sender: 'user' as 'user',
            timestamp: new Date(),
            emotion: undefined
          };
          setMessages(prev => [...prev, importedMsg]);
          await supabase.from('chat_messages').insert({
            user_id: user.id,
            content: importedMsg.content,
            sender: importedMsg.sender,
            created_at: importedMsg.timestamp.toISOString(),
            emotion: importedMsg.emotion || null
          });
        },
        error: () => alert('Failed to parse CSV file.')
      });
    } else if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        const importedMsg = {
          id: Date.now().toString(),
          content: text,
          sender: 'user' as 'user',
          timestamp: new Date(),
          emotion: undefined
        };
        setMessages(prev => [...prev, importedMsg]);
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          content: importedMsg.content,
          sender: importedMsg.sender,
          created_at: importedMsg.timestamp.toISOString(),
          emotion: importedMsg.emotion || null
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Unsupported file type. Please upload a PDF or CSV file.');
    }
  };

  // Export chat as CSV
  const exportChatAsCSV = () => {
    const csvRows = [
      'Sender,Content,Time',
      ...messages.map(m => `${m.sender},"${m.content.replace(/"/g, '""')}",${m.timestamp.toLocaleString()}`)
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat_messages.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export chat as PDF
  const exportChatAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    messages.forEach((m, i) => {
      doc.text(`${m.sender.toUpperCase()}: ${m.content}`, 10, 10 + i * 10);
      doc.text(`Time: ${m.timestamp.toLocaleString()}`, 10, 15 + i * 10);
    });
    doc.save('chat_messages.pdf');
  };

  const quickReplies = [
    "I'm feeling anxious",
    "I had a good day",
    "I'm struggling today",
    "I feel overwhelmed"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-4xl mx-auto">
        {/* Error and Login Warning */}
        {loginWarning && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded">
            {loginWarning}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
            {error}
          </div>
        )}
        {/* Export Buttons */}
        <div className="flex justify-end gap-2 mb-2">
          <Button variant="outline" size="sm" onClick={exportChatAsCSV}>Export as CSV</Button>
          <Button variant="outline" size="sm" onClick={exportChatAsPDF}>Export as PDF</Button>
        </div>
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-serenity-500 to-calm-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-serenity-600 to-calm-600 bg-clip-text text-transparent">
              AI Companion
            </h1>
          </div>
          <p className="text-muted-foreground">Your safe space for emotional support and meaningful conversations</p>
          <Badge className="mt-2 bg-wellness-100 text-wellness-700 border-wellness-200">
            <Sparkles className="w-4 h-4 mr-1" />
            Private & Secure
          </Badge>
        </div>

        {/* Chat Container */}
        <Card className="wellness-card shadow-2xl animate-fade-in" style={{animationDelay: '0.2s'}}>
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-wellness-400 rounded-full animate-pulse-gentle"></div>
                <span className="text-sm text-gray-500">AI Companion is online</span>
              </div>
              <Badge variant="secondary" className="bg-serenity-100 text-serenity-700">
                <MessageCircle className="w-3 h-3 mr-1" />
                {messages.length} messages
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-serenity-500 to-calm-500 text-white'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gray-100 border border-gray-200 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">Quick responses:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setNewMessage(reply)}
                    className="text-xs hover:bg-serenity-50 border-serenity-200 text-serenity-700"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-100">
              {/* Voice Chat Section */}
              <div className="flex items-center mb-3 gap-3">
                <Button
                  type="button"
                  onClick={handleVoiceInput}
                  variant={isListening ? 'destructive' : 'outline'}
                  className={isListening ? 'animate-pulse' : ''}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span className="ml-2">{isListening ? 'Stop Listening' : 'Voice Input'}</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleSpeakAI}
                  variant={isSpeaking ? 'secondary' : 'outline'}
                  className={isSpeaking ? 'animate-pulse' : ''}
                  disabled={isSpeaking}
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="ml-2">Read Last AI Reply</span>
                </Button>
                {(isListening || isSpeaking) && (
                  <span className="text-xs text-calm-600 font-semibold">
                    {isListening ? 'Listening...' : 'Speaking...'}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="flex-1 border-serenity-200 focus:border-serenity-400 focus:ring-serenity-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-serenity-500 to-calm-500 hover:from-serenity-600 hover:to-calm-600 text-white px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
                <label className="ml-2 cursor-pointer bg-gray-100 border border-gray-200 px-3 py-2 rounded-md text-xs text-gray-700 hover:bg-gray-200">
                  Import PDF/CSV
                  <input type="file" accept=".csv,application/pdf" onChange={handleFileImport} style={{ display: 'none' }} />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Your conversations are private and secure
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
