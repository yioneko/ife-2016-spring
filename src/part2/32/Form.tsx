import React, { useCallback, useContext, useRef, useState } from "react";
import { FieldTypes, FieldProps, FieldInputProps } from "./Field";

interface FormProps<Fields extends string = string> extends React.ComponentPropsWithoutRef<"form"> {
    initialValues?: Record<Fields, string | undefined>;
    initialHints?: Record<Fields, string | undefined>;
    initialStatus?: Record<Fields, string | undefined>;
}

interface FormState<Fields extends string = string> {
    values: Record<Fields, string | undefined>;
    hints: Record<Fields, string | undefined>;
    status: Record<Fields, string | undefined>;
}

export interface FormContext<Fields extends string = string> {
    registerField: (name: Fields) => void;
    deleteField: (name: Fields) => void;
    getFieldProps: <Type extends FieldTypes>(
        props: FieldInputProps<Type>
    ) => FieldProps<Type>;
    fields: React.RefObject<Array<Fields>>;
    state: FormState<Fields>;
    setState: React.Dispatch<React.SetStateAction<FormState<Fields>>>;
}

const FormCtx = React.createContext<FormContext<any>>(undefined as any);

export function useFormContext<Fields extends string>(): FormContext<Fields> {
    return useContext<FormContext<Fields>>(FormCtx);
}

export function useForm<Fields extends string = string>(
    props: FormProps<Fields>
): FormContext<Fields> {
    const [state, setState] = useState<FormState>({
        values: props.initialValues ?? {},
        hints: props.initialHints ?? {},
        status: props.initialStatus ?? {},
    });
    const fields = useRef<Array<Fields>>([]);
    const registerField = useCallback<FormContext<Fields>["registerField"]>(
        (name: Fields) => {
            fields.current.push(name);
        },
        [fields]
    );
    const deleteField = useCallback<FormContext<Fields>["deleteField"]>((name: Fields) => {
        fields.current = fields.current.filter((value) => value === name);
    }, [fields]);
    const getFieldProps = useCallback<FormContext<Fields>["getFieldProps"]>(
        (props) => {
            const name = props.name;
            return {
                ...props,
                value: state.values[name] ?? "",
                hint: state.hints[name] ?? "",
                onChange: (e: React.ChangeEvent) => {
                    setState((prevState) => {
                        return {
                            values: {
                                ...prevState.values,
                                [name]: (e.target as any).value,
                            },
                            hints: { ...prevState.hints },
                            status: { ...prevState.status },
                        };
                    });
                },
            };
        },
        [state.values, state.hints]
    );

    return {
        fields,
        registerField,
        deleteField,
        getFieldProps,
        state,
        setState,
    };
}

export function Form<Fields extends string>(
    props: FormProps<Fields>
): React.ReactElement {
    const ctx = useForm<Fields>(props);
    return (
        <FormCtx.Provider value={ctx}>
            <form action="" {...props}></form>
        </FormCtx.Provider>
    );
}
