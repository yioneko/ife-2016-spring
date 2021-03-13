import React, { useCallback } from "react";

export interface textInputProps {
    label: string;
    name: string;
    value: string;
    id: string;
    setValue: (value: string) => void;
    className?: string;
}

export function TextInputField(props: textInputProps): React.ReactElement {
    const { setValue } = props;
    const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            setValue(e.target.value);
        },
        [setValue]
    );

    return (
        <div className={props.className}>
            <label htmlFor={props.id}>{props.label}</label>
            <input
                type="text"
                name={props.name}
                value={props.value}
                id={props.id}
                onChange={onChange}
            />
        </div>
    );
}
