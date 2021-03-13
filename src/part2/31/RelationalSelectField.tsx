import React, { useCallback } from "react";

type singleOptionData = {
    text: string;
    next?: optionDataType;
};

type optionDataType = Record<string, singleOptionData>;
type setValueFunType = (action: { newValue: string; name: string }) => void;

export type relationalSelectPresetType = {
    label: string;
    value: string;
    id: string;
    setValue: setValueFunType;
    key?: string;
    fieldClassName?: string;
};

export interface relationalSelectProps {
    preset: Record<string, relationalSelectPresetType>;
    optionData: optionDataType;
    className?: string;
}

export function RelationalSelectField(
    props: relationalSelectProps
): React.ReactElement {
    const onChangeGenerator = useCallback(
        (
            setValue: setValueFunType,
            name: string
        ): React.ChangeEventHandler<HTMLSelectElement> => (e) =>
            setValue({ newValue: e.target.value, name: name }),
        []
    );

    const selectFieldList: React.ReactNodeArray = [];
    const { preset, optionData } = props;
    const presetKeys = Object.keys(preset);
    let preValidFlag = true;
    let curOptions: optionDataType | undefined = optionData;
    for (const name of presetKeys) {
        const curPreset = preset[name];
        const value = curPreset.value;

        /* refer to https://eslint.org/docs/rules/no-prototype-builtins to
         check vulnerability of calling builtin methods on Object directly */
        const isValueValid = Object.prototype.hasOwnProperty.call(
            curOptions ?? {},
            value
        );
        selectFieldList.push(
            <div
                className={curPreset.fieldClassName}
                key={curPreset.key ?? curPreset.id}
            >
                <label htmlFor={curPreset.id}>{curPreset.label}</label>
                <select
                    name={name}
                    id={curPreset.id}
                    value={isValueValid ? value : undefined}
                    onChange={onChangeGenerator(curPreset.setValue, name)}
                >
                    {curOptions !== undefined &&
                        (preValidFlag || isValueValid) &&
                        Object.keys(curOptions).map((key) => {
                            const data = (curOptions as optionDataType)[key];
                            return (
                                <option key={key} value={key}>
                                    {data.text}
                                </option>
                            );
                        })}
                </select>
            </div>
        );
        if (isValueValid && curOptions !== undefined)
            curOptions = curOptions[value].next;
        preValidFlag = isValueValid;
    }

    return <div className={props.className}>{selectFieldList}</div>;
}
