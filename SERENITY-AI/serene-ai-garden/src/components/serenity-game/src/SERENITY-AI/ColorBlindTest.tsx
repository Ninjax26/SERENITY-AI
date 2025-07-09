import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

interface ColorTest {
  id: number;
  type: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  imageUrl?: string;
}

const ColorBlindTest: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [currentTest, setCurrentTest] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [testResults, setTestResults] = useState<string[]>([]);

  const colorTests: ColorTest[] = [
    {
      id: 1,
      type: "Ishihara",
      question: "What number do you see in this circle?",
      options: ["5", "7", "3", "Nothing"],
      correctAnswer: 0,
      explanation: "Most people with normal color vision see the number 5. If you see nothing or a different number, you may have some form of color vision deficiency."
    },
    {
      id: 2,
      type: "Color Matching",
      question: "Which color is most similar to the center square?",
      options: ["Red", "Green", "Blue", "Yellow"],
      correctAnswer: 1,
      explanation: "The center square is green. If you chose a different color, you may have difficulty distinguishing between certain colors."
    },
    {
      id: 3,
      type: "Pattern Recognition",
      question: "What pattern do you see in this image?",
      options: ["Horizontal lines", "Vertical lines", "Diagonal lines", "No pattern"],
      correctAnswer: 2,
      explanation: "The pattern consists of diagonal lines. Color vision deficiencies can make it difficult to see certain patterns."
    },
    {
      id: 4,
      type: "Color Naming",
      question: "What color is this object?",
      options: ["Red", "Green", "Blue", "Purple"],
      correctAnswer: 0,
      explanation: "This object is red. Color naming tests help identify specific types of color vision deficiencies."
    },
    {
      id: 5,
      type: "Contrast Test",
      question: "Can you read the text clearly?",
      options: ["Very clear", "Somewhat clear", "Barely visible", "Cannot see"],
      correctAnswer: 0,
      explanation: "The text should be clearly visible. Poor contrast sensitivity can indicate color vision issues."
    },
    {
      id: 6,
      type: "Color Arrangement",
      question: "Arrange these colors from lightest to darkest:",
      options: ["Blue, Green, Red", "Green, Blue, Red", "Red, Green, Blue", "All appear the same"],
      correctAnswer: 1,
      explanation: "The correct order is Green (lightest), Blue (medium), Red (darkest). Color vision deficiencies can affect brightness perception."
    },
    {
      id: 7,
      type: "Simulation",
      question: "How does this image look to you?",
      options: ["Normal colors", "Some colors look different", "Most colors look the same", "Very difficult to distinguish"],
      correctAnswer: 0,
      explanation: "This is a simulation of how colors might appear to someone with color vision deficiency."
    },
    {
      id: 8,
      type: "Final Assessment",
      question: "Based on your previous answers, what's your color vision status?",
      options: ["Normal color vision", "Mild color deficiency", "Moderate color deficiency", "Severe color deficiency"],
      correctAnswer: 0,
      explanation: "This assessment is based on your test performance. Consult an eye care professional for a definitive diagnosis."
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setTotalAnswered(prev => prev + 1);
    
    if (answerIndex === colorTests[currentTest].correctAnswer) {
      setScore(prev => prev + 1);
    }

    // Store result for final assessment
    const result = answerIndex === colorTests[currentTest].correctAnswer ? 'correct' : 'incorrect';
    setTestResults(prev => [...prev, result]);
  };

  const nextTest = () => {
    if (currentTest < colorTests.length - 1) {
      setCurrentTest(currentTest + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetTest = () => {
    setCurrentTest(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTotalAnswered(0);
    setTestResults([]);
  };

  const getVerdictColor = (answerIndex: number) => {
    if (!showResult) return '#ecf0f1';
    if (answerIndex === colorTests[currentTest].correctAnswer) return '#e8f5e8';
    if (answerIndex === selectedAnswer) return '#ffeaea';
    return '#ecf0f1';
  };

  const getVerdictBorder = (answerIndex: number) => {
    if (!showResult) return '#ddd';
    if (answerIndex === colorTests[currentTest].correctAnswer) return '#2ecc71';
    if (answerIndex === selectedAnswer) return '#e74c3c';
    return '#ddd';
  };

  const getColorVisionStatus = () => {
    const accuracy = totalAnswered > 0 ? score / totalAnswered : 0;
    
    if (accuracy >= 0.9) return "Normal color vision";
    if (accuracy >= 0.7) return "Mild color deficiency";
    if (accuracy >= 0.5) return "Moderate color deficiency";
    return "Severe color deficiency";
  };

  const test = colorTests[currentTest];

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
            👁️ Color Blind Test 👁️
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            margin: '0 0 20px 0'
          }}>
            Test your color vision with these interactive challenges
          </p>
          
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
              Test {currentTest + 1} of {colorTests.length}
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
              width: `${((currentTest + 1) / colorTests.length) * 100}%`,
              height: '100%',
              background: '#3498db',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Test Content */}
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
            {test.type} Test
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: '#333',
            lineHeight: '1.6',
            margin: '0 0 30px 0',
            textAlign: 'center'
          }}>
            {test.question}
          </p>

          {/* Color Test Display */}
          <div style={{
            background: 'white',
            height: '300px',
            borderRadius: '10px',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            border: '2px solid #ddd'
          }}>
            {currentTest === 0 && (
              /* Ishihara Test - Number 5 */
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ff6b6b 0%, #ff6b6b 30%, #4ecdc4 30%, #4ecdc4 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#333',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  5
                </div>
              </div>
            )}
            
            {currentTest === 1 && (
              /* Color Matching Test */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                width: '300px'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#ff6b6b',
                  borderRadius: '10px',
                  border: '3px solid #333'
                }} />
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#4ecdc4',
                  borderRadius: '10px',
                  border: '3px solid #333'
                }} />
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#45b7d1',
                  borderRadius: '10px',
                  border: '3px solid #333'
                }} />
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#96ceb4',
                  borderRadius: '10px',
                  border: '3px solid #333'
                }} />
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#4ecdc4',
                  borderRadius: '10px',
                  border: '3px solid #333',
                  boxShadow: '0 0 20px rgba(78, 205, 196, 0.8)'
                }} />
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#feca57',
                  borderRadius: '10px',
                  border: '3px solid #333'
                }} />
              </div>
            )}
            
            {currentTest === 2 && (
              /* Pattern Recognition Test */
              <div style={{
                width: '250px',
                height: '250px',
                background: 'repeating-linear-gradient(45deg, #ff6b6b, #ff6b6b 10px, #4ecdc4 10px, #4ecdc4 20px)',
                borderRadius: '10px'
              }} />
            )}
            
            {currentTest === 3 && (
              /* Color Naming Test */
              <div style={{
                width: '150px',
                height: '150px',
                backgroundColor: '#ff6b6b',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                Object
              </div>
            )}
            
            {currentTest === 4 && (
              /* Contrast Test */
              <div style={{
                width: '300px',
                height: '100px',
                background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}>
                Can you read this text?
              </div>
            )}
            
            {currentTest === 5 && (
              /* Color Arrangement Test */
              <div style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#96ceb4',
                  borderRadius: '10px',
                  border: '2px solid #333'
                }} />
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#45b7d1',
                  borderRadius: '10px',
                  border: '2px solid #333'
                }} />
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#ff6b6b',
                  borderRadius: '10px',
                  border: '2px solid #333'
                }} />
              </div>
            )}
            
            {currentTest === 6 && (
              /* Color Simulation Test */
              <div style={{
                width: '250px',
                height: '200px',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff6b6b)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                textAlign: 'center'
              }}>
                Color Vision<br />Simulation
              </div>
            )}
            
            {currentTest === 7 && (
              /* Final Assessment */
              <div style={{
                textAlign: 'center',
                fontSize: '20px',
                color: '#333'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '20px'
                }}>
                  🎯
                </div>
                <div>
                  Test Complete!<br />
                  Review your results above.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Options */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {test.options.map((option, index) => (
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
            background: selectedAnswer === test.correctAnswer ? '#e8f5e8' : '#ffeaea',
            border: `3px solid ${selectedAnswer === test.correctAnswer ? '#2ecc71' : '#e74c3c'}`,
            borderRadius: '10px',
            padding: '25px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '24px', 
              color: selectedAnswer === test.correctAnswer ? '#2ecc71' : '#e74c3c',
              margin: '0 0 15px 0',
              fontWeight: 'bold'
            }}>
              {selectedAnswer === test.correctAnswer ? '✅ Correct!' : '❌ Incorrect!'}
            </h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#333',
              margin: '0',
              lineHeight: '1.5'
            }}>
              {test.explanation}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ textAlign: 'center' }}>
          {currentTest < colorTests.length - 1 ? (
            <button
              onClick={nextTest}
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
              Next Test →
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
                🎉 Test Complete! 🎉
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: '#666',
                margin: '0 0 20px 0'
              }}>
                Final Score: {score}/{colorTests.length} ({Math.round((score / colorTests.length) * 100)}%)
              </p>
              <p style={{ 
                fontSize: '20px', 
                color: '#333',
                fontWeight: 'bold',
                margin: '0 0 20px 0'
              }}>
                Your Color Vision Status: {getColorVisionStatus()}
              </p>
              <p style={{ 
                fontSize: '16px', 
                color: '#666'
              }}>
                {score === colorTests.length ? 'Excellent! Your color vision appears normal.' :
                 score >= colorTests.length * 0.8 ? 'Good! You may have minor color vision differences.' :
                 score >= colorTests.length * 0.6 ? 'Fair. You may have some color vision deficiency.' :
                 'You may have significant color vision deficiency. Consider consulting an eye care professional.'}
              </p>
            </div>
          )}
          
          <button
            onClick={resetTest}
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
            🔄 Take Test Again
          </button>
        </div>

        {/* Color Vision Info */}
        <div style={{
          background: '#fff3cd',
          borderRadius: '10px',
          padding: '25px',
          marginTop: '30px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            color: '#856404',
            margin: '0 0 15px 0'
          }}>
            👁️ About Color Vision:
          </h3>
          <ul style={{ 
            fontSize: '16px', 
            color: '#856404',
            margin: '0',
            paddingLeft: '20px',
            lineHeight: '1.6'
          }}>
            <li>Color vision deficiency affects about 8% of men and 0.5% of women</li>
            <li>Most common types are red-green color blindness</li>
            <li>This test is for educational purposes only</li>
            <li>For accurate diagnosis, consult an eye care professional</li>
            <li>Color vision deficiency doesn't mean you see in black and white</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ColorBlindTest;