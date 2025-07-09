import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const DrawPerfectCircle: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameState, setGameState] = useState<'drawing' | 'evaluating' | 'complete'>('drawing');

  useEffect(() => {
    if (phaserGameRef.current) return;

    class CircleGameScene extends Phaser.Scene {
      private graphics!: Phaser.GameObjects.Graphics;
      private targetCircle!: Phaser.GameObjects.Graphics;
      private drawnPoints: { x: number; y: number }[] = [];
      private isDrawing: boolean = false;
      private centerX: number = GAME_WIDTH / 2;
      private centerY: number = GAME_HEIGHT / 2;
      private targetRadius: number = 100;
      private scoreText!: Phaser.GameObjects.Text;
      private attemptsText!: Phaser.GameObjects.Text;
      private instructionText!: Phaser.GameObjects.Text;

      constructor() {
        super('CircleGameScene');
      }

      create() {
        // Set background
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x87CEEB).setOrigin(0, 0);

        // Create target circle (invisible)
        this.targetCircle = this.add.graphics();
        this.targetCircle.lineStyle(2, 0x00ff00, 0.3);
        this.targetCircle.strokeCircle(this.centerX, this.centerY, this.targetRadius);

        // Create drawing graphics
        this.graphics = this.add.graphics();

        // Create UI text
        this.scoreText = this.add.text(20, 20, `Score: ${score}`, {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        });

        this.attemptsText = this.add.text(20, 60, `Attempts: ${attempts}`, {
          fontSize: '20px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        });

        this.instructionText = this.add.text(GAME_WIDTH / 2, 50, 'Draw a perfect circle!', {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        // Set up input handlers
        this.input.on('pointerdown', this.startDrawing, this);
        this.input.on('pointermove', this.draw, this);
        this.input.on('pointerup', this.stopDrawing, this);

        // Add reset button
        const resetButton = this.add.text(GAME_WIDTH - 150, 20, 'Reset', {
          fontSize: '20px',
          color: '#ffffff',
          backgroundColor: '#e74c3c',
          padding: { x: 15, y: 8 }
        });
        resetButton.setInteractive({ cursor: 'pointer' });
        resetButton.on('pointerdown', this.resetGame, this);
      }

      startDrawing(pointer: any) {
        this.isDrawing = true;
        this.drawnPoints = [];
        this.graphics.clear();
        this.graphics.lineStyle(3, 0xffffff);
        this.graphics.beginPath();
        this.graphics.moveTo(pointer.x, pointer.y);
        this.drawnPoints.push({ x: pointer.x, y: pointer.y });
      }

      draw(pointer: any) {
        if (this.isDrawing) {
          this.drawnPoints.push({ x: pointer.x, y: pointer.y });
          this.graphics.clear();
          this.graphics.lineStyle(3, 0xffffff);
          this.graphics.beginPath();
          if (this.drawnPoints.length > 0) {
            this.graphics.moveTo(this.drawnPoints[0].x, this.drawnPoints[0].y);
            for (let i = 1; i < this.drawnPoints.length; i++) {
              this.graphics.lineTo(this.drawnPoints[i].x, this.drawnPoints[i].y);
            }
          }
          this.graphics.strokePath();
        }
      }

      stopDrawing() {
        if (this.isDrawing) {
          this.isDrawing = false;
          this.graphics.closePath();
          this.graphics.strokePath();
          this.evaluateCircle();
        }
      }

      evaluateCircle() {
        if (this.drawnPoints.length < 10) {
          this.showResult(0, 'Too few points!');
          return;
        }

        // Calculate center of drawn shape
        const centerX = this.drawnPoints.reduce((sum, point) => sum + point.x, 0) / this.drawnPoints.length;
        const centerY = this.drawnPoints.reduce((sum, point) => sum + point.y, 0) / this.drawnPoints.length;

        // Calculate average radius
        const radii = this.drawnPoints.map(point => 
          Math.sqrt(Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2))
        );
        const avgRadius = radii.reduce((sum, radius) => sum + radius, 0) / radii.length;

        // Calculate circularity (how close to perfect circle)
        const radiusVariance = radii.reduce((sum, radius) => 
          sum + Math.pow(radius - avgRadius, 2), 0
        ) / radii.length;
        const circularity = Math.max(0, 100 - (radiusVariance / 10));

        // Calculate distance from target center
        const centerDistance = Math.sqrt(
          Math.pow(centerX - this.centerX, 2) + Math.pow(centerY - this.centerY, 2)
        );
        const centerScore = Math.max(0, 100 - (centerDistance / 2));

        // Calculate size similarity
        const sizeScore = Math.max(0, 100 - Math.abs(avgRadius - this.targetRadius));

        // Final score
        const finalScore = Math.round((circularity + centerScore + sizeScore) / 3);
        
        this.showResult(finalScore, this.getScoreMessage(finalScore));
      }

      getScoreMessage(score: number): string {
        if (score >= 95) return 'Perfect! Amazing circle!';
        if (score >= 85) return 'Excellent! Very close to perfect!';
        if (score >= 75) return 'Good! Pretty circular!';
        if (score >= 60) return 'Not bad! Keep practicing!';
        if (score >= 40) return 'Getting there! Try again!';
        return 'Keep trying! Practice makes perfect!';
      }

      showResult(score: number, message: string) {
        setScore(score);
        setAttempts(prev => prev + 1);
        if (score > bestScore) {
          setBestScore(score);
        }

        // Show result text
        const resultText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 
          `Score: ${score}%\n${message}`, {
          fontSize: '32px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 20, y: 15 },
          align: 'center'
        }).setOrigin(0.5);

        // Show target circle briefly
        this.targetCircle.setVisible(true);

        // Hide result after 3 seconds
        this.time.delayedCall(3000, () => {
          resultText.destroy();
          this.targetCircle.setVisible(false);
          this.graphics.clear();
        });
      }

      resetGame() {
        this.graphics.clear();
        this.targetCircle.setVisible(false);
        this.drawnPoints = [];
        this.isDrawing = false;
      }

      update() {
        // Update UI text
        this.scoreText.setText(`Score: ${score}`);
        this.attemptsText.setText(`Attempts: ${attempts}`);
      }
    }

    phaserGameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: gameRef.current!,
      backgroundColor: '#f0f0f0',
      scene: CircleGameScene,
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
  }, [score, attempts, bestScore]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
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
            ⭕ Draw a Perfect Circle ⭕
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            margin: '0 0 20px 0'
          }}>
            Try to draw the most perfect circle you can!
          </p>
        </div>

        {/* Game Stats */}
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
              {score}%
            </div>
          </div>
          
          <div style={{
            background: '#fff3cd',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', color: '#ffc107', fontWeight: 'bold' }}>
              Best Score
            </div>
            <div style={{ fontSize: '36px', color: '#333', fontWeight: 'bold' }}>
              {bestScore}%
            </div>
          </div>
          
          <div style={{
            background: '#f8f9fa',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', color: '#6c757d', fontWeight: 'bold' }}>
              Attempts
            </div>
            <div style={{ fontSize: '36px', color: '#333', fontWeight: 'bold' }}>
              {attempts}
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div style={{
          border: '3px solid #fff',
          borderRadius: '10px',
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
          background: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%)',
          marginBottom: '30px'
        }}>
          <div ref={gameRef} style={{ width: GAME_WIDTH, height: GAME_HEIGHT }} />
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
            <li>Click and drag to draw a circle</li>
            <li>Try to make it as perfectly round as possible</li>
            <li>Keep it centered in the drawing area</li>
            <li>Make it roughly the same size as the target</li>
            <li>Your score is based on circularity, center position, and size</li>
          </ul>
        </div>

        {/* Tips */}
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
            💡 Tips for a Perfect Circle:
          </h3>
          <ul style={{ 
            fontSize: '16px', 
            color: '#856404',
            margin: '0',
            paddingLeft: '20px'
          }}>
            <li>Draw slowly and steadily</li>
            <li>Try to maintain consistent pressure</li>
            <li>Visualize the circle before drawing</li>
            <li>Practice makes perfect!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DrawPerfectCircle;