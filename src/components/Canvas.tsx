import { forwardRef } from 'react';
import './Canvas.scss';

const Canvas = forwardRef<HTMLCanvasElement>((props, ref) => (
  <div className="canvas-container">
    <canvas
      ref={ref}
      style={{ height: '100%', width: '100%' }}
      {...props}
    >
      Your browser doesn't support canvas.
    </canvas>
  </div>
));

export default Canvas;
