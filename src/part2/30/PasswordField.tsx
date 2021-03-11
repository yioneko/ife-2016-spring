import React from "react";
import { SpecificInputFieldProps } from "./InputField";
import InputField from "./InputField";

export default class PasswordField extends React.Component<
    SpecificInputFieldProps,
    never
> {
    readonly includedPattern: RegExp[] = [
        /[a-zA-Z0-9]/,
        /[~`!@#$%^&*)(_+\-=\][}{|\\:;"'><?,./]/,
    ];

    readonly validationSteps: {
        validation: (value: string) => boolean;
        errorInfo: string;
    }[] = [
        {
            validation: (value: string): boolean => value.length > 0,
            errorInfo: "密码不能为空",
        },
        {
            validation: (value: string): boolean => value.length >= 8,
            errorInfo: "密码长度至少为8",
        },
        {
            validation: (value: string): boolean => {
                for (const pattern of this.includedPattern) {
                    if (!pattern.test(value)) return false;
                }

                return true;
            },
            errorInfo: "密码必须包含英文字符或数字，与英文特殊符号",
        },
    ];

    render(): React.ReactNode {
        const {
            className = "password-field",
            fieldId = "password",
            filedName = "password",
            labelName = "密码",
            required = true,
            ...rest
        } = this.props;

        return (
            <InputField
                className={className}
                inputType="password"
                fieldId={fieldId}
                filedName={filedName}
                labelName={labelName}
                required={required}
                validationSteps={this.validationSteps}
                maxLength={16}
                allowCharsPattern={/[a-zA-Z0-9~`!@#$%^&*)(_+\\\-=\][}{|:;"'><?,./]+/}
                initialHintText="必填，长度为8~16个字符，包含字母、数字、英文符号"
                passHintText="密码可用"
                {...rest}
            />
        );
    }
}
