import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

const WordleClone: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [stats, setStats] = useState({ gamesPlayed: 0, gamesWon: 0, currentStreak: 0, maxStreak: 0 });
  const [resetFlag, setResetFlag] = useState(false); // for triggering reset

  const wordList = [
    'APPLE', 'BEACH', 'CHAIR', 'DREAM', 'EARTH', 'FLAME', 'GRAPE', 'HEART',
    'IMAGE', 'JUICE', 'KNIFE', 'LEMON', 'MUSIC', 'NIGHT', 'OCEAN', 'PEACE',
    'QUEEN', 'RADIO', 'SMILE', 'TABLE', 'UNITY', 'VOICE', 'WATER', 'YOUTH',
    'ZEBRA', 'ALPHA', 'BRAVE', 'CLOUD', 'DANCE', 'EAGLE', 'FAITH', 'GLORY'
  ];

  useEffect(() => {
    if (phaserGameRef.current) return;

    class WordleScene extends Phaser.Scene {
      private guessGrid: { cell: Phaser.GameObjects.Rectangle, text: Phaser.GameObjects.Text }[][] = [];
      private keyboard: Phaser.GameObjects.Text[] = [];
      private messageText!: Phaser.GameObjects.Text;
      private guesses: string[] = [];
      private currentGuess: string = '';
      private targetWord: string = '';
      private gameWon: boolean = false;
      private gameLost: boolean = false;
      public resetGame: (() => void) | undefined;

      constructor() {
        super('WordleScene');
      }

      create() {
        // Set background
        this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xffffff).setOrigin(0, 0);

        // Create title
        this.add.text(GAME_WIDTH / 2, 30, 'WORDLE', {
          fontSize: '48px',
          color: '#000000',
          fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create guess grid
        this.createGuessGrid();

        // Create keyboard
        this.createKeyboard();

        // Create message area
        this.messageText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 100, '', {
          fontSize: '24px',
          color: '#000000',
          backgroundColor: '#ffffff',
          padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        // Set up input handler
        this.input.keyboard?.on('keydown', this.handleKeyDown, this);

        // Initialize state
        this.guesses = [];
        this.currentGuess = '';
        this.targetWord = wordList[Math.floor(Math.random() * wordList.length)];
        this.gameWon = false;
        this.gameLost = false;

        // Define reset method
        this.resetGame = () => {
          // Clear grid
          for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 5; col++) {
              this.guessGrid[row][col].text.setText('');
              this.guessGrid[row][col].cell.setFillStyle(0xffffff);
              this.guessGrid[row][col].text.setColor('#000000');
            }
          }
          // Clear keyboard highlights
          this.keyboard.forEach(keyText => keyText.setColor('#000000'));
          // Reset state
          this.guesses = [];
          this.currentGuess = '';
          this.targetWord = wordList[Math.floor(Math.random() * wordList.length)];
          this.gameWon = false;
          this.gameLost = false;
          this.messageText.setText('');
        };
      }

      createGuessGrid() {
        const gridStartX = (GAME_WIDTH - 250) / 2;
        const gridStartY = 100;
        const cellSize = 50;
        const cellSpacing = 5;

        for (let row = 0; row < 6; row++) {
          this.guessGrid[row] = [];
          for (let col = 0; col < 5; col++) {
            const x = gridStartX + col * (cellSize + cellSpacing);
            const y = gridStartY + row * (cellSize + cellSpacing);
            
            const cell = this.add.rectangle(x + cellSize / 2, y + cellSize / 2, cellSize, cellSize, 0xffffff);
            cell.setStrokeStyle(2, 0xcccccc);
            
            const text = this.add.text(x + cellSize / 2, y + cellSize / 2, '', {
              fontSize: '24px',
              color: '#000000',
          fontStyle: 'bold'
            }).setOrigin(0.5);
            
            this.guessGrid[row][col] = { cell, text };
          }
        }
      }

      createKeyboard() {
        const keyboardLayout = [
          ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
          ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
          ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
        ];

        const keySize = 48;
        const keySpacing = 8;
        const startY = GAME_HEIGHT - 200;

        keyboardLayout.forEach((row, rowIndex) => {
          // Calculate row width using actual key widths
          const rowWidths = row.map(key => (key === 'ENTER' || key === 'BACKSPACE') ? keySize * 1.5 : keySize);
          const rowWidth = rowWidths.reduce((acc, w) => acc + w, 0) + keySpacing * (row.length - 1);
          const startX = (GAME_WIDTH - rowWidth) / 2;

          let xCursor = startX;
          row.forEach((key, colIndex) => {
            const keyWidth = (key === 'ENTER' || key === 'BACKSPACE') ? keySize * 1.5 : keySize;
            const x = xCursor;
            const y = startY + rowIndex * (keySize + keySpacing);

            let rectColor = 0xcccccc;
            let rectStroke = 0x888888;
            const keyRect = this.add.rectangle(x + keyWidth / 2, y + keySize / 2, keyWidth, keySize, rectColor);
            keyRect.setStrokeStyle(2, rectStroke);
            keyRect.setInteractive();
            keyRect.on('pointerdown', () => this.handleKeyClick(key));

            const keyText = this.add.text(x + keyWidth / 2, y + keySize / 2, key, {
              fontSize: '18px',
              color: '#000000',
              fontStyle: 'bold'
            }).setOrigin(0.5);
            keyText.setDepth(1); // Ensure text is above the rectangle
            keyText.setColor('#000000'); // Explicitly set color
            console.log('Creating key:', key, 'at', x + keyWidth / 2, y + keySize / 2, 'text:', keyText.text);
            this.keyboard.push(keyText);
            xCursor += keyWidth + keySpacing;
          });
        });
      }

      handleKeyClick(key: string) {
        this.handleKeyPress(key);
      }

      handleKeyDown(event: KeyboardEvent) {
        this.handleKeyPress(event.key.toUpperCase());
      }

      handleKeyPress(key: string) {
        if (this.gameWon || this.gameLost) return;

        if (key === 'ENTER') {
          this.submitGuess();
        } else if (key === 'BACKSPACE') {
          this.currentGuess = this.currentGuess.slice(0, -1);
          this.updateCurrentGuessDisplay();
        } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
          if (this.currentGuess.length < 5) {
            this.currentGuess += key;
            this.updateCurrentGuessDisplay();
          }
        }
      }

      updateCurrentGuessDisplay() {
        // Show current guess in the next empty row
        const row = this.guesses.length;
        for (let col = 0; col < 5; col++) {
          const letter = this.currentGuess[col] || '';
          this.guessGrid[row][col].text.setText(letter);
        }
      }

      submitGuess() {
        if (this.currentGuess.length !== 5) {
          this.messageText.setText('Word must be 5 letters!');
          return;
        }

        if (!wordList.includes(this.currentGuess)) {
          this.messageText.setText('Not in word list!');
          return;
        }

        this.guesses.push(this.currentGuess);
        this.updateGridDisplay();

        if (this.currentGuess === this.targetWord) {
          this.gameWon = true;
          this.messageText.setText('Congratulations! You won!');
          this.updateStats(true);
        } else if (this.guesses.length >= 6) {
          this.gameLost = true;
          this.messageText.setText(`Game Over! The word was ${this.targetWord}`);
          this.updateStats(false);
        } else {
          this.messageText.setText('');
        }
        this.currentGuess = '';
      }

      updateGridDisplay() {
        this.guesses.forEach((guess, rowIndex) => {
          guess.split('').forEach((letter, colIndex) => {
            const { cell, text } = this.guessGrid[rowIndex][colIndex];
            text.setText(letter);
            // Color the cell based on correctness
            if (letter === this.targetWord[colIndex]) {
              cell.setFillStyle(0x6aaa64); // Green
              text.setColor('#ffffff');
            } else if (this.targetWord.includes(letter)) {
              cell.setFillStyle(0xc9b458); // Yellow
              text.setColor('#ffffff');
            } else {
              cell.setFillStyle(0x787c7e); // Gray
              text.setColor('#ffffff');
            }
          });
        });
      }

      updateStats(won: boolean) {
        setStats(prev => {
          const gamesPlayed = prev.gamesPlayed + 1;
          const gamesWon = won ? prev.gamesWon + 1 : prev.gamesWon;
          const currentStreak = won ? prev.currentStreak + 1 : 0;
          const maxStreak = Math.max(prev.maxStreak, currentStreak);
          return { gamesPlayed, gamesWon, currentStreak, maxStreak };
        });
      }
    }

    phaserGameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: gameRef.current!,
      backgroundColor: '#ffffff',
      scene: WordleScene,
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
  }, [resetFlag]);

  const startGame = () => {
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.keys['WordleScene'] as any;
      if (scene && typeof scene.resetGame === 'function') {
        scene.resetGame();
        return;
      }
    }
    setResetFlag(flag => !flag); // force remount
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
            🧩 Wordle Clone 🧩
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            margin: '0 0 20px 0'
          }}>
            Guess the 5-letter word in 6 tries!
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: '#e8f5e8',
            borderRadius: '10px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', color: '#2ecc71', fontWeight: 'bold' }}>
              Games Played
            </div>
            <div style={{ fontSize: '24px', color: '#333', fontWeight: 'bold' }}>
              {stats.gamesPlayed}
            </div>
          </div>
          
          <div style={{
            background: '#fff3cd',
            borderRadius: '10px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', color: '#ffc107', fontWeight: 'bold' }}>
              Win Rate
            </div>
            <div style={{ fontSize: '24px', color: '#333', fontWeight: 'bold' }}>
              {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
            </div>
          </div>
          
          <div style={{
            background: '#e3f2fd',
            borderRadius: '10px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', color: '#2196f3', fontWeight: 'bold' }}>
              Current Streak
            </div>
            <div style={{ fontSize: '24px', color: '#333', fontWeight: 'bold' }}>
              {stats.currentStreak}
            </div>
          </div>
          
          <div style={{
            background: '#f8f9fa',
            borderRadius: '10px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', color: '#6c757d', fontWeight: 'bold' }}>
              Max Streak
            </div>
            <div style={{ fontSize: '24px', color: '#333', fontWeight: 'bold' }}>
              {stats.maxStreak}
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div style={{
          border: '3px solid #fff',
          borderRadius: '10px',
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
          background: '#ffffff',
          marginBottom: '30px'
        }}>
          <div ref={gameRef} style={{ width: GAME_WIDTH, height: GAME_HEIGHT }} />
        </div>

        {/* Controls */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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
            <li>Guess the 5-letter word in 6 tries</li>
            <li>After each guess, the color of the tiles will change</li>
            <li>🟩 Green = Letter is in the correct spot</li>
            <li>🟨 Yellow = Letter is in the word but wrong spot</li>
            <li>⬛ Gray = Letter is not in the word</li>
            <li>Click the keyboard or use your physical keyboard</li>
          </ul>
        </div>

        {/* Wordle Tips */}
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
            💡 Wordle Tips:
          </h3>
          <ul style={{ 
            fontSize: '16px', 
            color: '#856404',
            margin: '0',
            paddingLeft: '20px'
          }}>
            <li>Start with words that contain common letters (E, A, R, T)</li>
            <li>Use your second guess to eliminate more letters</li>
            <li>Pay attention to letter frequency</li>
            <li>Don't forget that letters can repeat</li>
            <li>Practice makes perfect!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WordleClone;