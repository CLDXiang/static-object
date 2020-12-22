import { useEffect, useRef, useState, useCallback } from 'react';
import './App.scss';
import { Canvas } from './components';
import { CANVAS } from './utils/config';

const { HEIGHT, WIDTH } = CANVAS;

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameFlag = useRef<number>(-1);

  /** 绘制 */
  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    animationFrameFlag.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameFlag.current);
    };
  }, []);

  return (
    <div className="App">
      <Canvas ref={canvasRef} />
    </div>
  );
}

export default App;
