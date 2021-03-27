import React from "react";
import { CSSTransition } from "react-transition-group";

interface FloatCoverProps {
    floatIn: boolean;
    handleConfirm: React.MouseEventHandler;
    handleCancel: React.MouseEventHandler;
    title: string;
    content: string;
}

export function FloatCover(props: FloatCoverProps): React.ReactElement {
    const {
        floatIn,
        handleConfirm,
        handleCancel,
        title,
        content,
    } = props;

    return (
        <CSSTransition
            in={floatIn}
            timeout={500}
            classNames="float-cover"
            mountOnEnter={true}
            unmountOnExit={true}
        >
            <div
                className="float-cover"
                onClick={(e) => { if (e.target === e.currentTarget) handleCancel(e); }}
            >
                <div className="popup">
                    <h3 className="title">{title}</h3>
                    <div className="content">{content}</div>
                    <div className="buttons">
                        <button
                            className="confirm-button"
                            onClick={handleConfirm}
                        >
                            确定
                        </button>
                        <button
                            className="cancel-button"
                            onClick={handleCancel}
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}
