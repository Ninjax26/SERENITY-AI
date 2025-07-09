import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

interface Rule {
  id: number;
  description: string;
  validator: (password: string) => boolean;
  errorMessage: string;
  isActive: boolean;
}

const PasswordGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [password, setPassword] = useState('');
  const [currentRule, setCurrentRule] = useState(0);
  const [rules, setRules] = useState<Rule[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const initialRules: Rule[] = [
      {
        id: 1,
        description: "Your password must be at least 5 characters.",
        validator: (pwd) => pwd.length >= 5,
        errorMessage: "Password must be at least 5 characters long.",
        isActive: true
      },
      {
        id: 2,
        description: "Your password must include a number.",
        validator: (pwd) => /\d/.test(pwd),
        errorMessage: "Password must contain at least one number.",
        isActive: false
      },
      {
        id: 3,
        description: "Your password must include an uppercase letter.",
        validator: (pwd) => /[A-Z]/.test(pwd),
        errorMessage: "Password must contain at least one uppercase letter.",
        isActive: false
      },
      {
        id: 4,
        description: "Your password must include a special character.",
        validator: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        errorMessage: "Password must contain at least one special character.",
        isActive: false
      },
      {
        id: 5,
        description: "The digits in your password must add up to 25.",
        validator: (pwd) => {
          const digits = pwd.match(/\d/g);
          if (!digits) return false;
          return digits.reduce((sum, digit) => sum + parseInt(digit), 0) === 25;
        },
        errorMessage: "The digits in your password must add up to 25.",
        isActive: false
      },
      {
        id: 6,
        description: "Your password must include a day of the week.",
        validator: (pwd) => /monday|tuesday|wednesday|thursday|friday|saturday|sunday/i.test(pwd),
        errorMessage: "Password must contain a day of the week.",
        isActive: false
      },
      {
        id: 7,
        description: "Your password must include a month of the year.",
        validator: (pwd) => /january|february|march|april|may|june|july|august|september|october|november|december/i.test(pwd),
        errorMessage: "Password must contain a month of the year.",
        isActive: false
      },
      {
        id: 8,
        description: "Your password must include a roman numeral.",
        validator: (pwd) => /[IVXLC]+/i.test(pwd),
        errorMessage: "Password must contain a roman numeral.",
        isActive: false
      },
      {
        id: 9,
        description: "Your password must include one of the following: 🍕 🍔 🍟 🌭 🥪",
        validator: (pwd) => /🍕|🍔|🍟|🌭|🥪/.test(pwd),
        errorMessage: "Password must contain one of the specified emojis.",
        isActive: false
      },
      {
        id: 10,
        description: "Your password must include a color.",
        validator: (pwd) => /red|blue|green|yellow|purple|orange|pink|brown|black|white/i.test(pwd),
        errorMessage: "Password must contain a color name.",
        isActive: false
      }
    ];
    setRules(initialRules);
  }, []);

  const checkPassword = (newPassword: string) => {
    setPassword(newPassword);
    
    // Check if current rule is satisfied
    if (currentRule < rules.length && rules[currentRule]?.validator(newPassword)) {
      // Activate next rule
      const updatedRules = [...rules];
      if (currentRule + 1 < rules.length) {
        updatedRules[currentRule + 1].isActive = true;
      }
      setRules(updatedRules);
      setCurrentRule(currentRule + 1);
      
      // Check if game is complete
      if (currentRule + 1 >= rules.length) {
        setGameComplete(true);
      }
    }
  };

  const resetGame = () => {
    setPassword('');
    setCurrentRule(0);
    setGameComplete(false);
    setShowHint(false);
    const resetRules = rules.map((rule, index) => ({
      ...rule,
      isActive: index === 0
    }));
    setRules(resetRules);
  };

  const getCurrentRule = () => rules[currentRule];

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, color: '#e74c3c', text: 'Very Weak' };
    if (password.length < 5) return { strength: 20, color: '#e74c3c', text: 'Very Weak' };
    if (password.length < 8) return { strength: 40, color: '#f39c12', text: 'Weak' };
    if (password.length < 12) return { strength: 60, color: '#f1c40f', text: 'Medium' };
    if (password.length < 16) return { strength: 80, color: '#2ecc71', text: 'Strong' };
    return { strength: 100, color: '#27ae60', text: 'Very Strong' };
  };

  const strength = getPasswordStrength();

  if (gameComplete) {
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
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>
            🎉
          </div>
          <h1 style={{ 
            fontSize: '48px', 
            color: '#2ecc71', 
            margin: '0 0 20px 0',
            fontWeight: 'bold'
          }}>
            Password Created Successfully!
          </h1>
          <div style={{
            background: '#f8f9fa',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px',
            wordBreak: 'break-all',
            fontSize: '18px',
            fontFamily: 'monospace'
          }}>
            <strong>Your Password:</strong><br />
            {password}
          </div>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
            You've successfully created a password that meets all {rules.length} requirements!
          </p>
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
            🔄 Play Again
          </button>
        </div>
      </div>
    );
  }

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
            🔐 The Password Game 🔐
          </h1>
          <div style={{ 
            fontSize: '18px', 
            color: '#666',
            marginBottom: '20px'
          }}>
            Rule {currentRule + 1} of {rules.length}
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            background: '#ecf0f1',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentRule + 1) / rules.length) * 100}%`,
              height: '100%',
              background: '#3498db',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Current Rule */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '10px',
          padding: '30px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            color: '#333',
            marginBottom: '20px'
          }}>
            Current Rule:
          </h2>
          <p style={{ 
            fontSize: '20px', 
            color: '#2ecc71',
            fontWeight: 'bold',
            margin: '0'
          }}>
            {getCurrentRule()?.description}
          </p>
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            fontSize: '18px',
            color: '#333',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            Enter your password:
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => checkPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '18px',
              border: '3px solid #ddd',
              borderRadius: '10px',
              fontFamily: 'monospace',
              boxSizing: 'border-box'
            }}
            placeholder="Start typing your password..."
            autoFocus
          />
        </div>

        {/* Password Strength */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '16px', color: '#333' }}>
              Password Strength:
            </span>
            <span style={{ 
              fontSize: '16px', 
              color: strength.color,
              fontWeight: 'bold'
            }}>
              {strength.text}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            background: '#ecf0f1',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${strength.strength}%`,
              height: '100%',
              background: strength.color,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* All Rules */}
        <div>
          <h3 style={{ 
            fontSize: '20px', 
            color: '#333',
            marginBottom: '20px'
          }}>
            All Rules:
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {rules.map((rule, index) => (
              <div
                key={rule.id}
                style={{
                  padding: '15px',
                  borderRadius: '8px',
                  background: rule.isActive ? '#e8f5e8' : '#f8f9fa',
                  border: `2px solid ${rule.isActive ? '#2ecc71' : '#ddd'}`,
                  opacity: rule.isActive ? 1 : 0.6
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{
                    fontSize: '20px',
                    color: rule.isActive ? '#2ecc71' : '#999'
                  }}>
                    {rule.isActive ? '🔒' : '🔓'}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    color: rule.isActive ? '#333' : '#666',
                    fontWeight: rule.isActive ? 'bold' : 'normal'
                  }}>
                    {rule.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hint Button */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => setShowHint(!showHint)}
            style={{
              background: '#95a5a6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            💡 {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          <button
            onClick={resetGame}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            🔄 Reset
          </button>
        </div>

        {/* Hint */}
        {showHint && (
          <div style={{
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '10px',
            padding: '20px',
            marginTop: '20px'
          }}>
            <h4 style={{ 
              fontSize: '18px', 
              color: '#856404',
              margin: '0 0 10px 0'
            }}>
              💡 Hint:
            </h4>
            <p style={{ 
              fontSize: '16px', 
              color: '#856404',
              margin: '0'
            }}>
              Try combining multiple requirements into one password. For example, 
              if you need a number that adds up to 25, you could use "25" or "99999" 
              (9+9+9+9+9 = 45, but you get the idea!).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGame;