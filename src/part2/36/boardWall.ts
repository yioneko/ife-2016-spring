import React, { useCallback, useMemo, useReducer } from "react";
import { WallReducerAction, WallTable } from "./types";
import { fillTowDimensionArray, validateColor } from "./utils";

export const emptyWall = "";

export function useBoardWall(props: {
    gridCount: number;
    wallBuildColor?: string;
    boardCtx: () => CanvasRenderingContext2D;
    unitLength: () => number;
}): {
    dispatch: React.Dispatch<WallReducerAction>;
    wall: WallTable;
    drawWall: () => void;
    wallBuildColor: string;
} {
    const {
        gridCount,
        boardCtx,
        unitLength,
        wallBuildColor: inputWallBuildColor,
    } = props;
    const wallBuildColor = useMemo(
        () =>
            inputWallBuildColor && validateColor(inputWallBuildColor)
                ? inputWallBuildColor
                : "#282C34",
        [inputWallBuildColor]
    );

    const wallReducer = useCallback(
        (prevState: WallTable, action: WallReducerAction) => {
            const {
                pos: { x, y },
                color,
            } = action;
            const newState = [...[...prevState]];
            if (validateColor(color)) newState[x][y] = color;
            return newState;
        },
        []
    );

    const [wall, dispatch] = useReducer(
        wallReducer,
        fillTowDimensionArray(emptyWall, [gridCount + 1, gridCount + 1])
    );

    const drawWall = useCallback(() => {
        const ctx = boardCtx();
        const unit = unitLength();

        ctx.save();
        for (let x = 1; x <= gridCount; x++) {
            for (let y = 1; y <= gridCount; y++) {
                const maybeWall = wall[x][y];
                if (maybeWall !== emptyWall) {
                    ctx.save();
                    ctx.translate((x - 1) * unit, (y - 1) * unit);
                    ctx.fillStyle = maybeWall;
                    ctx.fillRect(0, 0, unit, unit);
                    ctx.restore();
                }
            }
        }
        ctx.restore();
    }, [boardCtx, gridCount, unitLength, wall]);
    return {
        dispatch,
        wall,
        drawWall,
        wallBuildColor,
    };
}
