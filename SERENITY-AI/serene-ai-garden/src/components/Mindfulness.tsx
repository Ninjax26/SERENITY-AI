import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Wind, Brain, Music, Timer, Heart } from 'lucide-react';
import { motion } from "framer-motion";
import WordleClone from './serenity-game/src/SERENITY-AI/WordleClone';
import TypeRacer from './serenity-game/src/SERENITY-AI/TypeRacer';
import AbsurdTrolleyProblems from './serenity-game/src/SERENITY-AI/AbsurdTrolleyProblems';
import MemoryGame from './serenity-game/src/SERENITY-AI/MemoryGame';
import DrawPerfectCircle from './serenity-game/src/SERENITY-AI/DrawPerfectCircle';
import ClickTheColor from './serenity-game/src/SERENITY-AI/ClickTheColor';
import EndlessHorse from './serenity-game/src/SERENITY-AI/EndlessHorse';
import ColorBlindTest from './serenity-game/src/SERENITY-AI/ColorBlindTest';
import AmITheAsshole from './serenity-game/src/SERENITY-AI/AmITheAsshole';
import SpendBillGatesMoney from './serenity-game/src/SERENITY-AI/SpendBillGatesMoney';
import PasswordGame from './serenity-game/src/SERENITY-AI/PasswordGame';
import LifeStats from './serenity-game/src/SERENITY-AI/LifeStats';
import { Progress } from "@/components/ui/progress";

