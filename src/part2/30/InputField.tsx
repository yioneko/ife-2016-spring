import React from "react";
import "./InputField.scss";

export type hintTypes = "initial" | "error" | "pass";

export interface SpecificInputFieldProps {
    filedName?: string;
    fieldId?: string;
    className?: string;
    labelName?: string;
    required: boolean;
    value: string;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    setPass: (pass: boolean) => void;
}

interface InputFieldState {
    hintType: hintTypes;
    hintText: string;
}

type InputFieldProps = Required<SpecificInputFieldProps> & {
    inputType?: string;
    maxLength?: number;
    allowCharsPattern?: RegExp | string;
    validationSteps?: {
        validation: (value: string) => boolean;
        errorInfo: string;
    }[];
    initialHintText: string;
    passHintText: string;
};

export default class InputField extends React.Component<
    InputFieldProps,
    InputFieldState
> {
    state: InputFieldState = {
        hintType: "initial",
        hintText: this.props.initialHintText,
    };

    fieldRef: React.RefObject<HTMLDivElement> = React.createRef();

    onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        let value = e.target.value;
        const pattern = this.props.allowCharsPattern;
        if (pattern !== undefined)
            value = (value.match(new RegExp(pattern, "g")) || []).join("");
        const maxLength = this.props.maxLength;
        if (maxLength !== undefined)
            value = value.substring(0, Math.min(value.length, maxLength));

        const validationSteps = this.props.validationSteps;
        let errorFlag = false;
        if (validationSteps) {
            for (const step of validationSteps) {
                if (!step.validation(value)) {
                    this.setState({
                        hintType: "error",
                        hintText: step.errorInfo,
                    });
                    errorFlag = true;
                    break;
                }
            }
        }
        if (!errorFlag) {
            this.setState({
                hintType: "pass",
                hintText: this.props.passHintText,
            });
        }

        e.target.value = value;
        this.props.handleChange(e);
        this.props.setPass(!errorFlag);

        if (!this.props.required && e.target.value.length === 0) {
            this.setState({
                hintType: "initial",
                hintText: this.props.initialHintText,
            });
        }
    };

    onInputFocus: React.FocusEventHandler<HTMLInputElement> = () => {
        (this.fieldRef.current as HTMLDivElement).classList.add(
            "input-field-focused"
        );
    };

    render(): React.ReactNode {
        const { inputType = "text" } = this.props;
        return (
            <div
                className={`${this.props.className} input-field`}
                ref={this.fieldRef}
            >
                <label htmlFor={this.props.fieldId}>
                    {this.props.labelName}
                </label>
                <div className={`input-with-hint ${this.state.hintType}`}>
                    <input
                        type={inputType}
                        name={this.props.filedName}
                        id={this.props.fieldId}
                        onChange={this.onInputChange}
                        onFocus={this.onInputFocus}
                    />
                    <div className="hint">{this.state.hintText}</div>
                </div>
            </div>
        );
    }
}
