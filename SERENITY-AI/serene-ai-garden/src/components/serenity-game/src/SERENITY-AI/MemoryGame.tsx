import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

interface Card {
  id: number;
  value: string;
  x: number;
  y: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const cardValues = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'];

  useEffect(() => {
    if (phaserGameRef.current) return;

    class MemoryGameScene extends Phaser.Scene {
      private cardObjects: Phaser.GameObjects.Rectangle[] = [];
      private cardTexts: Phaser.GameObjects.Text[] = [];
      private scoreText!: Phaser.GameObjects.Text;
      private movesText!: Phaser.GameObjects.Text;
      private timeText!: Phaser.GameObjects.Text;
      private gameTimer!: Phaser.Time.TimerEvent;
      private internalScore: number = 0;
      private internalMoves: number = 0;
      private internalTime: number = 0;
      private internalFlippedCards: number[] = [];
      private internalCards: Card[] = [];
      private canFlip: boolean = true;
      public resetGame: (() => void) | undefined;

      constructor() {
        super('MemoryGameScene');
      }

      create() {
        // Set background
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x87CEEB).setOrigin(0, 0);

        // Initialize internal state
        this.internalScore = 0;
        this.internalMoves = 0;
        this.internalTime = 0;
        this.internalFlippedCards = [];
        this.internalCards = [];
        this.canFlip = true;
        setScore(0);
        setMoves(0);
        setTime(0);
        setFlippedCards([]);
        setCards([]);

        // Create UI
        this.scoreText = this.add.text(20, 20, `Score: 0`, {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        });

        this.movesText = this.add.text(200, 20, `Moves: 0`, {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        });

        this.timeText = this.add.text(350, 20, `Time: 0s`, {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        });

        // Create cards
        this.createCards();

        // Start timer
        this.gameTimer = this.time.addEvent({
          delay: 1000,
          callback: this.updateTimer,
          callbackScope: this,
          loop: true
        });

        // Define reset method
        this.resetGame = () => {
          // Clear existing cards
          this.cardObjects.forEach(card => card.destroy());
          this.cardTexts.forEach(text => text.destroy());
          this.cardObjects = [];
          this.cardTexts = [];
          
          // Reset internal state
          this.internalScore = 0;
          this.internalMoves = 0;
          this.internalTime = 0;
          this.internalFlippedCards = [];
          this.internalCards = [];
          this.canFlip = true;
          
          // Update React state
          setScore(0);
          setMoves(0);
          setTime(0);
          setFlippedCards([]);
          setCards([]);
          setGameWon(false);
          setIsPlaying(true);
          
          // Update UI
          this.scoreText.setText('Score: 0');
          this.movesText.setText('Moves: 0');
          this.timeText.setText('Time: 0s');
          
          // Recreate cards
          this.createCards();
          
          // Restart timer
          if (this.gameTimer) this.gameTimer.remove();
          this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
          });
        };
      }

      createCards() {
        const cardSize = 80;
        const cardsPerRow = 8;
        const startX = (GAME_WIDTH - (cardsPerRow * cardSize + (cardsPerRow - 1) * 10)) / 2;
        const startY = 100;

        // Create shuffled card pairs
        const shuffledValues = [...cardValues, ...cardValues].sort(() => 0.5 - Math.random());

        // Initialize internal cards array
        this.internalCards = shuffledValues.map((value, index) => {
          const row = Math.floor(index / cardsPerRow);
          const col = index % cardsPerRow;
          const x = startX + col * (cardSize + 10);
          const y = startY + row * (cardSize + 10);

          return {
            id: index,
            value: value,
            x: x + cardSize / 2,
            y: y + cardSize / 2,
            isFlipped: false,
            isMatched: false
          };
        });

        // Update React state
        setCards([...this.internalCards]);

        shuffledValues.forEach((value, index) => {
          const row = Math.floor(index / cardsPerRow);
          const col = index % cardsPerRow;
          const x = startX + col * (cardSize + 10);
          const y = startY + row * (cardSize + 10);

          // Create card background
          const card = this.add.rectangle(x + cardSize / 2, y + cardSize / 2, cardSize, cardSize, 0x4a90e2);
          card.setStrokeStyle(2, 0xffffff);
          card.setInteractive();
          card.on('pointerdown', () => this.onCardClick(index, value));
          this.cardObjects.push(card);

          // Create card text (hidden initially)
          const cardText = this.add.text(x + cardSize / 2, y + cardSize / 2, value, {
            fontSize: '32px',
            color: '#ffffff'
          }).setOrigin(0.5);
          cardText.setVisible(false);
          this.cardTexts.push(cardText);
        });
      }

