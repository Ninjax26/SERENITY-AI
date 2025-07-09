import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

interface LifeStat {
  id: string;
  label: string;
  value: number;
  unit: string;
  description: string;
  category: string;
  icon: string;
}

const LifeStats: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [age, setAge] = useState(25);
  const [stats, setStats] = useState<LifeStat[]>([]);

  useEffect(() => {
    calculateStats();
  }, [age]);

  const calculateStats = () => {
    const newStats: LifeStat[] = [
      {
        id: 'heartbeats',
        label: 'Heartbeats',
        value: age * 365 * 24 * 60 * 80, // 80 beats per minute average
        unit: 'beats',
        description: 'Your heart has beaten approximately this many times',
        category: 'Body',
        icon: '❤️'
      },
      {
        id: 'breaths',
        label: 'Breaths',
        value: age * 365 * 24 * 60 * 16, // 16 breaths per minute average
        unit: 'breaths',
        description: 'You have taken approximately this many breaths',
        category: 'Body',
        icon: '🫁'
      },
      {
        id: 'blinks',
        label: 'Eye Blinks',
        value: age * 365 * 24 * 60 * 15, // 15 blinks per minute average
        unit: 'blinks',
        description: 'Your eyes have blinked approximately this many times',
        category: 'Body',
        icon: '👁️'
      },
      {
        id: 'steps',
        label: 'Steps Taken',
        value: age * 365 * 5000, // 5000 steps per day average
        unit: 'steps',
        description: 'You have walked approximately this many steps',
        category: 'Movement',
        icon: '👟'
      },
      {
        id: 'words',
        label: 'Words Spoken',
        value: age * 365 * 16000, // 16,000 words per day average
        unit: 'words',
        description: 'You have spoken approximately this many words',
        category: 'Communication',
        icon: '💬'
      },
      {
        id: 'meals',
        label: 'Meals Eaten',
        value: age * 365 * 3, // 3 meals per day
        unit: 'meals',
        description: 'You have eaten approximately this many meals',
        category: 'Food',
        icon: '🍽️'
      },
      {
        id: 'sleep',
        label: 'Hours Slept',
        value: age * 365 * 8, // 8 hours per day
        unit: 'hours',
        description: 'You have slept approximately this many hours',
        category: 'Sleep',
        icon: '😴'
      },
      {
        id: 'dreams',
        label: 'Dreams Had',
        value: age * 365 * 4, // 4 dreams per night average
        unit: 'dreams',
        description: 'You have had approximately this many dreams',
        category: 'Sleep',
        icon: '💭'
      },
      {
        id: 'books',
        label: 'Books Read',
        value: Math.floor(age * 12), // 12 books per year average
        unit: 'books',
        description: 'You have read approximately this many books',
        category: 'Learning',
        icon: '📚'
      },
      {
        id: 'laughs',
        label: 'Times Laughed',
        value: age * 365 * 20, // 20 laughs per day average
        unit: 'laughs',
        description: 'You have laughed approximately this many times',
        category: 'Emotions',
        icon: '😄'
      },
      {
        id: 'tears',
        label: 'Tears Shed',
        value: age * 365 * 5, // 5 crying episodes per year average
        unit: 'crying sessions',
        description: 'You have cried approximately this many times',
        category: 'Emotions',
        icon: '😢'
      },
      {
        id: 'photos',
        label: 'Photos Taken',
        value: age * 365 * 3, // 3 photos per day average
        unit: 'photos',
        description: 'You have taken approximately this many photos',
        category: 'Memories',
        icon: '📸'
      }
    ];
    setStats(newStats);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const categories = ['Body', 'Movement', 'Communication', 'Food', 'Sleep', 'Learning', 'Emotions', 'Memories'];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '15px',
        padding: '30px',
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
            📊 Life Stats 📊
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            margin: '0 0 30px 0'
          }}>
            See what your life looks like in numbers
          </p>
          
          {/* Age Selector */}
          <div style={{
            background: '#f8f9fa',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <label style={{
              fontSize: '20px',
              color: '#333',
              fontWeight: 'bold',
              marginRight: '15px'
            }}>
              Your Age:
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              style={{
                width: '200px',
                marginRight: '15px'
              }}
            />
            <span style={{
              fontSize: '24px',
              color: '#3498db',
              fontWeight: 'bold'
            }}>
              {age} years old
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {stats.map((stat) => (
            <div
              key={stat.id}
              style={{
                background: '#f8f9fa',
                border: '2px solid #e9ecef',
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                {stat.icon}
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                color: '#333',
                margin: '0 0 10px 0',
                fontWeight: 'bold'
              }}>
                {stat.label}
              </h3>
              <div style={{ 
                fontSize: '32px', 
                color: '#3498db',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                {formatNumber(stat.value)}
              </div>
              <div style={{ 
                fontSize: '16px', 
                color: '#666',
                marginBottom: '15px'
              }}>
                {stat.unit}
              </div>
              <p style={{ 
                fontSize: '14px', 
                color: '#666',
                margin: '0',
                lineHeight: '1.4'
              }}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Category Summary */}
        <div style={{
          background: '#e8f5e8',
          borderRadius: '10px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            color: '#2ecc71',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>
            📈 Life Summary
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {categories.map(category => {
              const categoryStats = stats.filter(stat => stat.category === category);
              const totalValue = categoryStats.reduce((sum, stat) => sum + stat.value, 0);
              
              return (
                <div key={category} style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '5px'
                  }}>
                    {category}
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    color: '#666'
                  }}>
                    {categoryStats.length} stats
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fun Facts */}
        <div style={{
          background: '#fff3cd',
          borderRadius: '10px',
          padding: '25px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            color: '#856404',
            margin: '0 0 20px 0'
          }}>
            🧠 Fun Facts About Your Life:
          </h2>
          <ul style={{ 
            fontSize: '16px', 
            color: '#856404',
            margin: '0',
            paddingLeft: '20px',
            lineHeight: '1.6'
          }}>
            <li>Your heart has beaten over {formatNumber(stats.find(s => s.id === 'heartbeats')?.value || 0)} times!</li>
            <li>You've taken approximately {formatNumber(stats.find(s => s.id === 'steps')?.value || 0)} steps in your life</li>
            <li>You've spent about {formatNumber(stats.find(s => s.id === 'sleep')?.value || 0)} hours sleeping</li>
            <li>You've spoken roughly {formatNumber(stats.find(s => s.id === 'words')?.value || 0)} words</li>
            <li>You've eaten approximately {formatNumber(stats.find(s => s.id === 'meals')?.value || 0)} meals</li>
            <li>Your eyes have blinked over {formatNumber(stats.find(s => s.id === 'blinks')?.value || 0)} times</li>
          </ul>
        </div>

        {/* Reset Button */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => setAge(25)}
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            🔄 Reset to Default Age
          </button>
        </div>
      </div>
    </div>
  );
};

export default LifeStats;

