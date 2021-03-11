import React from "react";
import { SpecificInputFieldProps } from "./InputField";
import InputField from "./InputField";

export default class MailField extends React.Component<
    SpecificInputFieldProps,
    never
> {
    readonly validationSteps: {
        validation: (value: string) => boolean;
        errorInfo: string;
    }[] = [
        {
            validation: (value: string): boolean =>
                value.length > 0 &&
                /^[\w\d_-]+@[\w\d_-]+(\.[\w\d_-]+)*\.[\w\d_-]+$/.test(value),
            errorInfo: "邮箱格式错误",
        },
    ];

    render(): React.ReactNode {
        const {
            className = "mail-field",
            fieldId = "mail",
            filedName = "mail",
            labelName = "邮箱",
            required = false,
            ...rest
        } = this.props;

        return (
            <InputField
                className={className}
                fieldId={fieldId}
                filedName={filedName}
                labelName={labelName}
                required={required}
                validationSteps={this.validationSteps}
                maxLength={50}
                allowCharsPattern={/[\w\d_\-@.]+/}
                initialHintText="选填邮箱地址"
                passHintText="邮箱格式正确"
                {...rest}
            />
        );
    }
}
