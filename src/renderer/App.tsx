/* eslint-disable no-undef */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

interface CurvesProps {
  inputValue: number;
  frequency: number; // for the curve to be more compact
  randomness: number;
}
const Curves = ({ inputValue, frequency, randomness }: CurvesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // const [waveData, setWaveData] = useState<number[]>([]);
  // const [animationFrameId, setAnimationFrameId] = useState<number | null>(null);
  const waveDataRef = useRef<number[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = width; // Ensure waveDataRef length never exceeds canvas width
    const amplitude = inputValue * 5;

    // Initialize wave data if it's empty
    if (waveDataRef.current.length === 0) {
      waveDataRef.current = Array(bufferLength).fill(height / 2);
    }

    const draw = () => {
      // Shift the wave data to the left and append the new value
      const randomOffset = (Math.random() - 0.5) * 2 * randomness;
      const newY =
        height / 2 +
        Math.sin((Date.now() / 100) * frequency * 2) *
          (amplitude + randomOffset);
      waveDataRef.current.push(newY);
      if (waveDataRef.current.length > bufferLength) {
        waveDataRef.current.shift();
      }

      // Clear the canvas
      ctx.clearRect(0, 0, width, height);

      // Draw the wave
      ctx.beginPath();
      ctx.moveTo(0, waveDataRef.current[0]);

      for (let i = 1; i < waveDataRef.current.length; i++) {
        ctx.lineTo(i, waveDataRef.current[i]);
      }

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [inputValue, frequency, randomness]);
  return (
    <div>
      <canvas ref={canvasRef} width="500" height="100" />
    </div>
  );
};

const Curves2 = ({ inputValue, frequency, randomness }: CurvesProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const waveDataRef = useRef<number[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 500;
    const height = 100;
    const bufferLength = width;
    const amplitude = inputValue * 5;

    if (waveDataRef.current.length === 0) {
      waveDataRef.current = Array(bufferLength).fill(height / 2);
    }

    const draw = () => {
      const randomOffset = (Math.random() - 0.5) * 2 * randomness;
      const newY =
        height / 2 +
        Math.sin((Date.now() / 100) * frequency * 2) *
          (amplitude + randomOffset);
      waveDataRef.current.push(newY);
      if (waveDataRef.current.length > bufferLength) {
        waveDataRef.current.shift();
      }

      svg.selectAll('*').remove();

      const line = d3
        .line<number>()
        .x((_, i) => i)
        .y((d) => d)
        .curve(d3.curveBasis);

      svg
        .append('path')
        .datum(waveDataRef.current)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .attr('d', line as any);

      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [inputValue, frequency, randomness]);

  return <svg ref={svgRef} width="500" height="100" />;
};

interface SliderProps {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Slider = ({ value, onChange }: SliderProps) => {
  return (
    <input type="range" min={0} max={10} value={value} onChange={onChange} />
  );
};

export default function App() {
  const [value, setValue] = useState(5);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(event.currentTarget.value, 10));
  };
  return (
    <div style={{ backgroundColor: 'black' }}>
      <Curves inputValue={value} frequency={5} randomness={10} />
      {/* <Curves2 inputValue={value} frequency={5} randomness={10} /> */}
      <Slider value={value} onChange={handleChange} />
      {value}
    </div>
  );
}
