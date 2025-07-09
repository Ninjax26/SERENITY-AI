import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

interface Story {
  id: number;
  title: string;
  story: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

const AmITheAsshole: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const stories: Story[] = [
    {
      id: 1,
      title: "The Wedding Dress",
      story: "My sister asked me to be her maid of honor. I agreed, but when I saw the dress she picked out, I hated it. It was ugly and made me look terrible. I told her I wouldn't wear it and suggested we go shopping together to find something better. She got upset and said I was being difficult. AITA?",
      options: ["YTA - You should wear whatever the bride wants", "NTA - You have the right to feel comfortable", "ESH - Both of you are being unreasonable", "INFO - Need more context"],
      correctAnswer: 0,
      explanation: "As a maid of honor, you should prioritize the bride's vision for her special day. While comfort matters, the wedding isn't about you.",
      category: "Family"
    },
    {
      id: 2,
      title: "The Parking Spot",
      story: "I was waiting for a parking spot when someone else pulled up and took it right before I could. I was there first and had my blinker on. I confronted them and they said 'finders keepers.' I called them an asshole. AITA?",
      options: ["YTA - It's just a parking spot, get over it", "NTA - You were there first with your blinker on", "ESH - Both of you acted immaturely", "INFO - How long were you waiting?"],
      correctAnswer: 1,
      explanation: "Having your blinker on and being there first gives you priority. The other person was being inconsiderate.",
      category: "Public"
    },
    {
      id: 3,
      title: "The Birthday Party",
      story: "My friend's kid turned 5 and they invited my 3-year-old to the party. The party was at a trampoline park. My kid is too young for trampolines and would just sit there bored. I declined the invitation. My friend is upset. AITA?",
      options: ["YTA - You should have gone to support your friend", "NTA - Your kid's safety comes first", "ESH - You could have found a compromise", "INFO - Was there a non-trampoline area?"],
      correctAnswer: 1,
      explanation: "Your child's safety and comfort should be your priority. A 3-year-old at a trampoline park could be dangerous.",
      category: "Children"
    },
    {
      id: 4,
      title: "The Restaurant Bill",
      story: "I went out to dinner with 6 friends. We split the bill evenly, but I only had a salad and water while everyone else had expensive entrees and multiple drinks. I suggested we pay for what we ordered. They said I was being cheap. AITA?",
      options: ["YTA - Don't be cheap, just split it", "NTA - You shouldn't pay for others' expensive choices", "ESH - You should have discussed this beforehand", "INFO - How much was the difference?"],
      correctAnswer: 1,
      explanation: "It's reasonable to pay for what you actually consumed. You shouldn't subsidize others' expensive choices.",
      category: "Money"
    },
    {
      id: 5,
      title: "The Wedding Invitation",
      story: "My cousin is getting married and didn't invite me. We're not close, but I'm still family. I asked why and they said they're keeping it small. I'm hurt and told other family members. AITA?",
      options: ["YTA - It's their wedding, their choice", "NTA - Family should be invited", "ESH - You both handled it poorly", "INFO - How small is the wedding?"],
      correctAnswer: 0,
      explanation: "It's their wedding and they can invite whoever they want. Being family doesn't automatically entitle you to an invitation.",
      category: "Family"
    },
    {
      id: 6,
      title: "The Office Lunch",
      story: "My coworker always asks to split lunch when I go out, but never offers to pay for me when they go. I stopped asking them to join me. They're upset and think I'm being petty. AITA?",
      options: ["YTA - Be more generous with your coworker", "NTA - They're taking advantage of you", "ESH - You should have talked about it first", "INFO - How often does this happen?"],
      correctAnswer: 1,
      explanation: "Your coworker is taking advantage of your generosity. It's not petty to expect reciprocity in relationships.",
      category: "Work"
    },
    {
      id: 7,
      title: "The Movie Spoiler",
      story: "I accidentally spoiled the ending of a movie for my friend. They were really looking forward to seeing it and are now upset. I apologized but they're still mad. AITA?",
      options: ["YTA - You ruined their experience", "NTA - It was an accident and you apologized", "ESH - You should have been more careful", "INFO - How did you spoil it?"],
      correctAnswer: 0,
      explanation: "Even if it was an accident, you still ruined their movie experience. A simple apology doesn't undo the damage.",
      category: "Social"
    },
    {
      id: 8,
      title: "The Neighbor's Dog",
      story: "My neighbor's dog barks constantly and keeps me up at night. I've asked them to do something about it, but they say the dog is just being a dog. I called animal control. AITA?",
      options: ["YTA - Don't involve authorities, talk to them again", "NTA - You have a right to peace and quiet", "ESH - You both need to compromise", "INFO - How long has this been going on?"],
      correctAnswer: 1,
      explanation: "You have a right to peace and quiet in your own home. If they won't address the issue, involving authorities is reasonable.",
      category: "Neighbors"
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setTotalAnswered(prev => prev + 1);
    
    if (answerIndex === stories[currentStory].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextStory = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetGame = () => {
    setCurrentStory(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTotalAnswered(0);
  };

  const getVerdictColor = (answerIndex: number) => {
    if (!showResult) return '#ecf0f1';
    if (answerIndex === stories[currentStory].correctAnswer) return '#e8f5e8';
    if (answerIndex === selectedAnswer) return '#ffeaea';
    return '#ecf0f1';
  };

  const getVerdictBorder = (answerIndex: number) => {
    if (!showResult) return '#ddd';
    if (answerIndex === stories[currentStory].correctAnswer) return '#2ecc71';
    if (answerIndex === selectedAnswer) return '#e74c3c';
    return '#ddd';
  };

  const story = stories[currentStory];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div ref={gameRef} style={{ width: GAME_WIDTH, height: 0, overflow: 'hidden' }} />
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
            🤔 Am I the Asshole? 🤔
          </h1>
          <div style={{ 
            fontSize: '18px', 
            color: '#666',
            marginBottom: '20px'
          }}>
            Story {currentStory + 1} of {stories.length}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: '#e8f5e8',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#2ecc71'
            }}>
              Score: {score}/{totalAnswered}
            </div>
            <div style={{
              background: '#fff3cd',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#ffc107'
            }}>
              Accuracy: {totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0}%
            </div>
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            background: '#ecf0f1',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentStory + 1) / stories.length) * 100}%`,
              height: '100%',
              background: '#3498db',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Story */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '10px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            color: '#333',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>
            {story.title}
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: '#333',
            lineHeight: '1.6',
            margin: '0',
            textAlign: 'justify'
          }}>
            {story.story}
          </p>
        </div>

        {/* Options */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {story.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && handleAnswerSelect(index)}
              disabled={showResult}
              style={{
                background: getVerdictColor(index),
                border: `3px solid ${getVerdictBorder(index)}`,
                borderRadius: '10px',
                padding: '20px',
                fontSize: '16px',
                color: '#333',
                cursor: showResult ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                fontWeight: 'bold'
              }}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Result */}
        {showResult && (
          <div style={{
            background: selectedAnswer === story.correctAnswer ? '#e8f5e8' : '#ffeaea',
            border: `3px solid ${selectedAnswer === story.correctAnswer ? '#2ecc71' : '#e74c3c'}`,
            borderRadius: '10px',
            padding: '25px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '24px', 
              color: selectedAnswer === story.correctAnswer ? '#2ecc71' : '#e74c3c',
              margin: '0 0 15px 0',
              fontWeight: 'bold'
            }}>
              {selectedAnswer === story.correctAnswer ? '✅ Correct!' : '❌ Incorrect!'}
            </h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#333',
              margin: '0',
              lineHeight: '1.5'
            }}>
              {story.explanation}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ textAlign: 'center' }}>
          {currentStory < stories.length - 1 ? (
            <button
              onClick={nextStory}
              disabled={!showResult}
              style={{
                background: showResult ? '#3498db' : '#bdc3c7',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                fontSize: '18px',
                cursor: showResult ? 'pointer' : 'not-allowed',
                marginRight: '10px'
              }}
            >
              Next Story →
            </button>
          ) : (
            <div style={{
              background: '#f8f9fa',
              borderRadius: '10px',
              padding: '30px',
              marginBottom: '20px'
            }}>
              <h2 style={{ 
                fontSize: '32px', 
                color: '#2ecc71',
                margin: '0 0 15px 0'
              }}>
                🎉 Game Complete! 🎉
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: '#666',
                margin: '0 0 20px 0'
              }}>
                Final Score: {score}/{stories.length} ({Math.round((score / stories.length) * 100)}%)
              </p>
              <p style={{ 
                fontSize: '16px', 
                color: '#333'
              }}>
                {score === stories.length ? 'Perfect! You have excellent moral judgment!' :
                 score >= stories.length * 0.8 ? 'Great job! You understand social dynamics well!' :
                 score >= stories.length * 0.6 ? 'Good effort! Keep learning about social situations!' :
                 'Keep practicing! Understanding social dynamics takes time!'}
              </p>
            </div>
          )}
          
          <button
            onClick={resetGame}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            🔄 Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmITheAsshole;