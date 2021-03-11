import React from "react";
import { SpecificInputFieldProps } from "./InputField";
import InputField from "./InputField";

export default class NameField extends React.Component<
    SpecificInputFieldProps,
    never
> {
    readonly validationSteps: {
        validation: (value: string) => boolean;
        errorInfo: string;
    }[] = (() => {
        const calcLength = (value: string): number => {
            return (
                value.length +
                (value.match(/\p{Unified_Ideograph}/gu) || []).length
            );
        };

        return [
            {
                validation: (value: string): boolean => value.length > 0,
                errorInfo: "姓名不能为空",
            },
            {
                validation: (value: string): boolean => calcLength(value) >= 4,
                errorInfo: "长度至少为4个字符",
            },
            {
                validation: (value: string): boolean => calcLength(value) <= 16,
                errorInfo: "长度不能超过16个字符",
            },
            {
                validation: (value: string): boolean =>
                    /^[\w\d\s!@#$%^&*)([\]+=.?/\\}{|<>:;"'_\p{Unified_Ideograph}]+$/u.test(
                        value
                    ),
                errorInfo:
                    "包含非法字符，只能包含数字、英文字符、英文符号、汉字",
            },
        ];
    })();

    render(): React.ReactNode {
        const {
            className = "name-field",
            fieldId = "name",
            filedName = "name",
            labelName = "名称",
            required = true,
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
                maxLength={16}
                initialHintText="必填，长度为4~16个字符"
                passHintText="名称格式正确"
                {...rest}
            />
        );
    }
}
