import React from "react";
import NameField from "./NameField";
import PasswordField from "./PasswordField";
import DoublePasswordField from "./DoublePasswordField";
import MailField from "./MailField";
import PhoneField from "./PhoneField";
import "./DemoForm.scss";

const fieldNameEnums = Object.freeze({
    name: "name",
    password: "password",
    doublePassword: "doublePassword",
    mail: "mail",
    phone: "phone",
});

type fieldNames = keyof typeof fieldNameEnums;

type FormState = Record<fieldNames, { value: string; pass: boolean }>;

type fieldCallBacksType = Record<
    fieldNames,
    {
        handleChange: React.ChangeEventHandler<HTMLInputElement>;
        setPass: (pass: boolean) => void;
    }
>;

const isFieldRequired: Record<fieldNames, boolean> = {
    name: true,
    password: true,
    doublePassword: true,
    mail: false,
    phone: false,
};

const defaultState: FormState = (() => {
    const ret: FormState = {} as FormState;
    for (const fieldName of Object.keys(fieldNameEnums)) {
        ret[fieldName as fieldNames] = {
            value: "",
            pass: isFieldRequired[fieldName as fieldNames] ? false : true,
        };
    }
    return ret;
})();

export default class DemoForm extends React.Component<
    Record<string, never>,
    FormState
> {
    state: FormState = defaultState;

    readonly fieldCallBacks: fieldCallBacksType = (() => {
        const callBacks = {} as fieldCallBacksType;
        for (const fieldName of Object.keys(fieldNameEnums)) {
            const castFieldName = fieldName as fieldNames;
            callBacks[castFieldName] = {
                handleChange: (e) => {
                    this.setState((prevState) => {
                        const newState = { ...prevState };
                        newState[castFieldName] = {
                            value: e.target.value,
                            pass: prevState[castFieldName].pass,
                        };
                        return newState;
                    });
                },
                setPass: (pass) => {
                    this.setState((prevState) => {
                        const newState = { ...prevState };
                        newState[castFieldName] = {
                            value: prevState[castFieldName].value,
                            pass: pass,
                        };
                        return newState;
                    });
                },
            };
        }
        return callBacks;
    })();

    handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        const state = this.state;
        for (const fieldName of Object.keys(fieldNameEnums)) {
            if (!state[fieldName as fieldNames].pass) {
                e.preventDefault();
                alert("请重新是否完整、正确");
                return;
            }
        }
    };

    render(): React.ReactNode {
        return (
            <form className="demo-form" onSubmit={this.handleSubmit} method="">
                <NameField
                    {...this.state.name}
                    {...this.fieldCallBacks.name}
                    required={isFieldRequired.name}
                    fieldId={fieldNameEnums.name}
                    filedName={fieldNameEnums.name}
                />
                <PasswordField
                    {...this.state.password}
                    {...this.fieldCallBacks.password}
                    required={isFieldRequired.password}
                    fieldId={fieldNameEnums.password}
                    filedName={fieldNameEnums.password}
                />
                <DoublePasswordField
                    {...this.state.doublePassword}
                    {...this.fieldCallBacks.doublePassword}
                    required={isFieldRequired.doublePassword}
                    fieldId={fieldNameEnums.doublePassword}
                    filedName={fieldNameEnums.doublePassword}
                    validationSteps={[
                        {
                            validation: (value: string) =>
                                this.state.password.value === value,
                            errorInfo: "两次密码输入不一致",
                        },
                    ]}
                />
                <MailField
                    {...this.state.mail}
                    {...this.fieldCallBacks.mail}
                    required={isFieldRequired.mail}
                    fieldId={fieldNameEnums.mail}
                    filedName={fieldNameEnums.mail}
                />
                <PhoneField
                    {...this.state.phone}
                    {...this.fieldCallBacks.phone}
                    required={isFieldRequired.phone}
                    fieldId={fieldNameEnums.phone}
                    filedName={fieldNameEnums.phone}
                />
                <button type="submit" className="submit-button">
                    提交
                </button>
            </form>
        );
    }
}
