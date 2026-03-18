import React, { useRef, useState } from "react";
import { OverlayTrigger } from "react-bootstrap";
import { Question } from "react-bootstrap-icons";

function FormToolTip({ tooltip, id }) {
    const [show, setShow] = useState(true);
    const target = useRef(null);

    return (<>
        {tooltip && (
            <>
                <span className={`form-control-tooltip`}>
                    <OverlayTrigger
                        key={id}
                        overlay={
                            <tooltip key={id} id="tooltip-top">
                                {tooltip}
                            </tooltip>
                        }
                    >
                        <span className="d-inline-block">
                            <Question
                                className="ml-4 fis-primary"
                                size={20}
                                onClick={() => setShow(!show)}
                                ref={target}
                            />
                        </span>
                    </OverlayTrigger>
                </span>
            </>
        )}
    </>);
}

export default FormToolTip;