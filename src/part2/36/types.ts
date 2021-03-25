export type AsyncDispatch<A> = (action: A) => Promise<void>;

export type Coordinate = { x: number; y: number };
export type DirectionsType = "left" | "right" | "up" | "down";

// props inherited from board
export interface ChessInheritedProps {
    // lazy load for ref assignment comes after field initialization
    boardCtx: () => CanvasRenderingContext2D;
    unitLength: () => number;
    drawBoard: () => void;
    wallBuildColor: string;
    wall: WallTable;
    wallDispatch: React.Dispatch<WallReducerAction>;

    gridCount: number;
}

export interface ChessProps {
    mainColor?: string;
    frontColor?: string;
    rotationSpeed?: number;
    moveSpeed?: number;
    wallBuildTime?: number;
    wallBrushTime?: number;
    cmdQueue: ChessCmdQueue;
    setCmdQueue: React.Dispatch<React.SetStateAction<ChessCmdQueue>>;
    initialFrontDirection?: DirectionsType;
    initialCoordinate?: Coordinate;
}

export interface ChessState {
    frontDirection: DirectionsType;
    coordinate: Coordinate;
}

export interface ChessPack extends Required<ChessProps> {
    state: ChessState;
    dispatch: React.Dispatch<ReducerActionType>;
    drawChess: (state: ChessState, rotationAngle: number) => void;
    frontBorderLength: () => number;
    initialState: React.MutableRefObject<ChessState>;
    animPromiseRef: React.MutableRefObject<Promise<void>>;
}

export type ChessCmdQueue = Array<ReducerActionType>;

export type ReducerActionType =
    | {
          action: "go";
          step?: number;
      }
    | {
          action: "rotateTo";
          direction: DirectionsType;
          counterClockWise?: boolean;
      }
    | {
          action: "rotateBy";
          angle: number;
      }
    | {
          action: "move";
          direction: DirectionsType;
          step?: number;
      }
    | {
          action: "moveTo";
          target: Coordinate;
      }
    | {
          action: "build";
      }
    | {
          action: "brush";
          color: string;
      };

export interface BoardProps extends React.ComponentPropsWithRef<"canvas"> {
    randomWallCounter: number;
    setRandomWallCounter: React.Dispatch<React.SetStateAction<number>>;
    gridCount?: number;
    meshColor?: string;
    perimeterColor?: string;
    numberColor?: string;
    chessProps: ChessProps;
}

export interface WallReducerAction {
    pos: Coordinate;
    color: string;
}

export type WallTable = string[][];
