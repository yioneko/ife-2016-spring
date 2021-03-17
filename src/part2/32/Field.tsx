import React, { useEffect } from "react";
import { useFormContext } from "./Form";

export type FieldTypes = "input" | "select" | "textarea";

interface FieldConfig<Status = any> {
    name: string;
    label?: string;
    status?: Status;
    validate?: (value: string) => [Status, string];
}

export type FieldInputProps<
    Type extends FieldTypes,
    Status = any
> = FieldConfig<Status> &
    JSX.IntrinsicElements[Type] & {
        hint?: string;
        options?: Type extends "select"
            ? {
                  value: string;
                  text: string;
              }[]
            : never;
    };

export type FieldProps<Type extends FieldTypes, Status = any> = FieldInputProps<
    Type,
    Status
> & {
    value: string;
    onChange: React.ChangeEventHandler<
        Type extends "input"
            ? HTMLInputElement
            : Type extends "select"
            ? HTMLSelectElement
            : Type extends "textarea"
            ? HTMLTextAreaElement
            : never
    >;
};

export function useField<Type extends FieldTypes, Status>(
    props: FieldInputProps<Type, Status>
): FieldProps<Type, Status> {
    const { getFieldProps, registerField, deleteField } = useFormContext();
    useEffect(() => {
        registerField(props.name);
        return () => deleteField(props.name);
    }, [registerField, deleteField, props.name]);
    return getFieldProps(props);
}

type InputType = "input";
export function TextInputField<Status>(
    props: Omit<FieldInputProps<InputType, Status>, "type">
): React.ReactElement {
    const completeProps = useField<InputType, Status>(props);
    const { label, name, id = name, hint, ...restProps } = completeProps;
    return (
        <>
            <label htmlFor={id}>{label}</label>
            <input id={id} name={name} type="text" {...restProps} />
            <div className="hint">{hint}</div>
        </>
    );
}

type SelectType = "select";
export function SelectField<Status>(
    props: FieldInputProps<SelectType, Status>
): React.ReactElement {
    const completeProps = useField<SelectType, Status>(props);
    const {
        label,
        name,
        id = name,
        hint,
        options,
        ...restProps
    } = completeProps;
    return (
        <>
            <label htmlFor={id}>{label}</label>
            <select name={name} id={id} {...restProps}>
                {options?.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.text}
                    </option>
                ))}
            </select>
            <div className="hint">{hint}</div>
        </>
    );
}
