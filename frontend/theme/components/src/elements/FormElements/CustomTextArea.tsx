import * as React from 'react';
import { Col } from "../../components/ui/Col";
import { Label } from "../../components/ui/label";
import { Row } from "../../components/ui/Row";
import { Textarea } from "../../components/ui/textarea";
import { InlineStatusText, InputHelper } from "../Typography";
import { CustomInputProps } from "./FormProps";


export function CustomTextArea({
    id,
    type,
    name,
    className,
    onChange,
    label,
    isError = false,
    tooltip,
    direction = 'row',
    disabled = false,
    error = null,
    value,
    gap = '3',
    ...props
}: CustomInputProps) {
    if (error) isError = true;

    if (!id) id = name;

    return (
        <div>
            <Row gap={gap}>
                <Col span="12">
                    <Label data-error={isError} htmlFor={id}>
                        {label}
                    </Label>
                </Col>
                <Col span="12">
                    <Row gap={'1'}>
                        <Col padding={false} span="12">
                            {/* <Input
                                aria-invalid={isError}
                                type={type}
                                name={name}
                                className={className}
                                onChange={onChange}
                                disabled={disabled}
                                id={id}
                                value={value}
                                {...props}
                            /> */}

                            <Textarea aria-invalid={isError}
                                name={name}
                                className={className}
                                onChange={onChange}
                                disabled={disabled}
                                id={id}
                                value={value}
                                {...props}
                            />
                        </Col>

                        {tooltip && (
                            <Col padding={false} span="12">
                                <InputHelper text={tooltip} />
                            </Col>
                        )}
                    </Row>
                </Col>
                {error && (
                    <Col span="12">
                        <InlineStatusText text={error} type="error" />
                    </Col>
                )}
            </Row>
        </div>
    );
}

