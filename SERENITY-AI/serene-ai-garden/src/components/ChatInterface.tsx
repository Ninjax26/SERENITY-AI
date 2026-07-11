import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Heart, Sparkles, MessageCircle, Mic, MicOff, Volume2, Download, Upload, Bot } from 'lucide-react';
import { getGeminiAIResponse, detectMood } from "../aii";
import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import { toast } from "@/hooks/use-toast";
import { SpeechRecognitionEvent } from "@/lib/types";

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
  const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(null);
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
          .limit(100)
          .then(({ data: rows, error }) => {
            if (error) {
              setError('Failed to load chat messages.');
            } else if (rows?.length) {
              setMessages(rows.map((row: { id: string; content: string; sender: 'user' | 'ai'; created_at: string; emotion?: string }) => ({
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
    const SpeechRecognition = (window as unknown as { SpeechRecognition: typeof SpeechRecognition; webkitSpeechRecognition: typeof SpeechRecognition }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
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

    try {
      // Save the user message first so the persisted thread stays consistent.
      const { error: insertError } = await supabase.from('chat_messages').insert({
        user_id: user.id,
        content: userMessage.content,
        sender: userMessage.sender,
        created_at: userMessage.timestamp.toISOString(),
        emotion: userMessage.emotion || null
      });
      if (insertError) throw insertError;

      // The current message is appended inside getGeminiAIResponse, so only send prior context here.
      const contextMessages = messages.slice(-6).map(m => ({
        role: m.sender,
        content: m.content
      }));
      let mood = 'neutral';
      try {
        mood = await detectMood(userMessage.content);
      } catch {
        // Mood classification enhances the prompt but must not block the main reply.
      }
      const aiText = await getGeminiAIResponse({
        userMessage: userMessage.content,
        contextMessages,
        mood
      });
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiText,
        sender: 'ai',
        timestamp: new Date(),
        emotion: mood || 'supportive'
      };
      setMessages(prev => [...prev, aiMessage]);

      // A persistence failure should not discard a response the user already received.
      const { error: aiInsertError } = await supabase.from('chat_messages').insert({
        user_id: user.id,
        content: aiMessage.content,
        sender: aiMessage.sender,
        created_at: aiMessage.timestamp.toISOString(),
        emotion: aiMessage.emotion
      });
      if (aiInsertError) {
        toast({ title: "Reply not saved", description: "The response is visible, but could not be added to your history.", variant: "destructive" });
      }
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
      toast({ title: "Not supported", description: "Speech recognition is not supported in this browser.", variant: "destructive" });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        toast({ title: "Microphone unavailable", description: "Voice input could not be started.", variant: "destructive" });
      }
    }
  };

  const handleSpeakAI = () => {
    if (!('speechSynthesis' in window)) {
      toast({ title: "Not supported", description: "Speech synthesis is not supported in this browser.", variant: "destructive" });
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

  const saveImportedMessage = async (content: string) => {
    if (!user || !content.trim()) {
      throw new Error('No readable text was found in this file.');
    }
    const importedMsg: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    const { error } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      content: importedMsg.content,
      sender: importedMsg.sender,
      created_at: importedMsg.timestamp.toISOString(),
      emotion: null
    });
    if (error) throw error;
    setMessages(prev => [...prev, importedMsg]);
  };

  // Add file import handlers
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!user) {
      setLoginWarning('You must be signed in before importing chat history.');
      return;
    }
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Please upload files under 10 MB.", variant: "destructive" });
      return;
    }
    if (file.type === 'text/csv') {
      Papa.parse(file, {
        complete: async (results) => {
          const text = (results.data as string[][]).map(row => row.join(', ')).join('\n');
          try {
            await saveImportedMessage(text);
            toast({ title: "CSV imported", description: "The imported message was saved." });
          } catch (error) {
            toast({ title: "Import failed", description: error instanceof Error ? error.message : "The CSV could not be imported.", variant: "destructive" });
          }
        },
        error: () => toast({ title: "Import failed", description: "Failed to parse CSV file.", variant: "destructive" })
      });
    } else if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: { str: string }) => item.str).join(' ') + '\n';
          }
          await saveImportedMessage(text);
          toast({ title: "PDF imported", description: "The imported message was saved." });
        } catch (error) {
          toast({ title: "Import failed", description: error instanceof Error ? error.message : "The PDF could not be imported.", variant: "destructive" });
        }
      };
      reader.onerror = () => toast({ title: "Import failed", description: "The PDF could not be read.", variant: "destructive" });
      reader.readAsArrayBuffer(file);
    } else {
      toast({ title: "Unsupported file", description: "Please upload a PDF or CSV file.", variant: "destructive" });
    }
  };

  // Export chat as CSV
  const exportChatAsCSV = () => {
    const csvContent = Papa.unparse(messages.map((message) => ({
      Sender: message.sender,
      Content: message.content,
      Time: message.timestamp.toISOString()
    })));
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
    let y = 15;
    messages.forEach((message) => {
      const lines = doc.splitTextToSize(`${message.sender.toUpperCase()}: ${message.content}`, 185);
      const blockHeight = lines.length * 6 + 10;
      if (y + blockHeight > 285) {
        doc.addPage();
        y = 15;
      }
      doc.text(lines, 10, y);
      y += lines.length * 6;
      doc.setFontSize(9);
      doc.text(message.timestamp.toLocaleString(), 10, y + 1);
      doc.setFontSize(12);
      y += 10;
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
    <main className="min-h-screen bg-[#f3f7f5] pb-14 text-foreground dark:bg-slate-950">
      <header className="border-b border-emerald-950/10 bg-[#173f36] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 sm:py-10 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">AI companion</p><h1 className="mt-3 font-serif text-4xl font-bold tracking-tight sm:text-5xl">A calm place to talk things through.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/70 sm:text-base">Share what is on your mind. Serenity responds with reflection and general support, not diagnosis.</p></div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3"><span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-300/20"><Bot className="h-5 w-5 text-emerald-200" /><span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#285047] bg-emerald-300" /></span><div><p className="text-sm font-bold">Serenity is ready</p><p className="text-xs text-white/55">{messages.length} messages in this conversation</p></div></div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6">
        {/* Error and Login Warning */}
        {loginWarning && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            {loginWarning}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
            {error}
          </div>
        )}
        {/* Export Buttons */}
        <div className="mb-3 flex flex-wrap justify-end gap-2">
          <Button variant="outline" size="sm" className="rounded-full bg-white dark:bg-slate-900" onClick={exportChatAsCSV}><Download className="mr-2 h-3.5 w-3.5" />CSV</Button>
          <Button variant="outline" size="sm" className="rounded-full bg-white dark:bg-slate-900" onClick={exportChatAsPDF}><Download className="mr-2 h-3.5 w-3.5" />PDF</Button>
        </div>

        {/* Chat Container */}
        <Card className="overflow-hidden rounded-[1.75rem] border-slate-200 bg-white shadow-xl shadow-emerald-950/5 animate-fade-in dark:border-slate-800 dark:bg-slate-900" style={{animationDelay: '0.2s'}}>
          <CardHeader className="border-b border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-rose-400" />
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">This conversation</span>
              </div>
              <Badge variant="secondary" className="bg-serenity-100 text-serenity-700">
                <MessageCircle className="w-3 h-3 mr-1" />
                {messages.length} messages
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[52vh] min-h-96 overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(209,238,226,.42),transparent_45%)] p-4 space-y-5 sm:p-7 dark:bg-none">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 shadow-sm sm:max-w-[72%] ${
                      message.sender === 'user'
                        ? 'rounded-[1.25rem_1.25rem_.35rem_1.25rem] bg-[#176b57] text-white'
                        : 'rounded-[1.25rem_1.25rem_1.25rem_.35rem] border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
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
            <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">A place to begin</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setNewMessage(reply)}
                    className="shrink-0 rounded-full border-emerald-200 text-xs text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:p-6">
              {/* Voice Chat Section */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  onClick={handleVoiceInput}
                  variant={isListening ? 'destructive' : 'outline'}
                  size="sm" className={`rounded-full ${isListening ? 'animate-pulse' : ''}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span className="ml-2">{isListening ? 'Stop Listening' : 'Voice Input'}</span>
                </Button>
                <Button
                  type="button"
                  onClick={handleSpeakAI}
                  variant={isSpeaking ? 'secondary' : 'outline'}
                  size="sm" className={`rounded-full ${isSpeaking ? 'animate-pulse' : ''}`}
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
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-emerald-400 dark:border-slate-700 dark:bg-slate-900">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  maxLength={4000}
                  className="min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className="h-10 w-10 shrink-0 rounded-xl bg-emerald-700 p-0 text-white hover:bg-emerald-800"
                >
                  <Send className="w-4 h-4" />
                </Button>
                <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-emerald-700 dark:border-slate-700 dark:hover:bg-slate-800" title="Import PDF or CSV">
                  <Upload className="h-4 w-4" /><span className="sr-only">Import PDF/CSV</span>
                  <input type="file" accept=".csv,application/pdf" onChange={handleFileImport} style={{ display: 'none' }} />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Serenity AI offers support, not medical diagnosis or emergency care.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ChatInterface;
