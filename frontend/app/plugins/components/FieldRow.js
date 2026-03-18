import { Col, CustomCheckbox, CustomInput, CustomSelect, IconButton, Row } from "@ais/components";
import * as React from 'react';


function FieldRow({ index, fieldName, fieldType, alias, active, setfieldMaster, catalogTypes, id }) {
    const [loading, setloading] = React.useState();
    const isCustomFunction = fieldType === 'CUSTOM_FUNCTION';
    return (
        <Row gap={`0`} key={index} className={`bg-white p-2 m-2 border-b`} align={`center`}>
            <Col padding={false} span={'2'}>
                <CustomInput
                    name={`fieldName`}
                    value={fieldName}
                    gap={'0'}
                    onChange={(e) => {
                        const { name, value } = e.target;
                        setfieldMaster(prev => prev.map((item, i) => i === index ? { ...item, 'name': value } : item))
                    }}
                    placeholder="Field name"
                />
            </Col>
            <Col padding={false} span={`2`}>
                <CustomSelect
                    value={fieldType}
                    data={
                        catalogTypes
                    }
                    placeholder={`Select a type`}
                    onChange={(e) => {
                        const { name, value } = e.target;
                        setfieldMaster(prev => prev.map((item, i) => i === index ? { ...item, type: { id: value } } : item))
                    }}
                />
            </Col>

            <Col padding={false} span={`2`}>
                <CustomInput
                    placeholder="Alias name"
                    gap={'0'}
                    value={alias}
                    padding={false}
                    onChange={(e) => {
                        const { name, value } = e.target;
                        setfieldMaster(prev => prev.map((item, i) => i === index ? { ...item, alias: value } : item))
                    }}
                />
            </Col>

            <Col padding={false} span={`2`} className={`justify-center flex`}>
                <CustomCheckbox value={active} onChange={(e) => {
                    const { name, value } = e.target;
                    setfieldMaster(prev => prev.map((item, i) => i === index ? { ...item, active: value } : item))
                }} />
            </Col>

            <Col padding={false} span={`1`} className={`justify-center flex`}>
                <IconButton
                    icon={`Trash2`}
                    className={`text-destructive`}
                    onClick={() => setfieldMaster(prev => prev.filter((_, i) => i !== index))}
                ></IconButton>
            </Col>

            {isCustomFunction && (
                <Col
                    span={`12`}
                    padding={false}
                    className="bg-muted border-b last:border-none mt-2"
                >
                    {/* <CustomFunctionEditor /> */}

                    <div className={`p-2`}>
                        <label className="text-sm font-medium text-muted-foreground block mb-1">
                            Custom Function for{' '}
                            <span className="text-primary font-semibold">{fieldName}</span>
                        </label>
                        <textarea
                            width={100}
                            placeholder="e.g., (firstName, lastName) => `${firstName} ${lastName}`"
                            className="text-sm bg-white"
                            style={{
                                width: '100%',
                                height: '125px',
                            }}
                        />
                    </div>
                </Col>
            )}
        </Row>
    );
}

export default FieldRow;