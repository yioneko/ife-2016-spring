import React, { useCallback, useMemo, useState } from "react";
import { useCommand, useEditor } from "./CommandEditor";
import { ChessCmdQueue, DirectionsType } from "./types";
import { validateColor } from "./utils";

interface BoardCommandEditorPack {
    editorProps: Draft.EditorProps;
    cmdQueue: ChessCmdQueue;
    setCmdQueue: React.Dispatch<React.SetStateAction<ChessCmdQueue>>;
    pushCommands: () => void;
}
type CommandTypes = "basicMove" | "moveTo" | "turn" | "build" | "brush";
export function useBoardCommandEditor(): BoardCommandEditorPack {
    const commandsRegex = useMemo<Record<CommandTypes, RegExp>>(
        () => ({
            basicMove: /^\s*(?:(GO)|(TRA|MOV)\s*(LEF|TOP|RIG|BOT))\s*(\d*)$/,
            moveTo: /^\s*MOV\sTO\s*(\d+),\s?(\d+)\s*$/,
            turn: /^\s*TUN\s*(LEF|RIG|BAC)\s*$/,
            build: /^\s*BUILD\s*$/,
            brush: /^\s*BRU\s*\b(.+)$/,
        }),
        []
    );

    const directionTransformTable: Record<string, DirectionsType> = useMemo(
        () =>
            Object.freeze({
                LEF: "left",
                RIG: "right",
                TOP: "up",
                BOT: "down",
            }),
        []
    );

    const commandsConvert = useMemo<
        Record<
            CommandTypes,
            (text: string) => ChessCmdQueue | ChessCmdQueue[number] | undefined
        >
    >(
        () => ({
            basicMove: (text) => {
                const getStep = (part: string): number | undefined =>
                    part ? parseInt(part) : undefined;

                const match = text.match(commandsRegex.basicMove);
                if (match) {
                    switch (match[1]) {
                        case "GO": {
                            return {
                                action: "go",
                                step: getStep(match[4]),
                            };
                        }
                        case undefined: {
                            switch (match[2]) {
                                case "TRA": {
                                    return {
                                        action: "move",
                                        direction:
                                            directionTransformTable[match[3]],
                                        step: getStep(match[4]),
                                    };
                                }
                                case "MOV": {
                                    return [
                                        {
                                            action: "rotateTo",
                                            direction:
                                                directionTransformTable[
                                                    match[3]
                                                ],
                                        },
                                        {
                                            action: "go",
                                            step: getStep(match[4]),
                                        },
                                    ];
                                }
                            }
                        }
                    }
                }
            },
            moveTo: (text) => {
                const match = text.match(commandsRegex.moveTo);
                if (match) {
                    return {
                        action: "moveTo",
                        target: {
                            x: parseInt(match[1]),
                            y: parseInt(match[2]),
                        },
                    };
                }
            },
            turn: (text) => {
                const match = text.match(commandsRegex.turn);
                if (match) {
                    const direction = match[1];
                    return {
                        action: "rotateBy",
                        angle:
                            direction === "LEF"
                                ? -Math.PI / 2
                                : direction === "RIG"
                                ? Math.PI / 2
                                : direction === "BAC"
                                ? Math.PI
                                : 0,
                    };
                }
            },
            build: (text) =>
                commandsRegex.build.test(text)
                    ? { action: "build" }
                    : undefined,
            brush: (text) => {
                const match = text.match(commandsRegex.brush);
                if (match) {
                    const color = match[1];
                    if (validateColor(color)) {
                        return { action: "brush", color };
                    }
                }
            },
        }),
        [
            commandsRegex.basicMove,
            commandsRegex.brush,
            commandsRegex.build,
            commandsRegex.moveTo,
            commandsRegex.turn,
            directionTransformTable,
        ]
    );

    const lineValidator = useCallback(
        (text: string): boolean => {
            const { basicMove, moveTo, turn, build, brush } = commandsRegex;

            for (const exp of [basicMove, moveTo, turn, build]) {
                if (exp.test(text)) return true;
            }

            const brushMatch = text.match(brush);
            return !!brushMatch && validateColor(brushMatch[1].trim());
        },
        [commandsRegex]
    );

    const cmdConverter = useCallback(
        (text: string): ChessCmdQueue | ChessCmdQueue[number] | undefined => {
            for (const convert of [...Object.values(commandsConvert)]) {
                const maybeAction = convert(text);
                if (maybeAction) return maybeAction;
            }
            return undefined;
        },
        [commandsConvert]
    );

    const editorProps = useEditor({ lineValidator });
    const { editorState } = editorProps;

    const [cmdQueue, setCmdQueue] = useState([] as ChessCmdQueue);

    const { pushCommands } = useCommand({
        setCmdQueue,
        cmdConverter: cmdConverter,
        editorState,
    });

    return {
        editorProps,
        cmdQueue,
        setCmdQueue,
        pushCommands,
    };
}
