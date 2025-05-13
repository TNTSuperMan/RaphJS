import { inspect } from "bun";
import { describe, expect, test } from "bun:test";
import { hook, ref } from "rjs/src";

describe("hook", () => {
    test("ref change", () => {
        const state = ref(0);
        const edits: number[] = [];
        hook(() => edits.push(state.value));
        state.value = 1;
        expect(edits).toEqual([0, 1]);
    })
    test("child change", () => {
        const state = ref({value: 0});
        const edits: number[] = [];
        hook(() => edits.push(state.value.value));
        state.value.value = 1;
        expect(edits).toEqual([0, 1]);
    })
    test("child hard change", () => {
        const state = ref({value: 0});
        const edits: number[] = [];
        hook(() => edits.push(state.value.value));
        state.value = { value: 1 };
        expect(edits).toEqual([0, 1]);
    })
    test("descendant change", () => {
        const state = ref({value: { value: 0 }});
        const edits: number[] = [];
        hook(() => edits.push(state.value.value.value));
        state.value.value.value = 1;
        expect(edits).toEqual([0, 1]);
    })
    test("descendant hard change", () => {
        const state = ref({value: { value: 0 }});
        const edits: number[] = [];
        hook(() => edits.push(state.value.value.value));
        state.value = { value: { value: 1 } };
        expect(edits).toEqual([0, 1]);
    })
})
