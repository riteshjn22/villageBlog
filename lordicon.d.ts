import React from "react";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "lord-icon": {
                src?: string;
                trigger?: string;
                stroke?: string;
                colors?: string;
                target?: string;
                state?: string;
                delay?: string | number;
                style?: React.CSSProperties;
                class?: string;
                children?: React.ReactNode;
            };
        }
    }
}