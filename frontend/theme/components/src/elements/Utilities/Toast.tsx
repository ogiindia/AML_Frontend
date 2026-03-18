'use client';

import { AlertTriangle, Bell, CheckCircle, Info, XCircle } from 'lucide-react';
import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';


/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
function toast(toastData: Omit<ToastProps, 'id'>) {
    return sonnerToast.custom((id) => (
        <Toast
            id={id}
            title={toastData.title}
            description={toastData.description}
            variant={toastData.variant}
            icon={toastData.icon}
            button={
                toastData.button && {
                    label: toastData.button.label,
                    onClick: toastData.button.onClick,
                }
            }
        />
    ));
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ToastProps) {
    const { title, description, button, id, variant = 'default', icon } = props;

    const v = variantStyles[variant];

    return (
        <div
            className={`flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4 border ${v.border}`}
        >
            {/* Icon */}
            <div className="mr-3 flex-shrink-0">
                {icon ?? v.icon}
            </div>

            {/* Text */}
            <div className="flex flex-1 items-center">
                <div className="w-full">
                    {title && (
                        <p className="text-sm font-medium text-gray-900">{title}</p>
                    )}
                    {description && (
                        <p className="mt-1 text-sm text-gray-500">{description}</p>
                    )}
                </div>
            </div>

            {/* Button */}
            <div className="ml-5 shrink-0">
                {button && (
                    <button
                        className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
                        onClick={() => {
                            button.onClick();
                            sonnerToast.dismiss(id);
                        }}
                    >
                        {button.label}
                    </button>
                )}
            </div>
        </div>
    );
}


function Headless() {
    return (
        <button
            className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white"
            onClick={() => {
                toast({
                    title: 'This is a headless toast',
                    description: 'You have full control of styles and jsx, while still having the animations.',
                    button: {
                        label: 'Reply',
                        onClick: () => sonnerToast.dismiss(),
                    },
                });
            }}
        >
            Render toast
        </button>
    );
}

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    id: string | number;
    title?: string;
    description?: string;
    variant?: ToastVariant;
    icon?: React.ReactNode;
    button?: {
        label: string;
        onClick: () => void;
    };
}


const variantStyles = {
    default: {
        icon: <Bell className="h-5 w-5 text-gray-700" />,
        border: "border-gray-200",
    },
    success: {
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        border: "border-green-200",
    },
    error: {
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        border: "border-red-200",
    },
    warning: {
        icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
        border: "border-yellow-200",
    },
    info: {
        icon: <Info className="h-5 w-5 text-blue-600" />,
        border: "border-blue-200",
    },
} satisfies Record<ToastVariant, any>;


export {
    toast, Toaster
};