const MindfulnessInterface = () => {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale
  const [breathingCycle, setBreathingCycle] = useState(0);
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTimer, setMeditationTimer] = useState(300); // 5 minutes default
  const [remainingTime, setRemainingTime] = useState(300);
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [currentPhaseTime, setCurrentPhaseTime] = useState(0);

  // Breathing exercise logic
  useEffect(() => {
    if (!breathingActive) return;

    const interval = setInterval(() => {
      setBreathingCycle(prev => {
        const newCycle = prev + 1;
        const phase = Math.floor(newCycle / 4) % 3;
        
        switch (phase) {
          case 0:
            setBreathingPhase('inhale');
            break;
          case 1:
            setBreathingPhase('hold');
            break;
          case 2:
            setBreathingPhase('exhale');
            break;
        }
        
        return newCycle;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingActive]);

  // Meditation timer logic
  useEffect(() => {
    if (!meditationActive || remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          setMeditationActive(false);
          return meditationTimer;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [meditationActive, remainingTime, meditationTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const breathingInstructions = {
    inhale: "Breathe in slowly...",
    hold: "Hold your breath...",
    exhale: "Breathe out gently..."
  };

  const meditationPrompts = [
    "Focus on your breath and let thoughts pass like clouds",
    "Notice the sensations in your body without judgment",
    "Return to your breath whenever your mind wanders",
    "Feel gratitude for this moment of peace",
    "Let go of tension with each exhale"
  ];

  const focusMusic = [
    { name: "Uplifting Pad Texture", duration: "3:00", type: "ambient", file: "uplifting-pad-texture-113842.mp3" },
    { name: "Traffic in City", duration: "0:41", type: "urban", file: "traffic-in-city-309236.mp3" },
    { name: "Spring Forest Nature", duration: "1:12", type: "nature", file: "spring-forest-nature-332842.mp3" },
    { name: "Spring", duration: "3:18", type: "nature", file: "spring-339281.mp3" },
    { name: "Rain, Crickets & Stream", duration: "5:18", type: "nature", file: "soft-rain-with-crickets-and-forest-stream-364357.mp3" },
    { name: "Soft Brown Noise", duration: "18:00", type: "ambient", file: "soft-brown-noise-299934.mp3" },
    { name: "Birds Singing", duration: "6:24", type: "nature", file: "nature-birds-singing-217212.mp3" },
    { name: "Lofi Bass Groove", duration: "1:00", type: "lofi", file: "loop-low-bass-lofi-style-groove-21589.mp3" },
    { name: "Forest Birds", duration: "1:54", type: "nature", file: "forestbirds-319791.mp3" },
    { name: "Flowing Water", duration: "0:52", type: "nature", file: "flowing-water-345171.mp3" },
    { name: "Cinematic Intro", duration: "0:14", type: "cinematic", file: "cinematic-intro-6097.mp3" },
  ];

  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRefs = React.useRef<(HTMLAudioElement | null)[]>([]);

  const handlePlayPause = (index: number) => {
    if (playingIndex === index) {
      audioRefs.current[index]?.pause();
      setPlayingIndex(null);
    } else {
      if (playingIndex !== null) {
        audioRefs.current[playingIndex]?.pause();
        if (audioRefs.current[playingIndex]?.currentTime) {
          audioRefs.current[playingIndex].currentTime = 0;
        }
      }
      audioRefs.current[index]?.play();
      setPlayingIndex(index);
    }
  };

  // Advanced Breathing Exercises Data
  const breathingExercises = [
    {
      id: 1,
      title: "Abdominal Breathing",
      description: "Deep breathing using your diaphragm for maximum oxygen intake",
      logo: "🫁",
      steps: [
        "Sit or lie down in a comfortable position",
        "Place one hand on your chest and the other on your abdomen",
        "Breathe in slowly through your nose, feeling your abdomen rise",
        "Exhale slowly through your mouth, feeling your abdomen fall",
        "Repeat for 5-10 minutes",
      ],
      duration: 300,
      inhaleTime: 4,
      exhaleTime: 4,
    },
    {
      id: 2,
      title: "4-7-8 Breathing",
      description: "A calming technique that helps reduce anxiety and improve sleep",
      logo: "🌬️",
      steps: [
        "Sit with your back straight and close your eyes",
        "Inhale quietly through your nose for 4 counts",
        "Hold your breath for 7 counts",
        "Exhale completely through your mouth for 8 counts",
        "Repeat the cycle 4 times",
      ],
      duration: 240,
      inhaleTime: 4,
      holdTime: 7,
      exhaleTime: 8,
    },
    {
      id: 3,
      title: "Box Breathing",
      description: "Equal breathing pattern to calm your nervous system",
      logo: "🟦",
      steps: [
        "Sit in a comfortable position with your back straight",
        "Inhale for 4 counts",
        "Hold for 4 counts",
        "Exhale for 4 counts",
        "Hold for 4 counts",
        "Repeat for 5-10 minutes",
      ],
      duration: 320,
      inhaleTime: 4,
      holdTime: 4,
      exhaleTime: 4,
    },
    {
      id: 4,
      title: "Yoga Breathing",
      description: "Traditional pranayama technique for energy and focus",
      logo: "🧘",
      steps: [
        "Sit in lotus or cross-legged position",
        "Close your right nostril with your thumb",
        "Inhale through your left nostril",
        "Close your left nostril and open your right",
        "Exhale through your right nostril",
        "Repeat, alternating nostrils",
      ],
      duration: 360,
      inhaleTime: 6,
      exhaleTime: 6,
    },
    {
      id: 5,
      title: "Breathing Breaks",
      description: "Quick breathing exercises for busy schedules",
      logo: "⏱️",
      steps: [
        "Take a 2-minute break from your work",
        "Set a timer for 2 minutes",
        "Focus on your natural breathing",
        "Count each breath cycle",
        "Return to work feeling refreshed",
      ],
      duration: 120,
      inhaleTime: 3,
      exhaleTime: 3,
    },
    {
      id: 6,
      title: "Laughter Breathing",
      description: "Combine laughter with breathing for joy and stress relief",
      logo: "😂",
      steps: [
        "Find a comfortable, private space",
        "Start with a gentle smile",
        "Begin with a soft chuckle",
        "Gradually increase to full laughter",
        "Let the laughter flow naturally",
        "End with deep, calming breaths",
      ],
      duration: 180,
      inhaleTime: 2,
      exhaleTime: 4,
    },
  ];

  const funnyQuotes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call a fake noodle? An impasta!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why did the math book look so sad? Because it had too many problems!",
    "What do you call a fish wearing a bowtie? So-fish-ticated!",
  ];

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const gamesList = [
    { name: 'Wordle Clone', component: WordleClone, logo: '🟩' },
    { name: 'Type Racer', component: TypeRacer, logo: '⌨️' },
    { name: 'Absurd Trolley Problems', component: AbsurdTrolleyProblems, logo: '🚋' },
    { name: 'Memory Game', component: MemoryGame, logo: '🧠' },
    { name: 'Draw Perfect Circle', component: DrawPerfectCircle, logo: '⚪' },
    { name: 'Click The Color', component: ClickTheColor, logo: '🎨' },
    { name: 'Endless Horse', component: EndlessHorse, logo: '🐴' },
    { name: 'Color Blind Test', component: ColorBlindTest, logo: '🌈' },
    { name: 'Am I The Asshole', component: AmITheAsshole, logo: '🤔' },
    { name: 'Spend Bill Gates Money', component: SpendBillGatesMoney, logo: '💸' },
    { name: 'Password Game', component: PasswordGame, logo: '🔒' },
    { name: 'Life Stats', component: LifeStats, logo: '📊' },
  ];

  // Breathing Timer Component
  const BreathingTimer = ({ exercise, isActive, onComplete, onPhaseChange }) => {
    const [timeLeft, setTimeLeft] = useState(exercise.duration);
    const [phase, setPhase] = useState("inhale");
    const [phaseTime, setPhaseTime] = useState(exercise.inhaleTime);
    const [isPaused, setIsPaused] = useState(false);
    const prevActiveRef = React.useRef(isActive);
    const prevExerciseIdRef = React.useRef(exercise.id);

    // Store initial phase time for progress calculation
    const [initialPhaseTime, setInitialPhaseTime] = useState(exercise.inhaleTime);
    useEffect(() => { setInitialPhaseTime(phaseTime); }, [phase]);

    // Only reset timer when isActive transitions from false to true or exercise.id changes
    useEffect(() => {
      const isExerciseChanged = prevExerciseIdRef.current !== exercise.id;
      if ((isActive && !prevActiveRef.current) || isExerciseChanged) {
        setTimeLeft(exercise.duration);
        setPhase("inhale");
        setPhaseTime(exercise.inhaleTime);
        if (onPhaseChange) onPhaseChange("inhale", exercise.inhaleTime);
      }
      prevActiveRef.current = isActive;
      prevExerciseIdRef.current = exercise.id;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, exercise.id]);

    useEffect(() => {
      if (!isActive || isPaused) return;
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onComplete();
            return exercise.duration;
          }
          return prev - 1;
        });
        setPhaseTime((prev) => {
          if (prev <= 1) {
            let nextPhase = "inhale";
            let nextPhaseTime = exercise.inhaleTime;
            // Explicit phase logic using current phase state
            if (phase === "inhale") {
              if (typeof exercise.holdTime === "number" && exercise.holdTime > 0) {
                nextPhase = "hold";
                nextPhaseTime = exercise.holdTime;
              } else {
                nextPhase = "exhale";
                nextPhaseTime = exercise.exhaleTime;
              }
            } else if (phase === "hold") {
              nextPhase = "exhale";
              nextPhaseTime = exercise.exhaleTime;
            } else if (phase === "exhale") {
              nextPhase = "inhale";
              nextPhaseTime = exercise.inhaleTime;
            }
            setPhase(nextPhase);
            setInitialPhaseTime(nextPhaseTime);
            if (onPhaseChange) onPhaseChange(nextPhase, nextPhaseTime);
            return nextPhaseTime;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }, [isActive, isPaused, exercise, onComplete, onPhaseChange, phase]);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isActive) return null;

    // Map phase to step index for highlighting
    let currentStepIndex = 0;
    if (exercise.title.includes("4-7-8")) {
      if (phase === "inhale") currentStepIndex = 1;
      else if (phase === "hold") currentStepIndex = 2;
      else if (phase === "exhale") currentStepIndex = 3;
    } else if (exercise.title.includes("Box")) {
      if (phase === "inhale") currentStepIndex = 1;
      else if (phase === "hold") currentStepIndex = 2;
      else if (phase === "exhale") currentStepIndex = 3;
    } else {
      if (phase === "inhale") currentStepIndex = 2;
      else if (phase === "exhale") currentStepIndex = 3;
    }

    return (
      <div className="flex flex-col items-center mb-4 w-full">
        {/* Fixed Total Timer */}
        <div className="mb-6 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Time Remaining</div>
          <div className="text-3xl font-mono text-blue-600 dark:text-blue-400 font-bold">
            {formatTime(timeLeft)}
          </div>
          <div className="w-full max-w-md mt-2">
            <Progress value={((exercise.duration - timeLeft) / exercise.duration) * 100} />
          </div>
        </div>
      </div>
    );
  };

  // Laughter Component
  const LaughterSection = () => {
    const [currentQuote, setCurrentQuote] = useState(funnyQuotes[0]);
    const [isLaughing, setIsLaughing] = useState(false);

    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * funnyQuotes.length);
      setCurrentQuote(funnyQuotes[randomIndex]);
    };

    return (
      <div className="text-center space-y-6">
        <motion.div
          animate={isLaughing ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isLaughing ? Number.POSITIVE_INFINITY : 0 }}
          className="text-6xl cursor-pointer select-none"
          onClick={() => setIsLaughing(!isLaughing)}
        >
          {isLaughing ? "😂" : "😊"}
        </motion.div>
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 dark:bg-blue-900 dark:border-blue-700">
          <p className="text-gray-800 text-lg italic dark:text-gray-100">"{currentQuote}"</p>
        </div>
        <button
          onClick={getRandomQuote}
          className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all"
        >
          Get Another Joke
        </button>
      </div>
    );
  };

  // Meditation data
  const meditationCategories = [
    {
      id: 1,
      title: "Concentrative",
      description: "Focus your mind on a single point or object",
      icon: "🎯",
      color: "blue",
      techniques: [
        {
          name: "Breath Focus",
          description: "Concentrate on your natural breathing rhythm",
          duration: "5-20 min",
          steps: [
            "Find a comfortable seated position",
            "Close your eyes gently",
            "Focus on your natural breath",
            "Count each inhale and exhale",
            "When your mind wanders, return to counting"
          ],
          audio: "ocean-waves"
        },
        {
          name: "Candle Meditation",
          description: "Gaze at a candle flame to improve concentration",
          duration: "10-15 min",
          steps: [
            "Place a candle at eye level",
            "Sit comfortably 2-3 feet away",
            "Gaze softly at the flame",
            "Notice the colors and movement",
            "Blink naturally, don't strain your eyes"
          ],
          audio: "soft-flute"
        },
        {
          name: "Mantra Meditation",
          description: "Repeat a sacred word or phrase",
          duration: "10-30 min",
          steps: [
            "Choose a meaningful mantra",
            "Sit in a comfortable position",
            "Silently repeat the mantra",
            "Focus on the sound and vibration",
            "Let thoughts pass without judgment"
          ],
          audio: "nature-sounds"
        }
      ]
    },
    {
      id: 2,
      title: "Movement-Based",
      description: "Combine physical movement with mindfulness",
      icon: "🧘‍♀️",
      color: "green",
      techniques: [
        {
          name: "Walking Meditation",
          description: "Mindful walking to connect body and mind",
          duration: "15-30 min",
          steps: [
            "Find a quiet path or space",
            "Walk slowly and deliberately",
            "Feel each step connect with the ground",
            "Notice your surroundings",
            "Maintain awareness of your breath"
          ],
          audio: "forest-sounds"
        },
        {
          name: "Tai Chi",
          description: "Gentle flowing movements for balance and peace",
          duration: "20-45 min",
          steps: [
            "Stand with feet shoulder-width apart",
            "Begin with simple arm movements",
            "Flow from one movement to the next",
            "Keep your breathing steady",
            "Focus on the present moment"
          ],
          audio: "zen-garden"
        },
        {
          name: "Dancing Meditation",
          description: "Express yourself through mindful movement",
          duration: "10-20 min",
          steps: [
            "Choose calming music",
            "Let your body move naturally",
            "Feel the rhythm and energy",
            "Express your emotions through dance",
            "Stay present with each movement"
          ],
          audio: "ambient-music"
        }
      ]
    },
    {
      id: 3,
      title: "Expressive",
      description: "Creative and emotional expression through meditation",
      icon: "🎨",
      color: "purple",
      techniques: [
        {
          name: "Journaling Meditation",
          description: "Reflect and write your thoughts mindfully",
          duration: "15-30 min",
          steps: [
            "Find a quiet space to write",
            "Set a timer for your session",
            "Write without judgment or editing",
            "Express your thoughts and feelings",
            "Reflect on what emerges"
          ],
          audio: "rain-sounds"
        },
        {
          name: "Loving-Kindness",
          description: "Cultivate compassion for yourself and others",
          duration: "10-20 min",
          steps: [
            "Sit comfortably and close your eyes",
            "Start with yourself: 'May I be happy'",
            "Extend to loved ones: 'May they be happy'",
            "Include neutral people and difficult people",
            "Expand to all beings everywhere"
          ],
          audio: "soft-music"
        },
        {
          name: "Body Scan",
          description: "Systematically relax each part of your body",
          duration: "15-25 min",
          steps: [
            "Lie down in a comfortable position",
            "Start with your toes and feet",
            "Move attention up through your body",
            "Notice sensations without judgment",
            "Release tension as you go"
          ],
          audio: "gentle-waves"
        }
      ]
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Yoga Instructor",
      quote: "Meditation has transformed my daily life. I find peace in the chaos and clarity in confusion.",
      avatar: "🧘‍♀️"
    },
    {
      name: "Marcus Johnson",
      role: "Software Engineer",
      quote: "Just 10 minutes of meditation each morning has improved my focus and reduced my stress levels significantly.",
      avatar: "👨‍💻"
    },
    {
      name: "Elena Rodriguez",
      role: "Artist",
      quote: "Creative meditation helps me access deeper levels of inspiration and express my emotions authentically.",
      avatar: "🎨"
    }
  ];

  // Mood tracking options
  const moodOptions = [
    { emoji: "😔", label: "Stressed", value: 1 },
    { emoji: "😐", label: "Neutral", value: 2 },
    { emoji: "😊", label: "Calm", value: 3 },
    { emoji: "😌", label: "Peaceful", value: 4 },
    { emoji: "😇", label: "Blissful", value: 5 }
  ];

  // Meditation Timer Component
  const MeditationTimer = ({ technique, isActive, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(parseInt(technique.duration) * 60);
    const [isPaused, setIsPaused] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
      if (!isActive || isPaused) return;

      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            onComplete();
            return parseInt(technique.duration) * 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [isActive, isPaused, technique.duration, onComplete]);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="text-center space-y-6">
        <div className="meditation-timer w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
          {formatTime(timeLeft)}
        </div>
        <div className="text-lg font-medium text-gray-700 dark:text-gray-200">
          {technique.steps[currentStep]}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-4 py-2 bg-white bg-opacity-20 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-opacity-30 transition-all border border-gray-200 dark:border-gray-600"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={() => {
              setTimeLeft(parseInt(technique.duration) * 60);
              setCurrentStep(0);
              setIsPaused(false);
            }}
            className="px-4 py-2 bg-white bg-opacity-20 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-opacity-30 transition-all border border-gray-200 dark:border-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
    );
  };

  // Mood Tracker Component
  const MoodTracker = ({ onMoodSelect }) => {
    const [selectedMood, setSelectedMood] = useState(null);

    const handleMoodSelect = (mood) => {
      setSelectedMood(mood);
      onMoodSelect(mood);
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">How are you feeling?</h3>
        <div className="flex justify-center space-x-4">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood)}
              className={`p-3 rounded-full text-2xl transition-all ${
                selectedMood?.value === mood.value
                  ? 'bg-blue-100 dark:bg-blue-800 border-2 border-blue-400 dark:border-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
        {selectedMood && (
          <p className="text-center text-gray-600 dark:text-gray-300">{selectedMood.label}</p>
        )}
      </div>
    );
  };

  // Daily Routine Planner Component
  const DailyRoutinePlanner = ({ selectedTechniques, onAddTechnique, onRemoveTechnique }) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTechnique, setSelectedTechnique] = useState("");

    // Reset technique when category changes
    useEffect(() => {
      setSelectedTechnique("");
    }, [selectedCategory]);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Daily Routine Planner</h3>
        
        {selectedTechniques.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center py-8">No techniques added yet. Start building your routine!</p>
        ) : (
          <div className="space-y-3 mb-6">
            {selectedTechniques.map((tech, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">{tech.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{tech.duration}</p>
                </div>
                <button
                  onClick={() => onRemoveTechnique(index)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="">Select Category</option>
            {meditationCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>

          {selectedCategory && (
            <select
              value={selectedTechnique}
              onChange={(e) => setSelectedTechnique(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">Select Technique</option>
              {meditationCategories
                .find(cat => cat.id === Number(selectedCategory))
                ?.techniques.map(tech => (
                  <option key={tech.name} value={tech.name}>{tech.name}</option>
                ))}
            </select>
          )}

          {selectedTechnique && (
            <button
              onClick={() => {
                const tech = meditationCategories
                  .find(cat => cat.id === Number(selectedCategory))
                  ?.techniques.find(t => t.name === selectedTechnique);
                if (tech) {
                  onAddTechnique(tech);
                  setSelectedTechnique("");
                }
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add to Routine
            </button>
          )}
        </div>
      </div>
    );
  };

  // Meditation state
  const [selectedMeditationCategory, setSelectedMeditationCategory] = useState(null);
  const [selectedMeditationTechnique, setSelectedMeditationTechnique] = useState(null);
  const [isMeditationTimerActive, setIsMeditationTimerActive] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedMeditationTechniques, setSelectedMeditationTechniques] = useState([]);
  const [beforeMood, setBeforeMood] = useState(null);
  const [afterMood, setAfterMood] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMeditationTechniqueSelect = (technique) => {
    setSelectedMeditationTechnique(technique);
    setIsMeditationTimerActive(false);
  };

  const handleMeditationTimerComplete = () => {
    setIsMeditationTimerActive(false);
  };

  const addTechniqueToRoutine = (technique) => {
    setSelectedMeditationTechniques([...selectedMeditationTechniques, technique]);
  };

  const removeTechniqueFromRoutine = (index) => {
    setSelectedMeditationTechniques(selectedMeditationTechniques.filter((_, i) => i !== index));
  };

  const handleQuizSelection = (goal) => {
    let recommendation;
    switch(goal) {
      case 'Reduce Stress':
        recommendation = {
          category: meditationCategories[0], // Concentrative
          techniques: ['Breath Focus', 'Candle Meditation'],
          message: 'Concentrative techniques help calm your mind and reduce stress by focusing your attention.'
        };
        break;
      case 'Improve Focus':
        recommendation = {
          category: meditationCategories[0], // Concentrative
          techniques: ['Mantra Meditation', 'Breath Focus'],
          message: 'Concentrative practices strengthen your ability to maintain focus and attention.'
        };
        break;
      case 'Physical Wellness':
        recommendation = {
          category: meditationCategories[1], // Movement-Based
          techniques: ['Walking Meditation', 'Tai Chi'],
          message: 'Movement-based meditation connects mind and body for overall wellness.'
        };
        break;
      case 'Emotional Healing':
        recommendation = {
          category: meditationCategories[2], // Expressive
          techniques: ['Loving-Kindness', 'Journaling Meditation'],
          message: 'Expressive techniques help process emotions and cultivate compassion.'
        };
        break;
      default:
        recommendation = {
          category: meditationCategories[0],
          techniques: ['Breath Focus'],
          message: 'Start with breath focus for a gentle introduction to meditation.'
        };
    }
    setQuizResult(recommendation);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-serenity-800 mb-2">Mindfulness Center</h1>
          <p className="text-gray-600">Find your inner peace with guided exercises and meditation</p>
        </div>

        <Tabs defaultValue="breathing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="breathing" className="flex items-center space-x-2">
              <Wind className="w-4 h-4" />
              <span>Breathing</span>
            </TabsTrigger>
            <TabsTrigger value="meditation" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Meditation</span>
            </TabsTrigger>
            <TabsTrigger value="focus" className="flex items-center space-x-2">
              <Music className="w-4 h-4" />
              <span>Focus Sounds</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Games</span>
            </TabsTrigger>
          </TabsList>

          {/* Breathing Exercises */}
          <TabsContent value="breathing">
            {/* Floating Particles */}
            <div className="relative">
              <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400 bg-opacity-20 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [-20, 20, -20],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 6 + Math.random() * 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: Math.random() * 6,
                    }}
                  />
                ))}
              </div>
              <div className="relative z-10">
                {/* Exercise Grid */}
                {!selectedExercise && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {breathingExercises.map((exercise, index) => (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 cursor-pointer border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-2xl">{exercise.logo}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{exercise.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{exercise.description}</p>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {Math.floor(exercise.duration / 60)} min
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                {/* Selected Exercise Detail */}
                {selectedExercise && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <button
                        onClick={() => setSelectedExercise(null)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-2 flex items-center"
                      >
                        ← Back to Exercises
                      </button>
                    </div>
                    <div className="flex items-center mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mr-4">
                        <span className="text-white text-3xl">{selectedExercise.logo}</span>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{selectedExercise.title}</h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">{selectedExercise.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Instructions */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Instructions</h3>
                        <ol className="space-y-3">
                          {selectedExercise.steps.map((step, index) => {
                            // Map phase to step index for highlighting
                            let stepIndex = 0;
                            if (selectedExercise.title.includes("4-7-8")) {
                              if (currentPhase === "inhale") stepIndex = 1;
                              else if (currentPhase === "hold") stepIndex = 2;
                              else if (currentPhase === "exhale") stepIndex = 3;
                            } else if (selectedExercise.title.includes("Box")) {
                              if (currentPhase === "inhale") stepIndex = 1;
                              else if (currentPhase === "hold") stepIndex = 2;
                              else if (currentPhase === "exhale") stepIndex = 3;
                            } else {
                              if (currentPhase === "inhale") stepIndex = 2;
                              else if (currentPhase === "exhale") stepIndex = 3;
                            }
                            return (
                              <li key={index} className={`flex items-start space-x-3 ${isTimerActive && index === stepIndex ? 'bg-green-50 dark:bg-green-900 rounded-lg px-2 py-1' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-medium">
                                {index + 1}
                              </span>
                                <span className="text-gray-700 dark:text-gray-300">
                                  {step}
                                  {isTimerActive && index === stepIndex && (
                                    <span className="ml-2 text-green-600 font-bold">({currentPhaseTime}s)</span>
                                  )}
                                </span>
                            </li>
                            );
                          })}
                        </ol>
                      </div>
                      {/* Timer Section */}
                      <div className="space-y-6">
                        <BreathingTimer
                          exercise={selectedExercise}
                          isActive={isTimerActive}
                          onComplete={() => setIsTimerActive(false)}
                          onPhaseChange={(phase, phaseTime) => {
                            setCurrentPhase(phase);
                            setCurrentPhaseTime(phaseTime);
                          }}
                        />
                        <button
                          onClick={() => setIsTimerActive(!isTimerActive)}
                          className={`w-full py-3 rounded-lg font-medium transition-all ${
                            isTimerActive
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
                          }`}
                        >
                          {isTimerActive ? "Stop Exercise" : "Start Exercise"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Meditation Explorer */}
          <TabsContent value="meditation">
            <div className="space-y-8">
              {/* Floating Particles */}
              <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-purple-400 bg-opacity-20 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [-20, 20, -20],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 8 + Math.random() * 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: Math.random() * 8,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                {/* Introduction Section */}
                {!selectedMeditationCategory && !selectedMeditationTechnique && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                  >
                    <div className="lotus-animation w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-3xl">🌸</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                      Welcome to Meditation Explorer
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                      Discover the transformative power of meditation. Learn different techniques to find your inner peace, 
                      improve focus, and cultivate mindfulness in your daily life.
                    </p>
                  </motion.div>
                )}

                {/* Meditation Categories */}
                {!selectedMeditationCategory && !selectedMeditationTechnique && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                  >
                    {meditationCategories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card-hover bg-white dark:bg-gray-800 rounded-xl p-6 cursor-pointer border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        onClick={() => setSelectedMeditationCategory(category)}
                      >
                <div className="text-center space-y-4">
                          <div className={`w-20 h-20 mx-auto bg-gradient-to-r from-${category.color}-400 to-${category.color === 'blue' ? 'purple' : category.color === 'green' ? 'blue' : 'pink'}-500 rounded-full flex items-center justify-center`}>
                            <span className="text-white text-3xl">{category.icon}</span>
                  </div>
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{category.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{category.description}</p>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {category.techniques.length} techniques
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Technique Grid */}
                {selectedMeditationCategory && !selectedMeditationTechnique && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <button
                          onClick={() => setSelectedMeditationCategory(null)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-2"
                        >
                          ← Back to Categories
                        </button>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{selectedMeditationCategory.title}</h2>
                        <p className="text-gray-600 dark:text-gray-300">{selectedMeditationCategory.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedMeditationCategory.techniques.map((technique, index) => (
                        <motion.div
                          key={technique.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="card-hover bg-white dark:bg-gray-800 rounded-xl p-6 cursor-pointer border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                          onClick={() => handleMeditationTechniqueSelect(technique)}
                        >
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{technique.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{technique.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                                {technique.duration}
                              </span>
                              <span className="text-blue-600 dark:text-blue-400 font-medium">Start →</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Selected Technique Detail */}
                {selectedMeditationTechnique && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <button
                          onClick={() => setSelectedMeditationTechnique(null)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-2"
                        >
                          ← Back to Techniques
                        </button>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                          {selectedMeditationTechnique.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                          {selectedMeditationTechnique.description}
                    </p>
                  </div>
                </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Instructions */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Instructions</h3>
                        <ol className="space-y-3">
                          {selectedMeditationTechnique.steps.map((step, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 text-sm font-medium">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 dark:text-gray-300">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Timer Section */}
                      <div className="space-y-6">
                        <MeditationTimer
                          technique={selectedMeditationTechnique}
                          isActive={isMeditationTimerActive}
                          onComplete={handleMeditationTimerComplete}
                        />
                        <button
                          onClick={() => setIsMeditationTimerActive(!isMeditationTimerActive)}
                          className={`w-full py-3 rounded-lg font-medium transition-all ${
                            isMeditationTimerActive
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 text-white'
                          }`}
                        >
                          {isMeditationTimerActive ? 'Stop Session' : 'Start Session'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Daily Routine Planner */}
                {!selectedMeditationCategory && !selectedMeditationTechnique && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                  >
                    <DailyRoutinePlanner
                      selectedTechniques={selectedMeditationTechniques}
                      onAddTechnique={addTechniqueToRoutine}
                      onRemoveTechnique={removeTechniqueFromRoutine}
                    />
                  </motion.div>
                )}

                {/* Find Your Fit Quiz */}
                {!selectedMeditationCategory && !selectedMeditationTechnique && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center"
                  >
                    <button
                      onClick={() => setShowQuiz(!showQuiz)}
                      className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:from-green-500 hover:to-blue-600 transition-all"
                    >
                      {showQuiz ? 'Hide Quiz' : 'Find Your Perfect Meditation Style'}
                    </button>
                    
                    {showQuiz && (
                      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Meditation Quiz</h3>
                        
                        {!quizResult ? (
                          <div className="space-y-4">
                            <div>
                              <p className="text-gray-700 dark:text-gray-300 mb-3">What's your primary goal for meditation?</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button 
                                  onClick={() => handleQuizSelection('Reduce Stress')}
                                  className="p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <div className="font-medium text-gray-800 dark:text-white">Reduce Stress</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">Concentrative techniques</div>
                                </button>
                                <button 
                                  onClick={() => handleQuizSelection('Improve Focus')}
                                  className="p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <div className="font-medium text-gray-800 dark:text-white">Improve Focus</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">Mindfulness practices</div>
                                </button>
                                <button 
                                  onClick={() => handleQuizSelection('Physical Wellness')}
                                  className="p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <div className="font-medium text-gray-800 dark:text-white">Physical Wellness</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">Movement-based meditation</div>
                                </button>
                                <button 
                                  onClick={() => handleQuizSelection('Emotional Healing')}
                                  className="p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <div className="font-medium text-gray-800 dark:text-white">Emotional Healing</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">Expressive techniques</div>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-4xl mb-4">🎯</div>
                              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Your Perfect Match</h4>
                              <p className="text-gray-600 dark:text-gray-300 mb-4">{quizResult.message}</p>
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                              <h5 className="font-semibold text-gray-800 dark:text-white mb-2">Recommended Category:</h5>
                              <button 
                                onClick={() => setSelectedMeditationCategory(quizResult.category)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                              >
                                {quizResult.category.title} →
                              </button>
                            </div>
                            
                            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                              <h5 className="font-semibold text-gray-800 dark:text-white mb-2">Recommended Techniques:</h5>
                              <ul className="space-y-1">
                                {quizResult.techniques.map((technique, index) => (
                                  <li key={index} className="text-gray-700 dark:text-gray-300">• {technique}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="flex gap-3">
                              <button 
                      onClick={() => {
                                  setQuizResult(null);
                                  setShowQuiz(false);
                                }}
                                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              >
                                Take Quiz Again
                              </button>
                              <button 
                                onClick={() => setQuizResult(null)}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Explore Recommendations
                              </button>
                </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Session Completion */}
                {afterMood && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4 text-center">
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Session Complete!</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">Great job on completing your meditation session.</p>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">Mood Check</h4>
                        <div className="flex justify-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl mb-1 text-gray-800 dark:text-white">Before</div>
                            <div className="text-3xl">{beforeMood?.emoji}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{beforeMood?.label}</div>
                          </div>
                          <div className="text-3xl text-gray-400">→</div>
                          <div className="text-center">
                            <div className="text-2xl mb-1 text-gray-800 dark:text-white">After</div>
                            <div className="text-3xl">{afterMood?.emoji}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{afterMood?.label}</div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                    onClick={() => {
                          setAfterMood(null);
                          setBeforeMood(null);
                    }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                        Continue
                      </button>
                </div>
                  </motion.div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Focus Sounds */}
          <TabsContent value="focus">
            <div className="space-y-4">
              {focusMusic.map((track, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white rounded-2xl shadow-sm px-6 py-4 space-x-4 border border-gray-100"
                >
                  {/* Icon */}
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-serenity-400 to-calm-400">
                    <Music className="w-7 h-7 text-white" />
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg text-gray-900 truncate">{track.name}</div>
                    <div className="text-sm text-gray-500 capitalize truncate">{track.type} • {track.duration}</div>
                  </div>
                  {/* Play/Pause Button */}
                  <button
                    onClick={() => handlePlayPause(index)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-serenity-400 transition-colors bg-white focus:outline-none`}
                  >
                    {playingIndex === index ? <Pause className="w-5 h-5 text-serenity-500" /> : <Play className="w-5 h-5 text-serenity-500" />}
                  </button>
                  <audio
                    ref={el => (audioRefs.current[index] = el)}
                    src={`/Sounds/${track.file}`}
                    onEnded={() => setPlayingIndex(null)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Games Modern Grid */}
          <TabsContent value="games">
            <Card className="wellness-card">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Heart className="w-6 h-6 text-pink-500" />
                  <span>Mindfulness Games</span>
                </CardTitle>
                <CardDescription>
                  Interactive games to help you relax, focus, and practice mindfulness.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {selectedGame ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Button onClick={() => setSelectedGame(null)} variant="outline" className="mb-4">
                      &larr; Back to Games
                    </Button>
                    <div
                      className="w-full flex justify-center items-center"
                      style={{
                        width: '100%',
                        maxWidth: 1300,
                        minWidth: 350,
                        margin: '0 auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex justify-center items-center"
                      >
                        {React.createElement(gamesList.find(g => g.name === selectedGame)!.component)}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {gamesList.map((game, index) => {
                      // Assign a unique background color or gradient for each logo
                      const logoBg = [
                        "bg-gradient-to-br from-green-400 to-blue-500",    // Wordle Clone
                        "bg-gradient-to-br from-yellow-400 to-orange-500", // Type Racer
                        "bg-gradient-to-br from-purple-400 to-pink-500",  // Absurd Trolley Problems
                        "bg-gradient-to-br from-teal-400 to-cyan-500",    // Memory Game
                        "bg-gradient-to-br from-gray-400 to-gray-600",    // Draw Perfect Circle
                        "bg-gradient-to-br from-red-400 to-pink-400",     // Click The Color
                        "bg-gradient-to-br from-amber-400 to-lime-500",   // Endless Horse
                        "bg-gradient-to-br from-indigo-400 to-blue-400",  // Color Blind Test
                        "bg-gradient-to-br from-fuchsia-400 to-rose-500", // Am I The Asshole
                        "bg-gradient-to-br from-emerald-400 to-green-500",// Spend Bill Gates Money
                        "bg-gradient-to-br from-slate-400 to-slate-600",  // Password Game
                        "bg-gradient-to-br from-orange-400 to-yellow-500",// Life Stats
                      ][index % 12];
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                          onClick={() => setSelectedGame(game.name)}
                        >
                          <div className="text-center space-y-3">
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${logoBg}`}> 
                              <span className="text-white text-2xl">{game.logo}</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">{game.name}</h3>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MindfulnessInterface; 