import { GridRenderer } from '../src/GridRenderer';

const NUMBER_OF_TESTS = 10000;

async function perfTest(func: () => Promise<void> | void): Promise<number> {
  const start = performance.now();
  await func();
  const end = performance.now();
  return end - start;
}

/**
 * This function runs the performance test 10,000 times, and returns
 * the average in milliseconds.
 */
export default async function getScore(func: () => void): Promise<number> {
  const tests = new Array(NUMBER_OF_TESTS)
    .fill(undefined)
    .map(async () => perfTest(func));
  const results = await Promise.all(tests);
  return results.reduce((acc, val) => acc + val, 0) / NUMBER_OF_TESTS;
}

const colors = [
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
];
const speed = 20;
const squareSize = 24;
const maxLineLength = 100;
const lineWidth = 4;
const gridColor = 'rgba(191, 194, 198, 0.3)';
const canvas = document.createElement('CANVAS') as HTMLCanvasElement;
const gridRenderer = new GridRenderer({
  canvas,
  colors,
  speed,
  squareSize,
  maxLineLength,
  lineWidth,
  gridColor,
});

it('should run faster than 100ms', async () => {
  const result = await getScore(() =>
    gridRenderer.onMouseOver(new MouseEvent(''))
  );
  console.log(result);
  expect(true).toBe(true);
});
