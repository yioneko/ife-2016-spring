import { useCallback, useEffect, useMemo, useRef } from "react";
import { emptyWall } from "./boardWall";
import {
    ChessCmdQueue,
    ChessInheritedProps,
    ChessPack,
    ChessProps,
    ChessState,
    Coordinate,
    DirectionsType,
    ReducerActionType,
} from "./types";
import {
    directions,
    directionUtils,
    fillTowDimensionArray,
    floatLessCompare,
    isCoordinateEqual,
    isCoordinateInRange,
    PriorityQueue,
    useAsyncReducer,
    validateColor,
} from "./utils";

export function useChess(props: ChessProps & ChessInheritedProps): ChessPack {
    const {
        mainColor: inputMainColor,
        frontColor: inputFrontColor,
        wallBuildColor,
        rotationSpeed = 0.004,
        moveSpeed = 0.004,
        wallBuildTime = 200,
        wallBrushTime = 200,
        cmdQueue,
        setCmdQueue,
        initialFrontDirection = "up",
        initialCoordinate = { x: 6, y: 6 },
        boardCtx,
        unitLength,
        drawBoard,
        wall,
        wallDispatch,
        gridCount,
    } = props;

    // validate color and set default value if false
    const mainColor = useMemo(
        () =>
            inputMainColor && validateColor(inputMainColor)
                ? inputMainColor
                : "#FE0000",
        [inputMainColor]
    );
    const frontColor = useMemo(
        () =>
            inputFrontColor && validateColor(inputFrontColor)
                ? inputFrontColor
                : "#0001FE",
        [inputFrontColor]
    );

    // same lazy load
    const frontBorderLength = useMemo(() => {
        return () => unitLength() * 0.2;
    }, [unitLength]);

    // rotationAngle in radians
    const drawChess = useCallback(
        (state: ChessState, rotationAngle: number) => {
            const ctx = boardCtx();
            const unit = unitLength();
            const borderLength = frontBorderLength();
            drawBoard(); // include clear rect
            ctx.save();
            ctx.translate(
                (state.coordinate.x - 1) * unit,
                (state.coordinate.y - 1) * unit
            );

            ctx.save();
            ctx.translate(unit * 0.5, unit * 0.5);
            ctx.rotate(rotationAngle);
            ctx.translate(-unit * 0.5, -unit * 0.5);
            ctx.fillStyle = mainColor;
            ctx.fillRect(0, 0, unit, unit);
            ctx.fillStyle = frontColor;
            const { x: fx, y: fy } = directions[state.frontDirection];
            if (fx === 0) {
                const rectYStart = fy === 1 ? unit - borderLength : 0;
                ctx.fillRect(0, rectYStart, unit, borderLength);
            } else if (fy === 0) {
                const rectXStart = fx === 1 ? unit - borderLength : 0;
                ctx.fillRect(rectXStart, 0, borderLength, unit);
            }
            ctx.restore();

            ctx.restore(); // restore initial translation
        },
        [
            drawBoard,
            boardCtx,
            unitLength,
            mainColor,
            frontColor,
            frontBorderLength,
        ]
    );

    const searchPath = useCallback(
        async (
            chessState: ChessState,
            target: Coordinate
        ): Promise<ChessCmdQueue> => {
            const initialPos = chessState.coordinate;

            interface PathNode {
                pos: Coordinate;
                step: number;
                estimatedCost: number;
                action?: ReducerActionType;
                prev?: PathNode;
            }
            const estimateLeftCost = (cur: Coordinate) =>
                Math.abs(cur.x - target.x) + Math.abs(cur.y - target.y);
            function comparePathNode(a: PathNode, b: PathNode): number {
                return a.estimatedCost - b.estimatedCost;
            }
            const path = new PriorityQueue<PathNode>(comparePathNode);
            path.push({
                pos: initialPos,
                step: 0,
                estimatedCost: estimateLeftCost(initialPos),
            });
            const memoStep = fillTowDimensionArray(Infinity, [
                gridCount + 1,
                gridCount + 1,
            ]);
            memoStep[initialPos.x][initialPos.y] = 0;

            async function aStar(): Promise<PathNode | undefined> {
                let cur = path.pop();
                while (
                    cur !== undefined &&
                    !isCoordinateEqual(cur.pos, target)
                ) {
                    for (const entry of Object.entries(directions)) {
                        const direction = entry[0];
                        const dir = entry[1];
                        const newPos = {
                            x: cur.pos.x + dir.x,
                            y: cur.pos.y + dir.y,
                        };
                        const newPathNode: PathNode = {
                            pos: newPos,
                            step: cur.step + 1,
                            prev: cur,
                            action: {
                                action: "move",
                                direction: direction as DirectionsType,
                            },
                            estimatedCost:
                                cur.step + 1 + estimateLeftCost(newPos),
                        };

                        if (
                            isCoordinateInRange(newPos, gridCount) &&
                            memoStep[newPos.x][newPos.y] > newPathNode.step &&
                            wall[newPos.x][newPos.y] === emptyWall
                        ) {
                            memoStep[newPos.x][newPos.y] = newPathNode.step;
                            path.push(newPathNode);
                        }
                    }
                    cur = path.pop();
                }
                return cur;
            }

            const terminal = await aStar();

            let cur = terminal;
            const actionQueue: ChessCmdQueue = [];
            while (cur !== undefined) {
                if (!isCoordinateEqual(cur.pos, initialPos)) {
                    actionQueue.unshift(cur.action as ReducerActionType);
                }
                cur = cur.prev;
            }

            return actionQueue;
        },
        [gridCount, wall]
    );

    // Use async reducer for the new state must be returned after animation terminate (resolve).
    const reducer = useCallback(
        async (
            prevState: ChessState,
            action: ReducerActionType
        ): Promise<ChessState> => {
            const {
                coordinate: { x: prevX, y: prevY },
                frontDirection: prevDirection,
            } = prevState;
            const { x: prevXDirection, y: prevYDirection } = directions[
                prevDirection
            ];
            const restrictTarget = (
                pos: Coordinate,
                direction: Coordinate,
                curTarget: number
            ): number => {
                const activeDimension = direction.x === 0 ? "y" : "x";
                const isPositive = direction[activeDimension] > 0;
                const incr = isPositive ? 1 : -1;
                const boundary = isPositive ? gridCount : 1;
                const inRange = (value: number) =>
                    isPositive ? value <= boundary : value >= boundary;
                const getWall = (curVal: number) => {
                    if (activeDimension === "x") return wall[curVal][pos.y];
                    else return wall[pos.x][curVal];
                };
                for (
                    let cur = pos[activeDimension];
                    inRange(cur);
                    cur += incr
                ) {
                    if (getWall(cur) !== emptyWall)
                        return Math.min(
                            Math.abs(pos[activeDimension] - cur) - 1,
                            curTarget
                        );
                }
                return Math.min(
                    Math.abs(boundary - pos[activeDimension]),
                    curTarget
                );
            };

            switch (action.action) {
                case "go": {
                    const step = action.step ?? 1;
                    const target = restrictTarget(
                        prevState.coordinate,
                        directions[prevState.frontDirection],
                        step
                    );
                    let start = 0;
                    await new Promise<void>((resolve) => {
                        const goAnim = (timestamp: number) => {
                            if (start === 0) start = timestamp;
                            const time = timestamp - start;

                            const distance = Math.min(time * moveSpeed, target);
                            drawChess(
                                {
                                    ...prevState,
                                    coordinate: {
                                        x: prevX + prevXDirection * distance,
                                        y: prevY + prevYDirection * distance,
                                    },
                                },
                                0
                            );
                            if (floatLessCompare(distance, target)) {
                                requestAnimationFrame(goAnim);
                            } else {
                                resolve();
                            }
                        };
                        requestAnimationFrame(goAnim);
                    });
                    return {
                        ...prevState,
                        coordinate: {
                            x: prevX + prevXDirection * target,
                            y: prevY + prevYDirection * target,
                        },
                    };
                }
                case "move": {
                    const step = action.step ?? 1;
                    const target = restrictTarget(
                        prevState.coordinate,
                        directions[action.direction],
                        step
                    );
                    const { x: xDirection, y: yDirection } = directions[
                        action.direction
                    ];
                    let start = 0;
                    await new Promise<void>((resolve) => {
                        const moveAnim = (timestamp: number) => {
                            if (start === 0) start = timestamp;
                            const time = timestamp - start;

                            const distance = Math.min(time * moveSpeed, target);
                            drawChess(
                                {
                                    ...prevState,
                                    coordinate: {
                                        x: prevX + xDirection * distance,
                                        y: prevY + yDirection * distance,
                                    },
                                },
                                0
                            );
                            if (floatLessCompare(distance, target)) {
                                requestAnimationFrame(moveAnim);
                            } else {
                                resolve();
                            }
                        };
                        requestAnimationFrame(moveAnim);
                    });
                    return {
                        ...prevState,
                        coordinate: {
                            x: prevX + xDirection * target,
                            y: prevY + yDirection * target,
                        },
                    };
                }
                case "moveTo": {
                    const target = action.target;
                    const path = await searchPath(prevState, target);

                    let state = prevState;
                    for (const nxt of path) {
                        state = await reducer(state, nxt);
                    }
                    return state;
                }
                case "rotateTo": {
                    const totalRotateAngle = Math.abs(
                        directionUtils.getRotateAngle(
                            prevDirection,
                            action.direction,
                            !!action.counterClockWise
                        )
                    );
                    let start = 0;
                    await new Promise<void>((resolve) => {
                        const rotateToAnim = (timestamp: number) => {
                            if (start === 0) start = timestamp;
                            const time = timestamp - start;

                            const rotateAngle = Math.min(
                                time * rotationSpeed,
                                totalRotateAngle
                            );
                            drawChess(
                                prevState,
                                rotateAngle * (action.counterClockWise ? -1 : 1)
                            );
                            if (
                                floatLessCompare(rotateAngle, totalRotateAngle)
                            ) {
                                requestAnimationFrame(rotateToAnim);
                            } else {
                                resolve();
                            }
                        };
                        requestAnimationFrame(rotateToAnim);
                    });
                    return {
                        ...prevState,
                        frontDirection: action.direction,
                    };
                }
                case "rotateBy": {
                    const negativeAngle = action.angle < 0;
                    let start = 0;
                    await new Promise<void>((resolve) => {
                        const rotateByAnim = (timestamp: number) => {
                            if (start === 0) start = timestamp;
                            const time = timestamp - start;

                            const rotateAngle =
                                Math.min(
                                    time * rotationSpeed,
                                    Math.abs(action.angle)
                                ) * (negativeAngle ? -1 : 1);
                            drawChess(prevState, rotateAngle);
                            if (
                                floatLessCompare(
                                    Math.abs(rotateAngle),
                                    Math.abs(action.angle)
                                )
                            ) {
                                requestAnimationFrame(rotateByAnim);
                            } else {
                                resolve();
                            }
                        };
                        requestAnimationFrame(rotateByAnim);
                    });
                    return {
                        ...prevState,
                        frontDirection: directionUtils.getDirection(
                            prevDirection,
                            action.angle
                        ),
                    };
                }
                case "build": {
                    const [buildX, buildY] = [
                        prevX + prevXDirection,
                        prevY + prevYDirection,
                    ];
                    const pos = { x: buildX, y: buildY };
                    if (
                        isCoordinateInRange(pos, gridCount) &&
                        wall[buildX][buildY] === emptyWall
                    ) {
                        await new Promise<void>((resolve) =>
                            setTimeout(resolve, wallBuildTime)
                        );
                        wallDispatch({ pos, color: wallBuildColor });
                    } else {
                        console.log(`Wall build failed`);
                    }
                    return { ...prevState };
                }
                case "brush": {
                    const [buildX, buildY] = [
                        prevX + prevXDirection,
                        prevY + prevYDirection,
                    ];
                    const pos = { x: buildX, y: buildY };
                    const color = action.color;
                    if (
                        isCoordinateInRange(pos, gridCount) &&
                        wall[buildX][buildY] !== emptyWall &&
                        validateColor(color)
                    ) {
                        await new Promise<void>((resolve) =>
                            setTimeout(resolve, wallBrushTime)
                        );
                        wallDispatch({ pos, color });
                    } else {
                        console.log(`Wall brush failed`);
                    }
                    return { ...prevState };
                }
            }
        },
        [
            drawChess,
            gridCount,
            moveSpeed,
            rotationSpeed,
            searchPath,
            wall,
            wallBrushTime,
            wallBuildColor,
            wallBuildTime,
            wallDispatch,
        ]
    );

    const initialState = useRef({
        coordinate: initialCoordinate,
        frontDirection: initialFrontDirection,
    });

    /* state managed in async way (not useState in React hooks so we can explicitly
       await setState(dispatch) to complete) */
    const [state, dispatch] = useAsyncReducer(reducer, initialState.current);

    // prevent animation from overlap
    const animPromiseRef = useRef(Promise.resolve());
    useEffect(() => {
        animPromiseRef.current = animPromiseRef.current.then(async () => {
            // console.log(cmdQueue, cancelPromiseRef.current);
            if (cmdQueue.length > 0) {
                setCmdQueue((prevState) => prevState.slice(1));
                const action = cmdQueue[0];
                await dispatch(action as ReducerActionType);
            }
        });
    }, [setCmdQueue, cmdQueue, dispatch]);

    useEffect(() => {
        drawChess(initialState.current, 0);
    }, [drawChess]);

    return {
        state,
        dispatch,
        drawChess,
        frontBorderLength,
        mainColor,
        frontColor,
        rotationSpeed,
        moveSpeed,
        cmdQueue,
        wallBuildTime,
        wallBrushTime,
        setCmdQueue,
        initialFrontDirection,
        initialCoordinate,
        initialState,
        animPromiseRef,
    };
}
