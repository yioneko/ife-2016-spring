import React, { useCallback, useMemo, useState } from "react";
import "./App.scss";
import { Board } from "./Board";
import { CommandEditor } from "./CommandEditor";
import { useBoardCommandEditor } from "./boardCommandEditor";
import { useReset } from "./utils";

export function App(): React.ReactElement {
    const {
        editorProps,
        cmdQueue,
        setCmdQueue,
        pushCommands,
    } = useBoardCommandEditor();

    const [randomWallCounter, setRandomWallCounter] = useState(0);
    const handleRandomWallClick = useCallback(() => {
        setRandomWallCounter((prevCounter) => prevCounter + 1);
    }, []);

    const chessProps = useMemo(
        () => ({
            cmdQueue,
            setCmdQueue,
            initialCoordinate: { x: 12, y: 12 },
        }),
        [cmdQueue, setCmdQueue]
    );

    const [resetCounter, handleReset] = useReset();

    return (
        <div className="app">
            <Board
                width={700}
                height={700}
                gridCount={25}
                key={"Board" + resetCounter}
                randomWallCounter={randomWallCounter}
                setRandomWallCounter={setRandomWallCounter}
                chessProps={chessProps}
            />
            <div className="editor-buttons-wrapper">
                <CommandEditor
                    key={"CmdEditor" + resetCounter}
                    {...editorProps}
                />
                <div className="buttons">
                    <button onClick={pushCommands}>执行</button>
                    <button onClick={handleReset}>Refresh</button>
                    <button onClick={handleRandomWallClick}>随机墙</button>
                </div>
            </div>
        </div>
    );
}
