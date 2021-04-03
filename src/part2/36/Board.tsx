import React, { useCallback, useEffect, useRef } from "react";
import { useBoardWall } from "./boardWall";
import { useChess } from "./chess";
import { useRandomWall } from "./randomWall";
import { BoardProps } from "./types";

export const Board = React.memo(function Board(
    props: BoardProps
): React.ReactElement {
    const {
        gridCount = 10,
        meshColor = "#D8E8E8",
        perimeterColor = "#3A3A3A",
        numberColor = "#3A3A3A",
        chessProps,
        randomWallCounter,
        setRandomWallCounter,
        ...canvasProps
    } = props;

    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const widthRef = useRef<number>();
    const heightRef = useRef<number>();
    const unitLengthRef = useRef<number>(0);

    const canvasRefCallBack = useCallback(
        (canvas: HTMLCanvasElement | null) => {
            if (canvas) {
                ctxRef.current = canvas.getContext(
                    "2d"
                ) as CanvasRenderingContext2D;
                widthRef.current = canvas.width;
                heightRef.current = canvas.height;
                unitLengthRef.current =
                    Math.min(canvas.width, canvas.height) / (gridCount + 1);
            } else {
                ctxRef.current = null;
            }
        },
        [gridCount]
    );

    const lazyBoardCtx = useCallback(
        () => ctxRef.current as CanvasRenderingContext2D,
        []
    );
    const lazyUnitLength = useCallback(() => unitLengthRef.current, []);

    const {
        drawWall,
        wall,
        dispatch: wallDispatch,
        wallBuildColor,
    } = useBoardWall({
        gridCount,
        boardCtx: lazyBoardCtx,
        unitLength: lazyUnitLength,
    });

    const drawBoard = useCallback(() => {
        const ctx = ctxRef.current as CanvasRenderingContext2D;
        const unitLength = unitLengthRef.current as number;
        const length =
            (Math.min(widthRef.current as number, heightRef.current as number) /
                (gridCount + 1)) *
            gridCount;
        ctx.clearRect(
            -unitLength,
            -unitLength,
            widthRef.current as number,
            heightRef.current as number
        );

        ctx.save();
        ctx.strokeStyle = perimeterColor;
        ctx.strokeRect(0, 0, length, length);
        ctx.restore();

        for (let col = 1; col <= gridCount; col++) {
            ctx.save();
            ctx.translate(col * unitLength, 0);
            ctx.save();
            ctx.font = unitLength / 2 + "px serif";
            ctx.fillStyle = numberColor;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText(col.toString(), -unitLength / 2, -unitLength / 2);
            ctx.restore();

            if (col !== gridCount) {
                ctx.save();
                ctx.strokeStyle = meshColor;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, length);
                ctx.stroke();
                ctx.restore();
            }
            ctx.restore();
        }

        for (let row = 1; row <= gridCount; row++) {
            ctx.save();
            ctx.translate(0, row * unitLength);
            ctx.save();
            ctx.font = unitLength / 2 + "px serif";
            ctx.fillStyle = numberColor;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText(row.toString(), -unitLength / 2, -unitLength / 2);
            ctx.restore();

            if (row !== gridCount) {
                ctx.save();
                ctx.strokeStyle = meshColor;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(length, 0);
                ctx.stroke();
                ctx.restore();
            }
            ctx.restore();
        }

        drawWall();
    }, [drawWall, gridCount, meshColor, numberColor, perimeterColor]);

    useEffect(() => {
        const ctx = ctxRef.current as CanvasRenderingContext2D;
        const [width, height] = [
            widthRef.current as number,
            heightRef.current as number,
        ];
        const meshOrigin =
            width > height
                ? [(width - height) / 2, 0]
                : [0, (height - width) / 2];
        const unitLength = unitLengthRef.current as number;
        meshOrigin[0] += unitLength;
        meshOrigin[1] += unitLength;

        ctx.save();
        ctx.translate(meshOrigin[0], meshOrigin[1]);
    }, []);

    const { animPromiseRef, state: chessState } = useChess({
        boardCtx: lazyBoardCtx,
        unitLength: lazyUnitLength,
        wallBuildColor,
        drawBoard,
        wallDispatch,
        wall,
        gridCount,
        ...chessProps,
    });

    useRandomWall({
        randomWallCounter,
        setRandomWallCounter,
        animPromiseRef,
        wall,
        wallDispatch,
        chessState,
        wallBuildColor,
        gridCount,
    });

    return <canvas {...canvasProps} ref={canvasRefCallBack} />;
});
