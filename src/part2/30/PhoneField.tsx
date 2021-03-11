import React from "react";
import { SpecificInputFieldProps } from "./InputField";
import InputField from "./InputField";

export default class PhoneField extends React.Component<
    SpecificInputFieldProps,
    never
> {
    readonly validationSteps: {
        validation: (value: string) => boolean;
        errorInfo: string;
    }[] = [
        {
            validation: (value: string): boolean =>
                value.length > 0 && /^1[3-9]\d{9}$/.test(value),
            errorInfo: "手机格式错误",
        },
    ];

    render(): React.ReactNode {
        const {
            className = "phone-field",
            fieldId = "phone",
            filedName = "phone",
            labelName = "手机",
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
                maxLength={11}
                allowCharsPattern={/[\d]+/}
                initialHintText="选填手机号"
                passHintText="手机格式正确"
                {...rest}
            />
        );
    }
}
