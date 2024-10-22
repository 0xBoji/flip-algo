import React, { useState, useEffect, useRef } from 'react';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const PIPE_SPEED = 2;

function FlappyBird() {
  const canvasRef = useRef(null);
  const [birdPosition, setBirdPosition] = useState(CANVAS_HEIGHT / 2);
  const [gameStarted, setGameStarted] = useState(false);
  const [pipeHeight, setPipeHeight] = useState(0);
  const [pipeX, setPipeX] = useState(CANVAS_WIDTH);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const bird = {
      y: birdPosition,
      velocity: 0,
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw background
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw bird
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(50, bird.y, BIRD_WIDTH / 2, 0, 2 * Math.PI);
      ctx.fill();

      if (gameStarted && !gameOver) {
        // Update bird position
        bird.velocity += GRAVITY;
        bird.y += bird.velocity;

        // Draw pipes
        ctx.fillStyle = '#228B22';
        ctx.fillRect(pipeX, 0, PIPE_WIDTH, pipeHeight);
        ctx.fillRect(pipeX, pipeHeight + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - pipeHeight - PIPE_GAP);

        // Move pipes
        setPipeX(prevPipeX => {
          if (prevPipeX <= -PIPE_WIDTH) {
            setPipeHeight(Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50);
            setScore(prevScore => prevScore + 1);
            return CANVAS_WIDTH;
          }
          return prevPipeX - PIPE_SPEED;
        });

        // Check collision
        if (
          bird.y - BIRD_WIDTH / 2 <= 0 ||
          bird.y + BIRD_WIDTH / 2 >= CANVAS_HEIGHT ||
          (pipeX < 50 + BIRD_WIDTH / 2 &&
            pipeX + PIPE_WIDTH > 50 - BIRD_WIDTH / 2 &&
            (bird.y - BIRD_WIDTH / 2 < pipeHeight || bird.y + BIRD_WIDTH / 2 > pipeHeight + PIPE_GAP))
        ) {
          setGameOver(true);
          setGameStarted(false);
          setHighScore(prevHighScore => Math.max(prevHighScore, score));
        }
      }

      setBirdPosition(bird.y);
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, birdPosition, pipeHeight, pipeX, score, gameOver]);

  const handleClick = () => {
    if (gameOver) {
      setGameOver(false);
      setBirdPosition(CANVAS_HEIGHT / 2);
      setPipeX(CANVAS_WIDTH);
      setScore(0);
    }
    if (!gameStarted) {
      setGameStarted(true);
    }
    setBirdPosition(prevPosition => prevPosition);
    // Apply jump velocity
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.canvas.dispatchEvent(new Event('jump'));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const handleJump = () => {
      const ctx = canvas.getContext('2d');
      const bird = {
        y: birdPosition,
        velocity: JUMP_STRENGTH,
      };
      ctx.canvas.dispatchEvent(new CustomEvent('updateBird', { detail: bird }));
    };
    canvas.addEventListener('jump', handleJump);
    return () => {
      canvas.removeEventListener('jump', handleJump);
    };
  }, [birdPosition]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Flappy Bird Game</h1>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleClick}
        style={{ border: '1px solid black' }}
      />
      <p>Score: {score}</p>
      <p>High Score: {highScore}</p>
      {!gameStarted && !gameOver && <p>Click to start and jump!</p>}
      {gameOver && <p>Game Over! Click to restart.</p>}
    </div>
  );
}

export default FlappyBird;