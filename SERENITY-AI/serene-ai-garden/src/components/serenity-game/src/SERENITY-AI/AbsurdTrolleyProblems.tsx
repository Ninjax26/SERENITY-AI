import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

interface TrolleyProblem {
  id: number;
  scenario: string;
  optionA: string;
  optionB: string;
  consequencesA: string;
  consequencesB: string;
  imageA: string;
  imageB: string;
}

const AbsurdTrolleyProblems: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const trolleyProblems: TrolleyProblem[] = [
    {
      id: 1,
      scenario: "A trolley is heading towards 5 people tied to the track. You can pull a lever to divert it to a side track, but there's 1 person tied there. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You saved 4 lives but killed 1 person",
      consequencesB: "You let 5 people die to avoid being responsible for 1 death",
      imageA: "🚂➡️👥",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 2,
      scenario: "A trolley is heading towards 5 people. You can push a large person onto the track to stop it, saving the 5 but killing the 1. What do you do?",
      optionA: "Push the person",
      optionB: "Do nothing",
      consequencesA: "You actively killed 1 person to save 5 others",
      consequencesB: "You let 5 people die to avoid direct action",
      imageA: "👤➡️🚂➡️👥",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 3,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it, but the side track loops back and will kill the same 5 people. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You tried to help but it made no difference",
      consequencesB: "You accepted the inevitable death of 5 people",
      imageA: "🚂➡️🔄➡️💀💀💀💀💀",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 4,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person, but that person is your best friend. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed your best friend to save 5 strangers",
      consequencesB: "You let 5 strangers die to save your best friend",
      imageA: "🚂➡️👨‍❤️‍👨",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 5,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a genius scientist working on a cure for cancer. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed a genius who could save millions",
      consequencesB: "You let 5 people die to preserve potential future lives",
      imageA: "🚂➡️🧬",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 6,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a baby. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed an innocent baby to save 5 adults",
      consequencesB: "You let 5 adults die to save 1 baby",
      imageA: "🚂➡️👶",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 7,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is Hitler. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed Hitler but also killed 5 innocent people",
      consequencesB: "You let 5 innocent people die to kill Hitler",
      imageA: "🚂➡️😈",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 8,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is you. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You sacrificed yourself to save 5 others",
      consequencesB: "You let 5 people die to save yourself",
      imageA: "🚂➡️😵",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 9,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a time traveler from the future. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed a time traveler, potentially changing history",
      consequencesB: "You let 5 people die to preserve the timeline",
      imageA: "🚂➡️⏰",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 10,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a robot with human-level consciousness. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed a sentient being to save 5 biological humans",
      consequencesB: "You let 5 humans die to save 1 artificial life",
      imageA: "🚂➡️🤖",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 11,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a clone of yourself. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed your own clone to save 5 others",
      consequencesB: "You let 5 people die to save your genetic duplicate",
      imageA: "🚂➡️👯‍♂️",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 12,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a psychic who predicted this exact moment. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed someone who knew this would happen",
      consequencesB: "You let 5 people die, fulfilling the psychic's prophecy",
      imageA: "🚂➡️🔮",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 13,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a superhero who could save everyone if freed. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed a superhero who could have saved everyone",
      consequencesB: "You let 5 people die hoping the hero breaks free",
      imageA: "🚂➡️🦸‍♂️",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 14,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a genie who will grant you 3 wishes if saved. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed a genie and lost 3 wishes",
      consequencesB: "You let 5 people die to potentially save the genie",
      imageA: "🚂➡️🧞‍♂️",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 15,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is an alien ambassador. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed an alien ambassador, potentially starting an intergalactic war",
      consequencesB: "You let 5 humans die to preserve interstellar relations",
      imageA: "🚂➡️👽",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 16,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a unicorn. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed the last unicorn in existence",
      consequencesB: "You let 5 people die to save a magical creature",
      imageA: "🚂➡️🦄",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 17,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a time traveler from the past. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed someone from the past, potentially creating a paradox",
      consequencesB: "You let 5 people die to preserve historical integrity",
      imageA: "🚂➡️⏰",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 18,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a mime. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed a mime who was silently protesting trolley problems",
      consequencesB: "You let 5 people die to save the world's quietest protester",
      imageA: "🚂➡️🤐",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 19,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a professional clown. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed a clown, making the world less funny",
      consequencesB: "You let 5 people die to preserve comedy",
      imageA: "🚂➡️🤡",
      imageB: "🚂➡️💀💀💀💀💀"
    },
    {
      id: 20,
      scenario: "A trolley is heading towards 5 people. You can pull a lever to divert it to a track with 1 person who is a professional mime. What do you do?",
      optionA: "Pull the lever",
      optionB: "Do nothing",
      consequencesA: "You killed a mime, making the world less silent",
      consequencesB: "You let 5 people die to preserve silence",
      imageA: "🚂➡️🤫",
      imageB: "🚂➡️💀💀💀💀💀"
    }
  ];

  const makeChoice = (choice: number) => {
    const newChoices = [...choices, choice];
    setChoices(newChoices);
    
    if (currentProblem < trolleyProblems.length - 1) {
      setCurrentProblem(currentProblem + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetGame = () => {
    setCurrentProblem(0);
    setChoices([]);
    setShowResults(false);
  };

  const getChoiceStats = () => {
    const optionAChoices = choices.filter(choice => choice === 0).length;
    const optionBChoices = choices.filter(choice => choice === 1).length;
    return { optionA: optionAChoices, optionB: optionBChoices };
  };

  const getPersonalityType = () => {
    const { optionA, optionB } = getChoiceStats();
    const total = optionA + optionB;
    const utilitarianRatio = optionA / total;
    
    if (utilitarianRatio >= 0.8) return "Utilitarian Hero";
    if (utilitarianRatio >= 0.6) return "Pragmatic Thinker";
    if (utilitarianRatio >= 0.4) return "Balanced Moralist";
    if (utilitarianRatio >= 0.2) return "Emotional Decision Maker";
    return "Deontological Purist";
  };

  if (showResults) {
    const { optionA, optionB } = getChoiceStats();
    const personality = getPersonalityType();
    
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '48px', 
            color: '#333', 
            margin: '0 0 30px 0',
            fontWeight: 'bold'
          }}>
            🚂 Your Trolley Problem Results 🚂
          </h1>
          
          <div style={{
            background: '#f8f9fa',
            borderRadius: '10px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h2 style={{ fontSize: '32px', color: '#2ecc71', marginBottom: '20px' }}>
              {personality}
            </h2>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
              Based on your choices, you are a {personality.toLowerCase()}.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: '#e8f5e8',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '24px', color: '#2ecc71', marginBottom: '10px' }}>
                Option A Choices
              </h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                {optionA}
              </div>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Utilitarian decisions
              </p>
            </div>
            
            <div style={{
              background: '#fff3cd',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '24px', color: '#ffc107', marginBottom: '10px' }}>
                Option B Choices
              </h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                {optionB}
              </div>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Deontological decisions
              </p>
            </div>
          </div>

          <div style={{
            background: '#f8f9fa',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '15px' }}>
              Your Choices Summary:
            </h3>
            {choices.map((choice, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span style={{ fontSize: '16px', color: '#333' }}>
                  Problem {index + 1}:
                </span>
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  color: choice === 0 ? '#2ecc71' : '#ffc107'
                }}>
                  {choice === 0 ? 'Option A' : 'Option B'}
                </span>
              </div>
            ))}
          </div>

          <button 
            onClick={resetGame}
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🚂 Play Again
          </button>
        </div>
      </div>
    );
  }

  const problem = trolleyProblems[currentProblem];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '15px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            color: '#333', 
            margin: '0 0 10px 0',
            fontWeight: 'bold'
          }}>
            🚂 Absurd Trolley Problems 🚂
          </h1>
          <div style={{ 
            fontSize: '18px', 
            color: '#666',
            marginBottom: '20px'
          }}>
            Problem {currentProblem + 1} of {trolleyProblems.length}
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            background: '#ecf0f1',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentProblem + 1) / trolleyProblems.length) * 100}%`,
              height: '100%',
              background: '#3498db',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Scenario */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '10px',
          padding: '30px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            color: '#333',
            marginBottom: '20px',
            lineHeight: '1.4'
          }}>
            {problem.scenario}
          </h2>
        </div>

        {/* Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {/* Option A */}
          <div
            onClick={() => makeChoice(0)}
            style={{
              background: '#e8f5e8',
              border: '3px solid #2ecc71',
              borderRadius: '15px',
              padding: '30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>
              {problem.imageA}
            </div>
            <h3 style={{ 
              fontSize: '28px', 
              color: '#2ecc71',
              margin: '0 0 15px 0',
              fontWeight: 'bold'
            }}>
              {problem.optionA}
            </h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#666',
              margin: '0',
              lineHeight: '1.4'
            }}>
              {problem.consequencesA}
            </p>
          </div>

          {/* Option B */}
          <div
            onClick={() => makeChoice(1)}
            style={{
              background: '#fff3cd',
              border: '3px solid #ffc107',
              borderRadius: '15px',
              padding: '30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>
              {problem.imageB}
            </div>
            <h3 style={{ 
              fontSize: '28px', 
              color: '#ffc107',
              margin: '0 0 15px 0',
              fontWeight: 'bold'
            }}>
              {problem.optionB}
            </h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#666',
              margin: '0',
              lineHeight: '1.4'
            }}>
              {problem.consequencesB}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          textAlign: 'center',
          fontSize: '16px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          Click on one of the options above to make your choice. 
          There are no right or wrong answers - this is about understanding your moral reasoning.
        </div>
      </div>
    </div>
  );
};

export default AbsurdTrolleyProblems;