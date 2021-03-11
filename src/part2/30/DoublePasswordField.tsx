import React from "react";
import { SpecificInputFieldProps } from "./InputField";
import InputField from "./InputField";

type DoublePasswordFieldProps = SpecificInputFieldProps & {
    validationSteps?: {
        validation: (value: string) => boolean;
        errorInfo: string;
    }[];
};

export default function DoublePasswordField(
    props: DoublePasswordFieldProps
): React.ReactElement {
    const {
        className = "double-password-field",
        fieldId = "doublePassword",
        filedName = "doublePassword",
        labelName = "密码确认",
        required = true,
        ...rest
    } = props;

    return (
        <InputField
            className={className}
            inputType="password"
            fieldId={fieldId}
            filedName={filedName}
            labelName={labelName}
            required={required}
            validationSteps={props.validationSteps}
            maxLength={16}
            allowCharsPattern={/[a-zA-Z0-9~`!@#$%^&*)(_+\\\-=\][}{|:;"'><?,./]+/}
            initialHintText="再次输入相同密码"
            passHintText="密码输入一致"
            {...rest}
        />
    );
}
