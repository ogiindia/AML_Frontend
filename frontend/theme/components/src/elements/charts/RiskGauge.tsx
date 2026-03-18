import * as React from 'react';
import { cn } from "../../lib/utils";



export function RiskBadge({ score }: { score: number }) {
    let label = "";
    let color = "";

    if (score >= 80) {
        label = "High";
        color = "bg-red-100 text-red-600 border-red-200";
    } else if (score >= 40) {
        label = "Medium";
        color = "bg-yellow-100 text-yellow-700 border-yellow-200";
    } else {
        label = "Low";
        color = "bg-green-100 text-green-700 border-green-200";
    }

    return (
        <span
            className={cn(
                "inline-block px-3 py-1 text-sm rounded-full border font-medium",
                color
            )}
        >
            {score} ({label})
        </span>
    );
}



export function RiskScoreSlider({ score, sliderOnly = false, label = "Risk Score" }: { score: number, sliderOnly: boolean, label: string }) {
    const getColor = (value: number) => {
        if (value <= 25) return "bg-green-500"
        if (value <= 50) return "bg-yellow-500"
        if (value <= 75) return "bg-orange-500"
        return "bg-red-500"
    }

    if (sliderOnly) {
        return (
            <div className="relative w-full h-2 rounded-full bg-muted">
                {/* colored progress bar */}
                <div
                    className={cn("h-2 rounded-full transition-all", getColor(score))}
                    style={{ width: `${score}%` }}
                    title={`${score}%`}
                />
            </div>
        );
    } else {
        return (
            <div className="w-full">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                        {label}
                    </span>
                    <span className="text-sm font-semibold">{score}/100</span>
                </div>

                <div className="relative w-full h-2 rounded-full bg-muted">
                    {/* colored progress bar */}
                    <div
                        className={cn("h-2 rounded-full transition-all", getColor(score))}
                        style={{ width: `${score}%` }}
                        title={`${score}%`}
                    />
                </div>

                {/* <Slider
                value={[score]}
                max={100}
                disabled
                className="mt-3 cursor-default opacity-0 absolute pointer-events-none"
            /> */}
            </div>
        )
    }
}
