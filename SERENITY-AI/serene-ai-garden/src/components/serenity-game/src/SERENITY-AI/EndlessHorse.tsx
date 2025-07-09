import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const SEGMENT_SIZE = 15;

const EndlessHorse: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [horseLength, setHorseLength] = useState(1);
  const [clickCount, setClickCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (phaserGameRef.current) return;

    class EndlessHorseScene extends Phaser.Scene {
      private horseParts: Phaser.GameObjects.Rectangle[] = [];
      private isGrowing: boolean = false;
      private clickText!: Phaser.GameObjects.Text;
      private lengthText!: Phaser.GameObjects.Text;
      private internalHorseLength: number = 1;
      private internalClickCount: number = 0;
      private headGroup: Phaser.GameObjects.Container | null = null;

      constructor() {
        super('EndlessHorseScene');
      }

      create() {
        // Set background
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x87CEEB).setOrigin(0, 0);

        // Add grass at the far right
        this.add.rectangle(GAME_WIDTH - 60, GAME_HEIGHT / 2 + 40, 120, 80, 0x228B22).setOrigin(0.5, 0.5);
        for (let i = 0; i < 10; i++) {
          this.add.rectangle(GAME_WIDTH - 100 + i * 8, GAME_HEIGHT / 2 + 10 + Math.random() * 30, 6, 30 + Math.random() * 20, 0x2ecc40).setAngle(-20 + Math.random() * 40);
        }

        // Create initial horse part
        this.addHorsePart();
        this.internalHorseLength = 1;
        this.internalClickCount = 0;
        setHorseLength(1);
        setClickCount(0);

        // Create UI text
        this.clickText = this.add.text(20, 20, 'Click to make the horse longer!', {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        });

        this.lengthText = this.add.text(20, 60, `Horse Length: 1`, {
          fontSize: '20px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        });

        // Set up input handler
        this.input.on('pointerdown', this.growHorse, this);

        // Add instructions
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 50, 'Click anywhere to make the horse longer!', {
          fontSize: '18px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
      }

      addHorsePart() {
        // This function is now unused, but keep for reference
      }

      growHorse() {
        if (this.isGrowing) return;
        this.isGrowing = true;
        this.internalClickCount += 1;
        this.internalHorseLength += 1;
        setClickCount(this.internalClickCount);
        setHorseLength(this.internalHorseLength);

        // Shift all existing parts right by SEGMENT_SIZE
        this.horseParts.forEach(part => {
          this.tweens.add({
            targets: part,
            x: part.x + SEGMENT_SIZE,
            duration: 300,
            ease: 'Linear',
          });
        });

        // Add new horse part at the leftmost (tail) position
        const y = GAME_HEIGHT / 2;
        const x = 50; // Always add at the far left
        const part = this.add.rectangle(x, y, 0, 25, 0x8B4513); // Start with width 0
        this.horseParts.unshift(part);

        // Animate the growth slowly from back to front
        this.tweens.add({
          targets: part,
          width: 25,
          duration: 800,
          ease: 'Linear',
          onUpdate: () => {
            part.setSize(part.width, 25);
          },
          onComplete: () => {
            this.isGrowing = false;
          }
        });

        // Add legs for the new part
        this.add.rectangle(x - 8, y + 15, 6, 25, 0x654321); // Front leg
        this.add.rectangle(x + 8, y + 15, 6, 25, 0x654321); // Back leg
        this.add.rectangle(x - 8, y + 40, 8, 4, 0x000000); // Front hoof
        this.add.rectangle(x + 8, y + 40, 8, 4, 0x000000); // Back hoof

        // Add tail for the last part (leftmost)
        if (this.horseParts.length > 1) {
          const tailX = x - 15;
          const tailY = y - 5;
          this.add.ellipse(tailX, tailY, 12, 6, 0x654321);
          this.add.ellipse(tailX - 8, tailY - 3, 8, 4, 0x654321);
        }

        // Remove previous head graphics if any
        if (this.headGroup) this.headGroup.destroy(true);

        // Draw the head at the rightmost segment
        const headPart = this.horseParts[this.horseParts.length - 1];
        const headX = headPart.x;
        const headY = headPart.y;
        this.headGroup = this.add.container();
        // Head
        this.headGroup.add(this.add.ellipse(headX + 15, headY - 8, 20, 16, 0x8B4513));
        // Eye
        this.headGroup.add(this.add.circle(headX + 22, headY - 12, 3, 0x000000));
        this.headGroup.add(this.add.circle(headX + 23, headY - 13, 1, 0xFFFFFF));
        // Nose
        this.headGroup.add(this.add.ellipse(headX + 28, headY - 6, 8, 6, 0x654321));
        // Ears
        this.headGroup.add(this.add.ellipse(headX + 12, headY - 18, 4, 8, 0x654321));
        this.headGroup.add(this.add.ellipse(headX + 18, headY - 18, 4, 8, 0x654321));
        // Mane
        this.headGroup.add(this.add.ellipse(headX + 15, headY - 2, 18, 8, 0x654321));
        // Moving front right leg (relative to head)
        const movingLeg = this.add.rectangle(headX + 8, headY + 15, 6, 25, 0x654321);
        const movingHoof = this.add.rectangle(headX + 8, headY + 40, 8, 4, 0x000000);
        this.headGroup.add(movingLeg);
        this.headGroup.add(movingHoof);
        // Animate the leg to swing forward/backward
        this.tweens.add({
          targets: [movingLeg, movingHoof],
          angle: { from: -30, to: 30 },
          duration: 400,
          yoyo: true,
          repeat: 0
        });

        // Update UI
        this.lengthText.setText(`Horse Length: ${this.internalHorseLength}`);
      }

      update() {
        // Update UI text
        this.clickText.setText(`Clicks: ${this.internalClickCount}`);
        this.lengthText.setText(`Horse Length: ${this.internalHorseLength}`);
      }
    }

    phaserGameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: gameRef.current!,
      backgroundColor: '#87CEEB',
      scene: EndlessHorseScene,
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

  const resetHorse = () => {
    setHorseLength(1);
    setClickCount(0);
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
            🐎 Endless Horse 🐎
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            margin: '0 0 20px 0'
          }}>
            Click to make the horse longer and longer!
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
              Horse Length
            </div>
            <div style={{ fontSize: '36px', color: '#333', fontWeight: 'bold' }}>
              {horseLength}
            </div>
          </div>
          
          <div style={{
            background: '#fff3cd',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', color: '#ffc107', fontWeight: 'bold' }}>
              Total Clicks
            </div>
            <div style={{ fontSize: '36px', color: '#333', fontWeight: 'bold' }}>
              {clickCount}
            </div>
          </div>
          
          <div style={{
            background: '#f8f9fa',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', color: '#6c757d', fontWeight: 'bold' }}>
              Horse Width
            </div>
            <div style={{ fontSize: '36px', color: '#333', fontWeight: 'bold' }}>
              {Math.round(horseLength * 30)}px
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

        {/* Controls */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={resetHorse}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            🔄 Reset Horse
          </button>
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
            <li>Click anywhere on the game area to make the horse longer</li>
            <li>Each click adds a new segment to the horse</li>
            <li>Watch your horse grow endlessly!</li>
            <li>Try to reach impressive lengths</li>
          </ul>
        </div>

        {/* Fun Facts */}
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
            🐎 Fun Horse Facts:
          </h3>
          <ul style={{ 
            fontSize: '16px', 
            color: '#856404',
            margin: '0',
            paddingLeft: '20px'
          }}>
            <li>Real horses can run up to 55 mph</li>
            <li>Horses can sleep both standing up and lying down</li>
            <li>A horse's brain weighs about half as much as a human brain</li>
            <li>Horses have the largest eyes of any land mammal</li>
            <li>Your endless horse is now {horseLength} segments long!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EndlessHorse;