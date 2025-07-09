import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

const ClickTheColor: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (phaserGameRef.current) return;

    class ClickTheColorScene extends Phaser.Scene {
      private targetColor!: string;
      private colorBoxes: Phaser.GameObjects.Rectangle[] = [];
      private scoreText!: Phaser.GameObjects.Text;
      private timeText!: Phaser.GameObjects.Text;
      private colorNameText!: Phaser.GameObjects.Text;
      private gameTimer!: Phaser.Time.TimerEvent;
      private internalTimeLeft: number = 30;
      public resetGame: (() => void) | undefined;

      constructor() {
        super('ClickTheColorScene');
      }

      create() {
        // Set background
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x2c3e50).setOrigin(0, 0);

        // Create UI
        this.scoreText = this.add.text(20, 20, `Score: ${score}`, {
          fontSize: '32px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        });

        this.timeText = this.add.text(GAME_WIDTH - 200, 20, `Time: ${timeLeft}`, {
          fontSize: '32px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        });

        this.colorNameText = this.add.text(GAME_WIDTH / 2, 50, 'Click the color:', {
          fontSize: '36px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 15, y: 10 }
        }).setOrigin(0.5);

        // Start game
        this.internalTimeLeft = 30;
        this.scoreText.setText('Score: 0');
        this.timeText.setText('Time: 30');
        this.colorNameText.setText('Click the color:');
        setScore(0);
        setTimeLeft(30);
        setGameOver(false);
        setIsPlaying(true);
        this.startNewRound();
        if (this.gameTimer) this.gameTimer.remove();
        this.gameTimer = this.time.addEvent({
          delay: 1000,
          callback: this.updateTimer,
          callbackScope: this,
          loop: true
        });

        this.resetGame = () => {
          this.internalTimeLeft = 30;
          this.scoreText.setText('Score: 0');
          this.timeText.setText('Time: 30');
          this.colorNameText.setText('Click the color:');
          setScore(0);
          setTimeLeft(30);
          setGameOver(false);
          setIsPlaying(true);
          this.startNewRound();
          if (this.gameTimer) this.gameTimer.remove();
          this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
          });
        };
      }

      startNewRound() {
        // Clear previous boxes
        this.colorBoxes.forEach(box => box.destroy());
        this.colorBoxes = [];

        // Generate random colors
        const colors = this.generateRandomColors();
        this.targetColor = colors[Math.floor(Math.random() * colors.length)];

        // Update color name text
        this.colorNameText.setText(`Click the color: ${this.targetColor}`);

        // Create color boxes
        const boxSize = 120;
        const boxesPerRow = 4;
        const startX = (GAME_WIDTH - (boxesPerRow * boxSize + (boxesPerRow - 1) * 20)) / 2;
        const startY = 150;

        colors.forEach((color, index) => {
          const row = Math.floor(index / boxesPerRow);
          const col = index % boxesPerRow;
          const x = startX + col * (boxSize + 20);
          const y = startY + row * (boxSize + 20);

          const box = this.add.rectangle(x + boxSize / 2, y + boxSize / 2, boxSize, boxSize, this.hexToNumber(color));
          box.setInteractive();
          box.on('pointerdown', () => this.onColorClick(color));
          this.colorBoxes.push(box);

          // Add border
          this.add.rectangle(x + boxSize / 2, y + boxSize / 2, boxSize, boxSize, 0xffffff, 0).setStrokeStyle(2, 0xffffff);
        });
      }

      generateRandomColors(): string[] {
        const colorNames = [
          'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown',
          'Black', 'White', 'Gray', 'Cyan', 'Magenta', 'Lime', 'Navy', 'Teal'
        ];

        const colorValues = {
          'Red': '#FF0000', 'Blue': '#0000FF', 'Green': '#00FF00', 'Yellow': '#FFFF00',
          'Purple': '#800080', 'Orange': '#FFA500', 'Pink': '#FFC0CB', 'Brown': '#A52A2A',
          'Black': '#000000', 'White': '#FFFFFF', 'Gray': '#808080', 'Cyan': '#00FFFF',
          'Magenta': '#FF00FF', 'Lime': '#00FF00', 'Navy': '#000080', 'Teal': '#008080'
        };

        const shuffled = colorNames.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 16).map(name => colorValues[name as keyof typeof colorValues]);
      }

      hexToNumber(hex: string): number {
        return parseInt(hex.replace('#', ''), 16);
      }

      onColorClick(clickedColor: string) {
        if (clickedColor === this.targetColor) {
          const newScore = score + 1;
          setScore(newScore);
          this.scoreText.setText(`Score: ${newScore}`);
          
          // Visual feedback
          this.tweens.add({
            targets: this.colorBoxes,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 100,
            yoyo: true
          });

          // Start new round after a short delay
          this.time.delayedCall(500, () => {
            this.startNewRound();
          });
        } else {
          // Wrong color - visual feedback
          this.tweens.add({
            targets: this.colorBoxes,
            alpha: 0.5,
            duration: 200,
            yoyo: true
          });
        }
      }

      updateTimer() {
        this.internalTimeLeft -= 1;
        setTimeLeft(this.internalTimeLeft);
        this.timeText.setText(`Time: ${this.internalTimeLeft}`);
        if (this.internalTimeLeft <= 0) {
          this.endGame();
        }
      }

      endGame() {
        this.gameTimer.remove();
        setGameOver(true);
        setIsPlaying(false);
        const currentScore = score;
        if (currentScore > highScore) {
          setHighScore(currentScore);
        }
        // Show game over text
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Game Over!', {
          fontSize: '64px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, `Final Score: ${currentScore}`, {
          fontSize: '32px',
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
      backgroundColor: '#2c3e50',
      scene: ClickTheColorScene,
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
      const scene = phaserGameRef.current.scene.keys['ClickTheColorScene'] as any;
      if (scene && typeof scene.resetGame === 'function') {
        scene.resetGame();
        return;
      }
    }
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setIsPlaying(true);
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
            🎨 Click the Color 🎨
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            margin: '0 0 20px 0'
          }}>
            Click the color that matches the name!
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
              Current Score
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
              Time Left
            </div>
            <div style={{ fontSize: '36px', color: '#333', fontWeight: 'bold' }}>
              {timeLeft}s
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
          background: '#2c3e50',
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
          
          {gameOver && (
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
            <li>Read the color name displayed at the top</li>
            <li>Click the box that matches that color</li>
            <li>Score points for correct answers</li>
            <li>You have 30 seconds to get as many as possible!</li>
          </ul>
        </div>

        {/* Color Facts */}
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
            🎨 Fun Color Facts:
          </h3>
          <ul style={{ 
            fontSize: '16px', 
            color: '#856404',
            margin: '0',
            paddingLeft: '20px'
          }}>
            <li>Red is the first color babies can see</li>
            <li>Blue is the world's favorite color</li>
            <li>Yellow is the most visible color in daylight</li>
            <li>Green is the most restful color for the human eye</li>
            <li>Purple was once the most expensive color to produce</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClickTheColor;