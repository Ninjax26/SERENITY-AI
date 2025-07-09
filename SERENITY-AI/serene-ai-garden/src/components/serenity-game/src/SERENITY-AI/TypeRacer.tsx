import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

interface Word {
  text: string;
  x: number;
  y: number;
  speed: number;
  active: boolean;
}

const TypeRacer: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [words, setWords] = useState<Word[]>([]);

  const wordList = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
  ];

  useEffect(() => {
    if (phaserGameRef.current) return;

    class TypeRacerScene extends Phaser.Scene {
      private wordObjects: Phaser.GameObjects.Text[] = [];
      private wordTweens: Phaser.Tweens.Tween[] = [];
      private scoreText!: Phaser.GameObjects.Text;
      private livesText!: Phaser.GameObjects.Text;
      private inputText!: Phaser.GameObjects.Text;
      private wordSpawnTimer!: Phaser.Time.TimerEvent;
      private internalScore: number = 0;
      private internalLives: number = 3;
      private internalCurrentInput: string = '';
      private spawnDelay: number = 2000;
      public resetGame: (() => void) | undefined;
      private gameOverText?: Phaser.GameObjects.Text;
      private finalScoreText?: Phaser.GameObjects.Text;

      constructor() {
        super('TypeRacerScene');
      }

      create() {
        // Set background
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e).setOrigin(0, 0);

        // Initialize internal state
        this.internalScore = 0;
        this.internalLives = 3;
        this.internalCurrentInput = '';
        setScore(0);
        setLives(3);
        setCurrentInput('');
        setGameOver(false);
        setIsPlaying(true);

        // Create UI
        this.scoreText = this.add.text(20, 20, `Score: 0`, {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        });

        this.livesText = this.add.text(GAME_WIDTH - 150, 20, `Lives: 3`, {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 }
        });

        this.inputText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 50, 'Type here: ', {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 15, y: 8 }
        }).setOrigin(0.5);

        // Start spawning words
        this.wordSpawnTimer = this.time.addEvent({
          delay: 2000,
          callback: this.spawnWord,
          callbackScope: this,
          loop: true
        });

        // Set up input handler
        this.input.keyboard?.on('keydown', this.handleKeyDown, this);

        // Focus the game for keyboard input
        this.input.keyboard?.enableGlobalCapture();

        // Define reset method
        this.resetGame = () => {
          // Clear existing words
          this.wordObjects.forEach(word => word.destroy());
          this.wordObjects = [];
          // Stop and clear all tweens
          this.wordTweens.forEach(tw => tw.stop());
          this.wordTweens = [];
          
          // Remove Game Over and Final Score texts if they exist
          if (this.gameOverText) { 
            this.gameOverText.destroy(); 
            this.gameOverText = undefined; 
          }
          if (this.finalScoreText) { 
            this.finalScoreText.destroy(); 
            this.finalScoreText = undefined; 
          }
          
          // Reset internal state
          this.internalScore = 0;
          this.internalLives = 3;
          this.internalCurrentInput = '';
          
          // Update React state
          setScore(0);
          setLives(3);
          setCurrentInput('');
          setGameOver(false);
          setIsPlaying(true);
          
          // Update UI
          this.scoreText.setText('Score: 0');
          this.livesText.setText('Lives: 3');
          this.inputText.setText('Type here: ');
          
          // Restart word spawning
          if (this.wordSpawnTimer) this.wordSpawnTimer.remove();
          this.wordSpawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnWord,
            callbackScope: this,
            loop: true
          });
          
          // Re-enable keyboard input
          this.input.keyboard?.enableGlobalCapture();
        };
      }

      spawnWord = () => {
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        const x = Math.random() * (GAME_WIDTH - 200) + 100;
        const y = -50;
        const speed = 0.5 + Math.random() * 1;

        const wordText = this.add.text(x, y, word, {
          fontSize: '24px',
          color: '#ffffff',
          backgroundColor: '#333333',
          padding: { x: 10, y: 5 }
        });

        this.wordObjects.push(wordText);

        // Animate word falling
        const tween = this.tweens.add({
          targets: wordText,
          y: GAME_HEIGHT + 50,
          duration: 10000 / speed,
          ease: 'Linear',
          onComplete: () => {
            // Only decrement lives if word still exists (wasn't typed)
            if (this.wordObjects.includes(wordText)) {
              wordText.destroy();
              this.wordObjects = this.wordObjects.filter(obj => obj !== wordText);
              this.wordTweens = this.wordTweens.filter(tw => tw !== tween);
              this.internalLives -= 1;
              setLives(this.internalLives);
              this.livesText.setText(`Lives: ${this.internalLives}`);
              if (this.internalLives <= 0) {
                this.endGame();
              }
            }
          }
        });
        this.wordTweens.push(tween);

        // Gradually increase difficulty by spawning faster words
        if (this.internalScore > 50) {
          const fasterSpeed = speed + 0.5;
          wordText.setData('speed', fasterSpeed);
        }
      }

      handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          // Check if typed word matches any falling word
          const typedWord = this.internalCurrentInput.trim().toLowerCase();
          const matchingWord = this.wordObjects.find(wordObj => 
            wordObj.text.toLowerCase() === typedWord
          );

          if (matchingWord) {
            // Word matched - score points
            this.internalScore += 10;
            setScore(this.internalScore);
            this.scoreText.setText(`Score: ${this.internalScore}`);
            
            // Stop and remove the tween for this word
            const tweenIndex = this.wordObjects.indexOf(matchingWord);
            if (tweenIndex !== -1 && this.wordTweens[tweenIndex]) {
              this.wordTweens[tweenIndex].stop();
              this.wordTweens.splice(tweenIndex, 1);
            }
            // Visual feedback
            this.tweens.add({
              targets: matchingWord,
              scaleX: 1.2,
              scaleY: 1.2,
              duration: 200,
              yoyo: true,
              onComplete: () => {
                matchingWord.destroy();
                this.wordObjects = this.wordObjects.filter(obj => obj !== matchingWord);
              }
            });
          } else if (typedWord.length > 0) {
            // Wrong word - visual feedback
            this.tweens.add({
              targets: this.inputText,
              x: this.inputText.x + 10,
              duration: 100,
              yoyo: true,
              ease: 'Sine.easeInOut'
            });
          }
          
          this.internalCurrentInput = '';
          setCurrentInput('');
          this.inputText.setText('Type here: ');
        } else if (event.key === 'Backspace') {
          this.internalCurrentInput = this.internalCurrentInput.slice(0, -1);
          setCurrentInput(this.internalCurrentInput);
          this.inputText.setText(`Type here: ${this.internalCurrentInput}`);
        } else if (event.key.length === 1 && event.key.match(/[a-zA-Z\s]/)) {
          // Only allow letters and spaces
          this.internalCurrentInput += event.key;
          setCurrentInput(this.internalCurrentInput);
          this.inputText.setText(`Type here: ${this.internalCurrentInput}`);
        }
      }

      endGame = () => {
        // Stop word spawning
        if (this.wordSpawnTimer) {
          this.wordSpawnTimer.remove();
        }
        
        // Clear all falling words
        this.wordObjects.forEach(word => word.destroy());
        this.wordObjects = [];
        
        // Stop and clear all tweens
        this.wordTweens.forEach(tw => tw.stop());
        this.wordTweens = [];
        
        setGameOver(true);
        setIsPlaying(false);
        
        if (this.internalScore > highScore) {
          setHighScore(this.internalScore);
        }

        // Show game over text
        this.gameOverText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Game Over!', {
          fontSize: '64px',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.finalScoreText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, `Final Score: ${this.internalScore}`, {
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
      backgroundColor: '#1a1a2e',
      scene: TypeRacerScene,
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
    // Reset React state first
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsPlaying(true);
    setCurrentInput('');
    
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.keys['TypeRacerScene'] as any;
      if (scene && typeof scene.resetGame === 'function') {
        scene.resetGame();
        return;
      }
    }
    
    // If reset failed, recreate the game
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
            ⌨️ Type Racer ⌨️
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            margin: '0 0 20px 0'
          }}>
            Type the falling words before they reach the bottom!
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
            background: '#ffeaea',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', color: '#e74c3c', fontWeight: 'bold' }}>
              Lives
            </div>
            <div style={{ fontSize: '36px', color: '#333', fontWeight: 'bold' }}>
              {'❤️'.repeat(Math.max(lives, 0))}
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
          background: '#1a1a2e',
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
            <li>Words will fall from the top of the screen</li>
            <li>Type the word exactly as it appears</li>
            <li>Press Enter to submit your typed word</li>
            <li>Score points for each word you type correctly</li>
            <li>Lose a life if a word reaches the bottom</li>
            <li>You have 3 lives - use them wisely!</li>
          </ul>
        </div>

        {/* Typing Tips */}
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
            💡 Typing Tips:
          </h3>
          <ul style={{ 
            fontSize: '16px', 
            color: '#856404',
            margin: '0',
            paddingLeft: '20px'
          }}>
            <li>Focus on accuracy over speed at first</li>
            <li>Use all your fingers for better typing</li>
            <li>Don't look at the keyboard - practice touch typing</li>
            <li>Start with slower words and build up speed</li>
            <li>Take breaks to avoid fatigue</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TypeRacer;