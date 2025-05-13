import type { HTMLElAttrEvMap } from "./eventmap";

export type Attributes<T extends object = {}> = Partial<{
    id: string;
    class: string;
} & {
    [key in keyof HTMLElAttrEvMap]:
        (this: HTMLElement, ev: HTMLElAttrEvMap[key]) => unknown;
} & T>;
