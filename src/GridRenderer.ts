import { throttle } from './throttle';

type Direction = 'up' | 'down' | 'left' | 'right';
type Line = {
  initialDirection: Direction;
  currentDirection: Direction;
  currentColor: string;
  coordinates: [number, number][];
};
type Config = {
  colors: string[];
  speed: number;
  squareSize: number;
  maxLineLength: number;
  lineWidth: number;
  gridColor: string;
};

const allowedDirections: { [key in Direction]: Direction[] } = {
  up: ['up', 'left', 'right'],
  down: ['down', 'left', 'right'],
  left: ['left', 'up', 'down'],
  right: ['right', 'up', 'down'],
};

export class GridRenderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  pixelRatio: number;
  speed = 30;
  squareSize = 24;
  lines: Line[] = [];
  maxLineLength = 100;
  lineColors: string[] = [];
  lineWidth = 5;
  gridColor = 'rgba(191, 194, 198, 0.3)';
  registeredCallback: ((e: MouseEvent) => void) | undefined;

  constructor({ canvas, ...config }: Config & { canvas: HTMLCanvasElement }) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.pixelRatio = window.devicePixelRatio || 1;
    this.setConfig(config);
  }

  setConfig({
    colors,
    speed,
    squareSize,
    maxLineLength,
    lineWidth,
    gridColor,
  }: Config): void {
    this.speed = speed;
    this.squareSize = squareSize;
    this.maxLineLength = maxLineLength;
    this.lineColors = colors;
    this.lineWidth = lineWidth;
    this.gridColor = gridColor;
    this.canvas.style.height = '100%';
    this.canvas.style.width = '100%';
  }

  pickDirection(
    availableDirections: Direction[] = ['down', 'left', 'right', 'up']
  ): Direction {
    return availableDirections[
      Math.floor(Math.random() * availableDirections.length)
    ];
  }

  pickLineColor(): string {
    return this.lineColors[Math.floor(Math.random() * this.lineColors.length)];
  }

  getSquareLength(): number {
    return this.squareSize * this.pixelRatio;
  }

  getClosestIntersectionCoordinates(event: MouseEvent): [number, number] {
    const squareLength = this.getSquareLength();
    const x =
      Math.round(event.offsetX / squareLength) * squareLength * this.pixelRatio;
    const y =
      Math.round(event.offsetY / squareLength) * squareLength * this.pixelRatio;
    return [x, y];
  }

  limitLineLength(line: Line): void {
    function calculateSum(): number {
      return line.coordinates.reduce((acc, [x2, y2], index, arr) => {
        if (index === 0) {
          return acc;
        }
        const [x1, y1] = arr[index - 1];
        if (x1 === x2) {
          acc += Math.abs(y1 - y2);
        } else if (y1 === y2) {
          acc += Math.abs(x1 - x2);
        }
        return acc;
      }, 0);
    }
    while (calculateSum() > this.maxLineLength * this.pixelRatio) {
      line.coordinates.shift();
    }
  }
  getNewCoordinates(line: Line, step: number = this.speed): void {
    const { coordinates, currentDirection, initialDirection } = line;
    const mostRecentCoordinate = coordinates[coordinates.length - 1];
    const squareLength = this.getSquareLength();
    let nextNodePosition: number;
    let lineDistancePastNextNodePosition: number;
    let nextLinePosition;

    const handleLineIntersectingNode = (
      currentDirection: Direction,
      oppositeDirection: Direction
    ) => {
      if (['up', 'down'].some((d) => d === currentDirection)) {
        coordinates.push([mostRecentCoordinate[0], nextNodePosition]);
      } else {
        coordinates.push([nextNodePosition, mostRecentCoordinate[1]]);
      }
      line.currentDirection = this.pickDirection(
        allowedDirections[initialDirection].filter(
          (d) => d !== oppositeDirection
        )
      );
      return this.getNewCoordinates(line, lineDistancePastNextNodePosition);
    };

    switch (currentDirection) {
      case 'up':
        nextNodePosition =
          (Math.ceil(mostRecentCoordinate[1] / squareLength) - 1) *
          squareLength;
        nextLinePosition = mostRecentCoordinate[1] - step;
        lineDistancePastNextNodePosition = nextNodePosition - nextLinePosition;
        if (lineDistancePastNextNodePosition > 0) {
          handleLineIntersectingNode('up', 'down');
          return;
        }
        coordinates.push([mostRecentCoordinate[0], nextLinePosition]);
        return;
      case 'down':
        nextNodePosition =
          (Math.floor(mostRecentCoordinate[1] / squareLength) + 1) *
          squareLength;
        nextLinePosition = mostRecentCoordinate[1] + step;
        lineDistancePastNextNodePosition = nextLinePosition - nextNodePosition;
        if (lineDistancePastNextNodePosition > 0) {
          handleLineIntersectingNode('down', 'up');
          return;
        }
        coordinates.push([mostRecentCoordinate[0], nextLinePosition]);
        return;
      case 'left':
        nextNodePosition =
          (Math.ceil(mostRecentCoordinate[0] / squareLength) - 1) *
          squareLength;
        nextLinePosition = mostRecentCoordinate[0] - step;
        lineDistancePastNextNodePosition = nextNodePosition - nextLinePosition;
        if (lineDistancePastNextNodePosition > 0) {
          handleLineIntersectingNode('left', 'right');
          return;
        }
        coordinates.push([nextLinePosition, mostRecentCoordinate[1]]);
        return;
      case 'right':
        nextNodePosition =
          (Math.floor(mostRecentCoordinate[0] / squareLength) + 1) *
          squareLength;
        nextLinePosition = mostRecentCoordinate[0] + step;
        lineDistancePastNextNodePosition = nextLinePosition - nextNodePosition;
        if (lineDistancePastNextNodePosition > 0) {
          handleLineIntersectingNode('right', 'left');
          return;
        }
        coordinates.push([nextLinePosition, mostRecentCoordinate[1]]);
        return;
    }
  }

  shootLine(): void {
    for (const [line, index] of this.lines.map<[Line, number]>(
      (line, index) => [line, index]
    )) {
      const { coordinates: lineCoords, currentColor: lineCurrentColor } = line;

      this.context.beginPath();
      this.context.moveTo(lineCoords[0][0], lineCoords[0][1]);
      for (const coord of lineCoords) {
        this.context.lineTo(coord[0], coord[1]);
      }
      this.getNewCoordinates(line);
      this.limitLineLength(line);

      this.context.lineWidth = this.lineWidth * this.pixelRatio;
      this.context.strokeStyle = lineCurrentColor;
      this.context.stroke();

      // Check if end of canvas has been reached
      const lastCoord = lineCoords[lineCoords.length - 1];
      const xPos = lastCoord[0];
      const yPos = lastCoord[1];
      // Factor in the max line length so that the line doesn't disappear when
      // it hits any edge of the canvas. Basically, we artificially extend the
      // canvas so that the line can continue to be drawn until it is completely
      // off the visible canvas.
      if (
        xPos >= this.canvas.width + this.maxLineLength ||
        xPos <= -this.maxLineLength ||
        yPos >= this.canvas.height + this.maxLineLength ||
        yPos <= -this.maxLineLength
      ) {
        this.lines.splice(index, 1);
      }
    }
  }

  draw(): void {
    this.canvas.width = this.canvas.offsetWidth * this.pixelRatio;
    this.canvas.height = this.canvas.offsetHeight * this.pixelRatio;
    const squareLength = this.getSquareLength();
    const numColumns = Math.round(this.canvas.width / squareLength);
    const numRows = Math.round(this.canvas.height / squareLength);

    // Makes sure the canvas is clean at the beginning of a frame
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let col = 0; col <= numColumns; col += 1) {
      this.context.moveTo(col * squareLength, 0);
      this.context.lineTo(col * squareLength, this.canvas.width);
    }

    for (let row = 0; row <= numRows; row += 1) {
      this.context.moveTo(0, row * squareLength);
      this.context.lineTo(this.canvas.width, row * squareLength);
    }

    this.context.strokeStyle = this.gridColor;
    this.context.lineWidth = 2;
    this.context.stroke();

    if (Object.keys(this.lines).length !== 0) {
      this.shootLine();
    }
    window.requestAnimationFrame(this.draw.bind(this));
  }

  onMouseOver(event: MouseEvent): void {
    const [x, y] = this.getClosestIntersectionCoordinates(event);
    const direction = this.pickDirection();
    this.lines.push({
      coordinates: [[x, y]],
      currentColor: this.pickLineColor(),
      initialDirection: direction,
      currentDirection: direction,
    });
  }

  register(): void {
    this.registeredCallback = throttle(this.onMouseOver.bind(this), 20);
    this.canvas.addEventListener('mousemove', this.registeredCallback);
    this.draw();
  }

  unregister(): void {
    if (this.registeredCallback !== undefined) {
      this.canvas.removeEventListener('mousemove', this.registeredCallback);
      this.registeredCallback = undefined;
    }
  }
}
