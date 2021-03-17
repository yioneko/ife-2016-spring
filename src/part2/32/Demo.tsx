import React from "react";
import ReactDOM from "react-dom";
import { Form } from "./Form";
import { TextInputField, SelectField } from "./Field";

ReactDOM.render(
    <>
        {" "}
        <Form className="demo-1">
            <TextInputField name="text-input-1" label="field-1" />
            <TextInputField name="text-input-2" label="field-2" />
        </Form>
        <Form className="demo-2">
            <SelectField
                name="select-1"
                label="select-1"
                options={[
                    {
                        value: "0",
                        text: "0",
                    },
                    {
                        value: "1",
                        text: "1",
                    },
                ]}
            />
            <SelectField
                name="select-2"
                label="select-2"
                options={[
                    {
                        value: "2",
                        text: "2",
                    },
                    {
                        value: "3",
                        text: "3",
                    },
                ]}
            />
        </Form>
    </>,
    document.getElementById("root")
);