      onCardClick(index: number, value: string) {
        if (!this.canFlip || this.internalFlippedCards.length >= 2 || 
            this.internalCards[index]?.isMatched || this.internalCards[index]?.isFlipped) {
          return;
        }

        // Flip card
        const card = this.cardObjects[index];
        const cardText = this.cardTexts[index];
        
        card.setFillStyle(0x2ecc71);
        cardText.setVisible(true);

        // Add to flipped cards
        this.internalFlippedCards.push(index);
        setFlippedCards([...this.internalFlippedCards]);

        // Update cards state
        this.internalCards[index] = { ...this.internalCards[index], isFlipped: true };
        setCards([...this.internalCards]);

        if (this.internalFlippedCards.length === 2) {
          this.canFlip = false;
          this.internalMoves += 1;
          setMoves(this.internalMoves);
          
          // Check for match
          const [firstIndex, secondIndex] = this.internalFlippedCards;
          const firstValue = this.cardTexts[firstIndex].text;
          const secondValue = this.cardTexts[secondIndex].text;

          if (firstValue === secondValue) {
            // Match found
            this.internalScore += 10;
            setScore(this.internalScore);
            this.scoreText.setText(`Score: ${this.internalScore}`);
            
            this.internalCards[firstIndex] = { ...this.internalCards[firstIndex], isMatched: true };
            this.internalCards[secondIndex] = { ...this.internalCards[secondIndex], isMatched: true };
            setCards([...this.internalCards]);

            // Check if game is won
            const matchedCards = this.internalCards.filter(c => c.isMatched).length;
            if (matchedCards === cardValues.length * 2) {
              this.endGame();
            }

            this.internalFlippedCards = [];
            setFlippedCards([]);
            this.canFlip = true;
          } else {
            // No match - flip back after delay
            this.time.delayedCall(1000, () => {
              this.internalFlippedCards.forEach(cardIndex => {
                this.cardObjects[cardIndex].setFillStyle(0x4a90e2);
                this.cardTexts[cardIndex].setVisible(false);
              });

              this.internalCards[firstIndex] = { ...this.internalCards[firstIndex], isFlipped: false };
              this.internalCards[secondIndex] = { ...this.internalCards[secondIndex], isFlipped: false };
              setCards([...this.internalCards]);
              
              this.internalFlippedCards = [];
              setFlippedCards([]);
              this.canFlip = true;
            });
          }
        }
      }

      updateTimer() {
        this.internalTime += 1;
        setTime(this.internalTime);
        this.timeText.setText(`Time: ${this.internalTime}s`);
      }

      endGame() {
        this.gameTimer.remove();
        setGameWon(true);
        setIsPlaying(false);
        
        if (this.internalScore > highScore) {
          setHighScore(this.internalScore);
        }

        // Show win message
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Congratulations!', {
          fontSize: '48px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, `You won in ${this.internalMoves} moves!`, {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 15, y: 5 }
        }).setOrigin(0.5);
      }
    }

    phaserGameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: gameRef.current!,
      backgroundColor: '#87CEEB',
      scene: MemoryGameScene,
      audio: {
        disableWebAudio: true
      },
      dom: {
        createContainer: false
      }
    });

    return () => {
      phaserGameRef.current?.destroy(true);
      phaserGameRef.current = null;
    };
  }, []);

  const startGame = () => {
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.keys['MemoryGameScene'] as any;
      if (scene && typeof scene.resetGame === 'function') {
        scene.resetGame();
        return;
      }
    }
    setScore(0);
    setMoves(0);
    setTime(0);
    setGameWon(false);
    setIsPlaying(true);
    setFlippedCards([]);
    setCards([]);
    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
      phaserGameRef.current = null;
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1300px',
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
            🧠 Memory Game 🧠
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            margin: '0 0 20px 0'
          }}>
            Find matching pairs of cards!
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: '#e8f5e8',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', color: '#2ecc71', fontWeight: 'bold' }}>
              Score
            </div>
            <div style={{ fontSize: '36px', color: '#333', fontWeight: 'bold' }}>
              {score}
            </div>
          </div>
          
          <div style={{
            background: '#fff3cd',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', color: '#ffc107', fontWeight: 'bold' }}>
              Moves
            </div>
            <div style={{ fontSize: '36px', color: '#333', fontWeight: 'bold' }}>
              {moves}
            </div>
          </div>
          
          <div style={{
            background: '#e3f2fd',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', color: '#2196f3', fontWeight: 'bold' }}>
              Time
            </div>
            <div style={{ fontSize: '36px', color: '#333', fontWeight: 'bold' }}>
              {time}s
            </div>
          </div>
          
          <div style={{
            background: '#f8f9fa',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', color: '#6c757d', fontWeight: 'bold' }}>
              High Score
            </div>
            <div style={{ fontSize: '36px', color: '#333', fontWeight: 'bold' }}>
              {highScore}
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div style={{
          border: '3px solid #fff',
          borderRadius: '10px',
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
          background: '#87CEEB',
          marginBottom: '30px'
        }}>
          <div ref={gameRef} style={{ width: GAME_WIDTH, height: GAME_HEIGHT }} />
        </div>

        {/* Controls */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {!isPlaying && (
            <button
              onClick={startGame}
              style={{
                background: '#2ecc71',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                fontSize: '18px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🎮 Start Game
            </button>
          )}
          
          {gameWon && (
            <button
              onClick={startGame}
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
              🔄 Play Again
            </button>
          )}
        </div>

        {/* Instructions */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            color: '#333',
            margin: '0 0 15px 0'
          }}>
            📝 How to Play:
          </h3>
          <ul style={{ 
            fontSize: '16px', 
            color: '#666',
            margin: '0',
            paddingLeft: '20px'
          }}>
            <li>Click on cards to flip them and reveal their symbols</li>
            <li>Find matching pairs of cards</li>
            <li>Try to complete the game with the fewest moves</li>
            <li>Score points for each match you find</li>
            <li>Complete all pairs to win the game!</li>
          </ul>
        </div>

        {/* Memory Tips */}
        <div style={{
          background: '#fff3cd',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            color: '#856404',
            margin: '0 0 15px 0'
          }}>
            💡 Memory Tips:
          </h3>
          <ul style={{ 
            fontSize: '16px', 
            color: '#856404',
            margin: '0',
            paddingLeft: '20px'
          }}>
            <li>Try to remember the positions of cards you've seen</li>
            <li>Start by flipping cards in a systematic pattern</li>
            <li>Focus on one area at a time</li>
            <li>Take your time - rushing leads to more moves</li>
            <li>Practice regularly to improve your memory!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;