import type { Attributes } from "./attributes";

declare global {
    namespace JSX {
        type Element = ParentNode;
        interface IntrinsicElements {
            a: Attributes;
            div: Attributes;
            button: Attributes;
            ul: Attributes;
            li: Attributes;
            input: Attributes<{
                type: string;
                value: string;
                checked: boolean;
            }>;
        }
    }    
}
