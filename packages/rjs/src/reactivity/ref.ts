import { reactive } from "./reactive";

export const ref = <T>(target: T): { value: T } =>
    reactive({ value: target });
