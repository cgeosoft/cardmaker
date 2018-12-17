
export interface Project {
    name: string;
    date: Date;
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
    width: string;
    height: string;
    background: string;
    front: Elem[];
    back?: Elem[];
    data?: any[];
}

export interface Elem {
    type: ElemType;
    content: ContentText | ContentImage;
    position: ElemPosition;
    border: ElemBorder;
    condition: string;
}

export enum ElemType {
    text,
    image,
}

export interface ContentText {
    text: string;
    position: ElemPosition;
    font: string;
    color: string;
}

export interface ContentImage {
    file: string;
    position: ElemPosition;
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
    fit
}

export interface ElemPosition {
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
    rotate: number;
}
export interface ElemBorder {
    style: string;
    size: number;
    color: string;
}
