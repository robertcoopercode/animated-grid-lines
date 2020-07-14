import React, { useRef, useEffect, HTMLAttributes, FC } from 'react';
import { GridRenderer } from './GridRenderer';

export type StorybookProps = {
  /** Colors used for the lines. */
  colors?: string[];
  /** Speed at which the lines moves. */
  speed?: number;
  /** The size of the grid squares. */
  squareSize?: number;
  /** The max length a line can reach. */
  maxLineLength?: number;
  /** The width of the lines.  */
  lineWidth?: number;
  /** Color of the grid lines. */
  gridColor?: string;
};

export const StorybookComponent: FC<StorybookProps> = () => null;

type Props = StorybookProps & HTMLAttributes<HTMLCanvasElement>;

export const Grid: FC<Props> = ({
  colors = [
    '#7400b8',
    '#6930c3',
    '#5e60ce',
    '#5390d9',
    '#4ea8de',
    '#48bfe3',
    '#56cfe1',
    '#64dfdf',
    '#72efdd',
    '#80ffdb',
  ],
  speed = 20,
  squareSize = 24,
  maxLineLength = 100,
  lineWidth = 4,
  gridColor = 'rgba(191, 194, 198, 0.3)',
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<GridRenderer>();

  useEffect((): (() => void) | void => {
    if (canvasRef.current !== null) {
      canvas.current = new GridRenderer({
        canvas: canvasRef.current,
        colors,
        speed,
        squareSize,
        maxLineLength,
        lineWidth,
        gridColor,
      });
      canvas.current.register();

      return () => {
        if (canvas.current !== undefined) {
          canvas.current.unregister();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (canvas.current !== undefined) {
      canvas.current.setConfig({
        colors,
        speed,
        squareSize,
        maxLineLength,
        lineWidth,
        gridColor,
      });
    }
  }, [colors, speed, squareSize, maxLineLength, lineWidth, gridColor]);

  return <canvas ref={canvasRef} {...rest}></canvas>;
};
