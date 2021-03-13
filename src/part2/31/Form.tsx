import React, { useState, useReducer, useMemo } from "react";
import { RadioGroup, radioGroupProps } from "./RadioGroup";
import {
    RelationalSelectField,
    relationalSelectProps,
    relationalSelectPresetType,
} from "./RelationalSelectField";
import { TextInputField, textInputProps } from "./TextInputField";
import _ from "lodash";
import "./Form.scss";

function useFigureSelect(
    preset: radioGroupProps["preset"],
    fieldName: string,
    initialValue?: string
): radioGroupProps {
    const [figure, setFigure] = useState(initialValue ?? preset[0].value);
    return useMemo(() => {
        return {
            name: fieldName,
            value: figure,
            setValue: setFigure,
            preset: preset.map((val) => {
                return { ...val };
            }),
        };
    }, [fieldName, figure, preset]);
}

export type schoolSelectState = Record<string, { value: string }>;
function useSchoolSelect(
    initialProps: Omit<relationalSelectProps, "preset"> & {
        preset: Record<
            string,
            Omit<relationalSelectPresetType, "value" | "setValue"> & {
                value?: string;
            }
        >;
    }
): relationalSelectProps {
    const initialValue = {} as schoolSelectState;
    for (const key of Object.keys(initialProps.preset)) {
        initialValue[key] = {
            value: initialProps.preset[key].value ?? "",
        };
    }

    const [state, dispatch] = useReducer(
        (
            state: schoolSelectState,
            action: { newValue: string; name: string }
        ) => {
            state = { ...state, [action.name]: { value: action.newValue } };
            return state;
        },
        initialValue
    );

    const preset = _.cloneDeep(
        initialProps.preset
    ) as relationalSelectProps["preset"];

    for (const key of Object.keys(preset)) {
        preset[key].value = state[key].value;
        preset[key].setValue = dispatch;
    }

    return {
        preset: preset,
        optionData: _.cloneDeep(initialProps.optionData),
    };
}

function useCompanyInput(
    initialProps: Omit<textInputProps, "value" | "setValue"> & {
        value?: string;
    }
): textInputProps {
    const [company, setCompany] = useState(initialProps.value ?? "");
    const props = { ...initialProps } as textInputProps;
    props.value = company;
    props.setValue = setCompany;
    return props;
}

const figureSelectInitialProps = Object.freeze({
    name: "figure",
    value: "student",
    preset: [
        {
            value: "student",
            label: "在校生",
            id: "student",
        },
        {
            value: "nonStudent",
            label: "非在校生",
            id: "non-student",
        },
    ],
});

const schoolSelectInitialProps = Object.freeze({
    preset: {
        city: {
            label: "城市",
            id: "city",
        },
        college: {
            label: "大学",
            id: "college",
        },
    },
    optionData: {
        [""]: {
            text: "请选择城市",
        },
        Beijing: {
            text: "北京",
            next: {
                THU: { text: "清华大学" },
                BJU: { text: "北京大学" },
            },
        },
        Shanghai: {
            text: "上海",
            next: {
                SJTU: { text: "上海交通大学" },
                FDU: { text: "复旦大学" },
            },
        },
    },
});

const companyInputInitialProps = Object.freeze({
    label: "就业单位",
    name: "company",
    id: "company",
});

export function Form(): React.ReactElement {
    const figureSelectProps = useFigureSelect(
        figureSelectInitialProps.preset,
        figureSelectInitialProps.name,
        figureSelectInitialProps.value
    );
    const schoolSelectProps = useSchoolSelect(schoolSelectInitialProps);
    const companyInputProps = useCompanyInput(companyInputInitialProps);

    return (
        <div className="form">
            <RadioGroup className="figure-select" {...figureSelectProps} />
            {(() => {
                if (figureSelectProps.value === "student") {
                    return <RelationalSelectField className="school-select" {...schoolSelectProps} />;
                } else {
                    return <TextInputField className="company-input" {...companyInputProps} />;
                }
            })()}
        </div>
    );
}
