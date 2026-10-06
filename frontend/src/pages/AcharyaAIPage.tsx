// ==============================================================================
// SANSKRITVERSE Acharya AI Sanskrit Tutor Page
// 7 Pedagogical Chat Modes, Word-by-Word Gloss Cards, Audio Synthesis & Quick Prompts
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ApiService } from '../services/api';
import { SpeechService } from '../services/speech';
import {
  Bot,
  Send,
  Volume2,
  Sparkles,
  BookOpen,
  Brain,
  Languages,
  PenTool,
  Trophy,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Mic,
  MicOff
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: string;
  sanskritGloss?: Array<{
    sanskrit: string;
    iast: string;
    pos: string;
    meaning: string;
    grammaticalNote?: string;
  }>;
  suggestedFollowUps?: string[];
  pedagogicalTip?: string;
}

export const AcharyaAIPage: React.FC = () => {
  const { user, addXp, sourceLanguage } = useAppStore();
  const [selectedMode, setSelectedMode] = useState<string>('tutor');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current = SpeechService.startSpeechRecognition(
        (transcript) => {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        },
        (err) => {
          console.error('Speech error:', err);
          setIsListening(false);
        }
      );
    }
  };

  const modes = [
    { id: 'tutor', name: 'Tutor Mode', desc: 'Socratic teacher guiding you step-by-step', icon: Bot, color: 'text-amber-400' },
    { id: 'conversation', name: 'Conversation', desc: 'Talk naturally with Acharya in Sanskrit', icon: BookOpen, color: 'text-emerald-400' },
    { id: 'grammar', name: 'Grammar Mode', desc: 'Pāṇinian rules, cases & verb systems', icon: Brain, color: 'text-blue-400' },
    { id: 'translation', name: 'Translation', desc: 'Indic ↔ Sanskrit with syntactic analysis', icon: Languages, color: 'text-purple-400' },
    { id: 'practice', name: 'Practice Mode', desc: 'Generate exercises & verify answers', icon: PenTool, color: 'text-pink-400' },
    { id: 'exam', name: 'Exam Mode', desc: 'Simulated assessment with strict feedback', icon: Trophy, color: 'text-yellow-400' },
    { id: 'mistake_coach', name: 'Mistake Coach', desc: 'Diagnose case & conjugation confusions', icon: AlertCircle, color: 'text-red-400' }
  ];

  const getLocalizedInitialMessage = (): ChatMessage => {
    if (sourceLanguage === 'ta') {
      return {
        id: 'm1',
        role: 'assistant',
        content: `வணக்கம் ${user.username}! நான் உங்கள் **ஆச்சார்யா AI (Acharya AI)** சமஸ்கிருத குரு.\n\nநீங்கள் சமஸ்கிருதம் பேச விரும்பினாலும், பாணினியின் இலக்கண விதிகளை கற்க விரும்பினாலும், நான் உங்களுக்கு உதவத் தயார். மேலே உள்ள ஒரு பயன்முறையைத் தேர்வுசெய்து எதையும் கேளுங்கள்!`,
        sanskritGloss: [
          { sanskrit: 'नमस्ते', iast: 'namaste', pos: 'Greeting', meaning: 'வணக்கம் (Salutations)', grammaticalNote: 'Root नम् + ते' },
          { sanskrit: 'आचार्यः', iast: 'ācāryaḥ', pos: 'Noun', meaning: 'ஆசிரியர் (Teacher)', grammaticalNote: 'Prathamā singular' }
        ],
        suggestedFollowUps: [
          'சமஸ்கிருதத்தில் "நான் கற்கிறேன்" என்று எப்படி சொல்வது?',
          'விபக்திகள் (வேற்றுமைகள்) பற்றி விளக்குங்கள்',
          'படதி (पठति) மற்றும் படாமி (पठामि) வேறுபாடு என்ன?'
        ],
        pedagogicalTip: 'சமஸ்கிருதம் ஒலி நயம் மிக்க மொழி. தேவநாகரி எழுத்துக்களை சத்தமாக வாசித்து பயிற்சி செய்யுங்கள்!'
      };
    } else if (sourceLanguage === 'te') {
      return {
        id: 'm1',
        role: 'assistant',
        content: `నమస్కారం ${user.username}! నేను మీ **ఆచార్య AI (Acharya AI)** సంస్కృత గురువుని.\n\nమీరు సంస్కృతం మాట్లాడటం నేర్చుకోవాలన్నా లేదా పాణిని వ్యాకరణ సూత్రాలను అర్థం చేసుకోవాలన్నా నేను సహాయం చేయడానికి సిద్ధంగా ఉన్నాను. ఏదైనా ప్రశ్న అడగండి!`,
        sanskritGloss: [
          { sanskrit: 'नमस्ते', iast: 'namaste', pos: 'Greeting', meaning: 'నమస్కారం (Salutations)', grammaticalNote: 'Root नम् + ते' },
          { sanskrit: 'आचार्यः', iast: 'ācāryaḥ', pos: 'Noun', meaning: 'గురువు (Teacher)', grammaticalNote: 'Prathamā singular' }
        ],
        suggestedFollowUps: [
          'సంస్కృతంలో "నేను నేర్చుకుంటున్నాను" అని ఎలా చెప్పాలి?',
          '8 విభక్తుల గురించి ఉదాహరణలతో వివరించండి',
          'పఠతి (पठति) మరియు పఠామి (पठामि) మధ్య తేడా ఏమిటి?'
        ],
        pedagogicalTip: 'సంస్కృతం ఒక శాస్త్రీయ భాష. అక్షరాలను స్పష్టంగా ఉచ్ఛరిస్తూ సాధన చేయండి!'
      };
    } else if (sourceLanguage === 'hi') {
      return {
        id: 'm1',
        role: 'assistant',
        content: `नमस्ते ${user.username}! मैं आपका **आचार्य AI (Acharya AI)** संस्कृत शिक्षक एवं मार्गदर्शक हूँ।\n\nचाहे आप संभाषण संस्कृत सीखना चाहें, पाणिनि व्याकरण अथवा सन्धि नियम समझना चाहें, मैं आपकी सेवा में उपस्थित हूँ। कोई भी प्रश्न पूछें!`,
        sanskritGloss: [
          { sanskrit: 'नमस्ते', iast: 'namaste', pos: 'Greeting', meaning: 'सादर नमस्कार', grammaticalNote: 'Root नम् + ते' },
          { sanskrit: 'आचार्यः', iast: 'ācāryaḥ', pos: 'Noun', meaning: 'आचार्य / गुरु', grammaticalNote: 'Prathamā singular' }
        ],
        suggestedFollowUps: [
          'संस्कृत में "मैं पढ़ता हूँ" कैसे कहें?',
          '८ विभक्तियों की सरल व्याख्या करें',
          'पठति और पठामि में क्या अंतर है?'
        ],
        pedagogicalTip: 'संस्कृत एक ध्वन्यात्मक भाषा है। प्रतिदिन देवनागरी का सस्वर वाचन करें!'
      };
    } else {
      return {
        id: 'm1',
        role: 'assistant',
        content: `नमस्ते ${user.username}! I am **Acharya AI**, your conversational Sanskrit tutor and linguistics guide.\n\nWhether you wish to practice spoken Sanskrit, demystify Pāṇinian Sandhi rules, or explore sentence construction, I am at your service. Choose a mode above or ask any question!`,
        sanskritGloss: [
          { sanskrit: 'नमस्ते', iast: 'namaste', pos: 'Greeting', meaning: 'Salutations to you', grammaticalNote: 'Root नम् + ते' },
          { sanskrit: 'आचार्यः', iast: 'ācāryaḥ', pos: 'Noun', meaning: 'Preceptor / Teacher', grammaticalNote: 'Prathamā singular' }
        ],
        suggestedFollowUps: [
          'How do I say "I am learning Sanskrit"?',
          'Explain the 8 Vibhaktis with examples',
          'What is the difference between पठति and पठामि?'
        ],
        pedagogicalTip: 'Sanskrit is an acoustic computational language. Always read the Devanagari aloud to train your vocal memory!'
      };
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([getLocalizedInitialMessage()]);

  useEffect(() => {
    setMessages([getLocalizedInitialMessage()]);
  }, [sourceLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const response = await ApiService.sendChatMessage(text, selectedMode, historyPayload);

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.message,
        mode: response.mode,
        sanskritGloss: response.sanskritGloss,
        suggestedFollowUps: response.suggestedFollowUps,
        pedagogicalTip: response.pedagogicalTip
      };

      setMessages(prev => [...prev, assistantMsg]);
      addXp(10); // Reward active dialogue engagement
    } catch (err) {
      // Fallback
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'अहं भवन्तं शृणोमि। (I hear you.) Let us continue our Sanskrit learning session!'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    const sanskritWords = text.match(/[ऀ-ॿ]+/g);
    if (sanskritWords && sanskritWords.length > 0) {
      SpeechService.speak(sanskritWords.join(' '));
    } else {
      SpeechService.speak(text);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-w-5xl mx-auto">
      {/* Header & Modes Bar */}
      <div className="glass-card rounded-2xl p-4 border border-amber-500/30 mb-3">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-gold-glow">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Acharya AI</span>
                <span className="font-sanskrit text-amber-400 text-sm font-normal">आचार्यः</span>
              </h2>
              <p className="text-xs text-slate-400">
                Pāṇinian Sanskrit Pedagogy & Conversational Intelligence
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Level: {user.sanskrit_level}</span>
          </div>
        </div>

        {/* 7 Selectable Chat Modes (Section 11 Specification) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {modes.map(m => {
            const Icon = m.icon;
            const isSelected = selectedMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-400 shadow-gold-glow'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-amber-500/40 hover:text-white'
                }`}
                title={m.desc}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : m.color}`} />
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 pr-2">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 sm:p-5 shadow-lg ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium'
                  : 'glass-card border border-amber-500/25 text-slate-200'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  {m.role === 'user' ? 'You' : 'Acharya AI'}
                </span>
                {m.role === 'assistant' && (
                  <button
                    onClick={() => speakText(m.content)}
                    className="text-amber-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800"
                    title="Pronounce Sanskrit text"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Message Body */}
              <div className="text-sm whitespace-pre-line leading-relaxed">
                {m.content}
              </div>

              {/* Sanskrit Word-by-Word Gloss Cards (Section 10 Requirement) */}
              {m.sanskritGloss && m.sanskritGloss.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-700/60">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Devanagari Gloss & Morphological Breakdown</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {m.sanskritGloss.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-black/40 border border-amber-500/20 text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-sanskrit text-amber-300 font-bold text-sm">
                            {item.sanskrit}
                          </span>
                          <button
                            onClick={() => SpeechService.speak(item.sanskrit)}
                            className="text-slate-400 hover:text-amber-300"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono italic">
                          {item.iast}
                        </div>
                        <div className="text-white font-medium">
                          {item.meaning}
                        </div>
                        {item.grammaticalNote && (
                          <div className="text-[10px] text-amber-500/80 font-mono">
                            {item.grammaticalNote}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pedagogical Tip */}
              {m.pedagogicalTip && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  💡 <strong>Tip</strong>: {m.pedagogicalTip}
                </div>
              )}
            </div>

            {/* Suggested Follow-Ups */}
            {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 max-w-2xl">
                {m.suggestedFollowUps.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-xs px-3 py-1 rounded-full glass-card border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-black transition-colors"
                  >
                    {q} →
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-amber-400 text-xs py-2 animate-pulse">
            <span className="font-sanskrit text-lg font-bold">अ</span>
            <span>Acharya AI is formulating Sanskrit linguistic response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="pt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="glass-card rounded-2xl p-2 border border-amber-500/40 flex items-center gap-2 shadow-gold-glow"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask Acharya in ${modes.find(m => m.id === selectedMode)?.name} (e.g. "How do I say...", "Explain Sandhi")...`}
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm px-3 py-2 focus:outline-none"
          />
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-all shrink-0 ${
              isListening
                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-amber-300 hover:border-amber-400'
            }`}
            title={isListening ? 'Listening to voice...' : 'Voice Input (Microphone)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:brightness-110 disabled:opacity-50 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
