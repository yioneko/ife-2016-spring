import React, { useCallback } from "react";

export interface radioGroupProps {
    name: string;
    value: string;
    className?: string;
    setValue: (value: string) => void;
    preset: {
        value: string;
        label: string;
        id: string;
        key?: string;
        fieldClassName?: string;
    }[];
}

export function RadioGroup(props: radioGroupProps): React.ReactElement {
    /* can not directly use props.setValue for calling and dependency
       because of implicit "this" in props.setValue refer to other props
       see https://github.com/facebook/react/issues/16265
    */
    const { setValue } = props;
    const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            setValue(e.target.value);
        },
        [setValue]
    );

    return (
        <div className={props.className}>
            {props.preset.map((preset) => (
                <div
                    key={preset.key ?? preset.value}
                    className={preset.fieldClassName}
                >
                    <input
                        type="radio"
                        name={props.name}
                        id={preset.id}
                        value={preset.value}
                        checked={preset.value === props.value}
                        onChange={onChange}
                    />
                    <label htmlFor={preset.id}>{preset.label}</label>
                </div>
            ))}
        </div>
    );
}
