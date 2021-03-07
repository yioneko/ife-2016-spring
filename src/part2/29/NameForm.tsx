import React, { Component } from "react";
import "./NameForm.scss"

type Props = Record<string, unknown>;

type errorTypes = "empty" | "less" | "more" | "disallowedChar";

interface State {
    name: string;
    hint: {
        type: "normal" | "error" | "pass";
        errorType?: errorTypes;
    };
}

export default class NameForm extends Component<Props, State> {
    state: State = { name: "", hint: { type: "normal" } };

    readonly hintsList = {
        normal: "必填，长度为4~16个字符",
        error: {
            empty: "姓名不能为空",
            less: "长度至少为4个字符",
            more: "长度不能超过16个字符",
            disallowedChar:
                "包含非法字符，只能包含数字、英文字符、英文符号、汉字",
        },
        pass: "名称格式正确",
    };

    private validationSteps: Record<errorTypes, () => boolean> = (() => {
        function calcLength(name: string): number {
            return (
                name.length +
                (name.match(/\p{Unified_Ideograph}/gu) || []).length
            );
        }
        const checks: Record<errorTypes, () => boolean> = {
            empty: () => calcLength(this.state.name) > 0,
            less: () => calcLength(this.state.name) >= 4,
            more: () => calcLength(this.state.name) <= 16,
            disallowedChar: () =>
                /^[\w\d\s!@#$%^&*)([\]+=.?/\\}{|<>:;"'_\p{Unified_Ideograph}]+$/u.test(
                    this.state.name
                ),
        };
        function generateStep(
            check: () => boolean,
            errorType: errorTypes
        ): () => boolean {
            return function (this: NameForm) {
                const passCheck = check();
                if (!passCheck)
                    this.setState({
                        hint: {
                            type: "error",
                            errorType: errorType,
                        },
                    });
                return passCheck;
            };
        }
        for (const key of Object.keys(checks)) {
            const errorKey = key as errorTypes;
            checks[errorKey] = generateStep(checks[errorKey], errorKey).bind(
                this
            );
        }
        return checks;
    })();

    private handleValidation = (): void => {
        let pass = true;
        for (const step of Object.values(this.validationSteps)) {
            if (!step()) {
                pass = false;
                break;
            }
        }
        if (pass) {
            this.setState({ hint: { type: "pass" } });
        }
    };

    private retrieveHintText = (): string => {
        const hint = this.state.hint;
        if (hint.type === "error") {
            if (hint.errorType) {
                return this.hintsList[hint.type][hint.errorType];
            } else {
                throw new Error("ErrorType not provided.");
            }
        } else {
            return this.hintsList[hint.type];
        }
    };

    render(): JSX.Element {
        return (
            <div className="name-form">
                <label htmlFor="name">名称</label>
                <div className={`input-with-hint ${this.state.hint.type}`}>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={(e) => {
                            this.setState({ name: e.target.value });
                        }}
                    />
                    <div className="hint">{this.retrieveHintText()}</div>
                </div>
                <button
                    className="validation-button button"
                    onClick={this.handleValidation}
                >
                    验证
                </button>
            </div>
        );
    }
}
