import * as React from 'react';

export function KeyvalueBlock({ label, value }) {
    const hasValue =
        value !== undefined && value !== null && value !== ""
    return (<>
        <div className="flex flex-col divide-y divide-muted/30">

            <div
                key={label}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
                <span className="text-sm font-medium text-muted-foreground">
                    {label}
                </span>

                <span className="text-sm font-semibold text-foreground">
                    {value ?? "—"}
                </span>
            </div>

        </div>
    </>);
}
