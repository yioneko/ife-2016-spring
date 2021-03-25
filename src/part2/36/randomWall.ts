import React, { useCallback, useEffect } from "react";
import { emptyWall } from "./boardWall";
import { ChessState, WallReducerAction, WallTable } from "./types";
import { isCoordinateEqual } from "./utils";

export function useRandomWall(props: {
    randomWallCounter: number;
    setRandomWallCounter: React.Dispatch<React.SetStateAction<number>>;
    animPromiseRef: React.MutableRefObject<Promise<void>>;
    wall: WallTable;
    wallDispatch: React.Dispatch<WallReducerAction>;
    chessState: ChessState;
    wallBuildColor: string;
    iterateCount?: number;
    gridCount: number;
}): { randomWalls: () => void; iterateCount: number } {
    const {
        randomWallCounter,
        setRandomWallCounter,
        wall,
        wallDispatch,
        chessState,
        wallBuildColor,
        iterateCount = 20,
        gridCount,
    } = props;

    const randomPoint = useCallback(
        () => Math.ceil(Math.random() * gridCount),
        [gridCount]
    );

    const randomWalls = useCallback(() => {
        const totalIterateCount = iterateCount * randomWallCounter;
        setRandomWallCounter(0);
        for (let i = 0; i < totalIterateCount; ++i) {
            // animPromiseRef.current = animPromiseRef.current.then(async () => {
                const [randomX, randomY] = [randomPoint(), randomPoint()];
                const wallCoordinate = {
                    x: randomX,
                    y: randomY,
                };
                if (
                    !isCoordinateEqual(chessState.coordinate, wallCoordinate) &&
                    wall[randomX][randomY] === emptyWall
                ) {
                    wallDispatch({ pos: wallCoordinate, color: wallBuildColor })
                }
        }
    }, [chessState.coordinate, iterateCount, randomPoint, randomWallCounter, setRandomWallCounter, wall, wallBuildColor, wallDispatch]);

    useEffect(() => {
        randomWalls();
    }, [randomWalls])

    return {
        randomWalls,
        iterateCount,
    };
}
