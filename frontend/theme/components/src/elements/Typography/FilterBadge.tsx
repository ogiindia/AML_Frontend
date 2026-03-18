import { cn } from "../../lib/utils";

import * as React from 'react';


export function FilterBadge({
    label,
    count,
    active = false,
    onClick,
}: {
    label: string;
    count: number;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium transition-colors cursor-pointer",
                active
                    ? "bg-primary/75 text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
            )}
        >
            <span>{label}</span>

            <span
                className={cn(
                    "text-xs px-2 py-[2px] rounded-full border",
                    active
                        ? "bg-primary/80 text-primary-foreground border-primary/70"
                        : "bg-accent text-foreground border-border"
                )}
            >
                {count}
            </span>
        </button>
    );
}
