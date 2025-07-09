import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

interface Item {
  name: string;
  price: number;
  icon: string;
  category: string;
  description: string;
}

const SpendBillGatesMoney: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [money, setMoney] = useState(100000000000); // $100 billion
  const [purchasedItems, setPurchasedItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const items: Item[] = [
    // Food & Drinks
    { name: 'Coffee', price: 5, icon: '☕', category: 'food', description: 'A nice cup of coffee' },
    { name: 'Pizza', price: 20, icon: '🍕', category: 'food', description: 'Delicious pizza' },
    { name: 'Lobster Dinner', price: 100, icon: '🦞', category: 'food', description: 'Fancy lobster dinner' },
    { name: 'Golden Apple', price: 1000, icon: '🍎', category: 'food', description: 'Solid gold apple' },
    
    // Transportation
    { name: 'Bus Ticket', price: 2, icon: '🚌', category: 'transport', description: 'Public transportation' },
    { name: 'Uber Ride', price: 25, icon: '🚗', category: 'transport', description: 'Comfortable ride' },
    { name: 'Private Jet', price: 50000000, icon: '✈️', category: 'transport', description: 'Your own private jet' },
    { name: 'Space Shuttle', price: 2000000000, icon: '🚀', category: 'transport', description: 'Go to space!' },
    
    // Entertainment
    { name: 'Movie Ticket', price: 15, icon: '🎬', category: 'entertainment', description: 'Watch a movie' },
    { name: 'Concert Ticket', price: 200, icon: '🎵', category: 'entertainment', description: 'Live music' },
    { name: 'Sports Team', price: 2000000000, icon: '🏈', category: 'entertainment', description: 'Buy an NFL team' },
    { name: 'Hollywood Studio', price: 5000000000, icon: '🎭', category: 'entertainment', description: 'Your own studio' },
    
    // Technology
    { name: 'Smartphone', price: 1000, icon: '📱', category: 'tech', description: 'Latest smartphone' },
    { name: 'Gaming Console', price: 500, icon: '🎮', category: 'tech', description: 'Next-gen gaming' },
    { name: 'Supercomputer', price: 10000000, icon: '💻', category: 'tech', description: 'Ultimate computing power' },
    { name: 'AI Company', price: 10000000000, icon: '🤖', category: 'tech', description: 'Your own AI startup' },
    
    // Real Estate
    { name: 'House', price: 500000, icon: '🏠', category: 'realestate', description: 'Nice family home' },
    { name: 'Mansion', price: 10000000, icon: '🏰', category: 'realestate', description: 'Luxury mansion' },
    { name: 'Island', price: 100000000, icon: '🏝️', category: 'realestate', description: 'Private island' },
    { name: 'Country', price: 10000000000, icon: '🏳️', category: 'realestate', description: 'Small country' },
    
    // Luxury
    { name: 'Diamond Ring', price: 10000, icon: '💍', category: 'luxury', description: 'Sparkling diamond' },
    { name: 'Luxury Car', price: 200000, icon: '🏎️', category: 'luxury', description: 'High-end sports car' },
    { name: 'Yacht', price: 50000000, icon: '🛥️', category: 'luxury', description: 'Mega yacht' },
    { name: 'Art Collection', price: 1000000000, icon: '🎨', category: 'luxury', description: 'World-class art' }
  ];

  const categories = [
    { id: 'all', name: 'All Items', icon: '🛒' },
    { id: 'food', name: 'Food & Drinks', icon: '🍽️' },
    { id: 'transport', name: 'Transportation', icon: '🚗' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎭' },
    { id: 'tech', name: 'Technology', icon: '💻' },
    { id: 'realestate', name: 'Real Estate', icon: '🏠' },
    { id: 'luxury', name: 'Luxury', icon: '💎' }
  ];

  const formatMoney = (amount: number): string => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(1)}T`;
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const purchaseItem = (item: Item) => {
    if (money >= item.price) {
      setMoney(prev => prev - item.price);
      setPurchasedItems(prev => [...prev, item]);
    }
  };

  const resetGame = () => {
    setMoney(100000000000);
    setPurchasedItems([]);
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

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
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            color: '#333', 
            margin: '0 0 10px 0',
            fontWeight: 'bold'
          }}>
            💰 Spend Bill Gates' Money 💰
          </h1>
          <div style={{ 
            fontSize: '36px', 
            color: '#2ecc71', 
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            {formatMoney(money)} remaining
          </div>
          <button 
            onClick={resetGame}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Reset Game
          </button>
          <span style={{ fontSize: '18px', color: '#666' }}>
            Purchased: {purchasedItems.length} items
          </span>
        </div>

        {/* Categories */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '30px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                background: selectedCategory === category.id ? '#3498db' : '#ecf0f1',
                color: selectedCategory === category.id ? 'white' : '#333',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '25px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {filteredItems.map((item, index) => (
            <div
              key={index}
              style={{
                background: money >= item.price ? '#f8f9fa' : '#e9ecef',
                border: `3px solid ${money >= item.price ? '#2ecc71' : '#95a5a6'}`,
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center',
                cursor: money >= item.price ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: money >= item.price ? 1 : 0.6
              }}
              onClick={() => money >= item.price && purchaseItem(item)}
            >
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                {item.icon}
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                margin: '0 0 10px 0',
                color: '#333'
              }}>
                {item.name}
              </h3>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: money >= item.price ? '#2ecc71' : '#95a5a6',
                marginBottom: '10px'
              }}>
                {formatMoney(item.price)}
              </div>
              <p style={{ 
                fontSize: '14px', 
                color: '#666',
                margin: '0'
              }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Purchased Items */}
        {purchasedItems.length > 0 && (
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              color: '#333',
              borderBottom: '2px solid #3498db',
              paddingBottom: '10px',
              marginBottom: '20px'
            }}>
              🛒 Purchased Items ({purchasedItems.length})
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {purchasedItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: '#e8f5e8',
                    border: '2px solid #2ecc71',
                    borderRadius: '8px',
                    padding: '15px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '5px' }}>
                    {item.icon}
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    {item.name}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#2ecc71',
                    fontWeight: 'bold'
                  }}>
                    {formatMoney(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendBillGatesMoney;