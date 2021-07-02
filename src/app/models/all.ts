
export interface Project {
    name: string;
    date: string;
    print?: PrintParams;
    decks?: Deck[];
}

export interface PrintParams {
    dpi: number;
    margins: number[];
    autoCenter: boolean;
}

export interface Deck {
    name: string;
    width: number;
    height: number;
    background: string;
    front: Elem[];
    back?: Elem[];
    data?: any[];
}

export interface Elem {
    type: ElemType;
    content: ContentText | ContentImage;
    position: ElemPosition;
    border?: ElemBorder;
    condition?: string;
}

export enum ElemType {
    text,
    image,
}

export interface ContentText {
    text: string;
    position: ContentPosition;
    fontSize: number;
    fontFamily: string;
    color: string;
}

export interface ContentImage {
    file: string;
    position: ContentPosition;
}

export enum ContentPosition {
    topLeft,
    topCenter,
    topRight,
    centerLeft,
    centerCenter,
    centerRight,
    bottomLeft,
    bottomCenter,
    bottomRight,
    stretch,
    fit,
    repeat,
}

export interface ElemPosition {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    opacity?: number;
    rotate?: number;
}
export interface ElemBorder {
    style?: string;
    size?: number;
    color?: string;
}
