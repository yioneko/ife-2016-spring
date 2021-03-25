import React, { useCallback, useState } from "react";
import {
    ContentBlock,
    ContentState,
    Editor,
    EditorBlock,
    EditorState,
    EditorProps,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./CommandEditor.scss";

function LineBlockWithNumber(props: {
    block: ContentBlock;
    contentState: ContentState;
}) {
    const { block, contentState } = props;
    return (
        <div className="line">
            <div className="line-number-wrapper" contentEditable={"false"}>
                <div className="line-number">
                    {contentState
                        .getBlockMap()
                        .toList()
                        .findIndex(
                            (item) => item?.getKey() === block.getKey()
                        ) + 1}
                </div>
            </div>
            <EditorBlock {...props} />
        </div>
    );
}

export interface EditorHookProps extends Partial<EditorProps> {
    lineValidator?: (text: string) => boolean;
}

export function useEditor(props: EditorHookProps): EditorProps {
    const { lineValidator } = props;
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const lineRenderer = useCallback(() => {
        return {
            component: LineBlockWithNumber,
        };
    }, []);

    const lineStyleFn = useCallback(
        (contentBlock: ContentBlock): string => {
            const text = contentBlock.getText();
            if (lineValidator) {
                if (text.length && !lineValidator(text)) return "wrong-line";
            }
            return "default";
        },
        [lineValidator]
    );

    return {
        ...props,
        editorState,
        onChange: setEditorState,
        blockRendererFn: lineRenderer,
        blockStyleFn: lineStyleFn,
    };
}

export interface CommandProps<Cmd> {
    setCmdQueue: React.Dispatch<React.SetStateAction<Array<Cmd>>>;
    cmdConverter: (text: string) => Cmd[] | Cmd | undefined;
    editorState: EditorState;
}

export function useCommand<Cmd>(
    props: CommandProps<Cmd>
): { pushCommands: () => void } {
    const { setCmdQueue, cmdConverter, editorState } = props;

    const pushCommands = useCallback(() => {
        const newCmdQueue = [] as Array<Cmd>;
        editorState
            .getCurrentContent()
            .getBlockMap()
            .toList()
            .forEach((block) => {
                if (block) {
                    const command = cmdConverter(block.getText());
                    if (command) {
                        if (command instanceof Array) {
                            newCmdQueue.push(...command);
                        }
                        else newCmdQueue.push(command);
                    }
                }
            });

        setCmdQueue((prevState) => {
            return prevState.concat(newCmdQueue);
        })
    }, [cmdConverter, setCmdQueue, editorState]);

    return {
        pushCommands,
    };
}

export const CommandEditor = React.memo(function CommandEditor(props: EditorProps): React.ReactElement {
    return (
        <div className="editor-with-scroll">
            <div className="line-number-column"></div>
            <div className="inner-editor">
                <Editor {...props} />
            </div>
        </div>
    );
});
