import type { Expression, Node } from "acorn";

export interface JSXText extends Node{
    type: "JSXText",
    value: string,
    raw: string
}

export interface JSXExpressionContainer extends Node{
    type: "JSXExpressionContainer"
    expression: Expression
}

export type JSXChild =
    JSXText |
    JSXElement |
    JSXExpressionContainer | 
    JSXFragment;

export interface JSXIdentifier extends Node{
    type: "JSXIdentifier"
    name: string
}

export interface JSXAttribute extends Node{
    type: "JSXAttribute"
    name: JSXIdentifier
    value: Expression | JSXExpressionContainer
}

export interface JSXOpeningElement extends Node{
    type: "JSXOpeningElement"
    name: JSXIdentifier
    attributes: JSXAttribute[]
    selfClosing: boolean
}

export interface JSXClosingElement extends Node{
    type: "JSXClosingElement"
    name: JSXIdentifier
}

export interface JSXElement extends Node{
    type: "JSXElement"
    openingElement: JSXOpeningElement
    closingElement: JSXClosingElement | null
    children: JSXChild[]
}

export interface JSXOpeningFragment extends Node{
    type: "JSXOpeningFragment"
    attributes: JSXAttribute[]
    selfClosing: boolean
}

export interface JSXClosingFragment extends Node{
    type: "JSXClosingFragment"
}

export interface JSXFragment extends Node{
    type: "JSXFragment"
    openingFragment: JSXOpeningFragment
    closingFragment: JSXClosingFragment
    children: JSXChild[]
}
