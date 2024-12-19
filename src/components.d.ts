/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { RibbonGroup, RibbonModel, RibbonSubject } from "./globals/models";
export { RibbonGroup, RibbonModel, RibbonSubject } from "./globals/models";
export namespace Components {
  interface WcGoAutocomplete {
    /**
     * Category to constrain the search; by default search "gene" Other values accepted: `undefined` : search both terms and genes `gene` : will only search genes used in GO `biological%20process` : will search for GO BP terms `molecular%20function` : will search for GO MF terms `cellular%20component` : will search for GO CC terms `cellular%20component,molecular%20function,biological%20process` : will search any GO term
     */
    category: string;
    /**
     * Maximum number of results to show
     */
    maxResults: number;
    /**
     * Default placeholder for the autocomplete
     */
    placeholder: string;
    value: string;
  }
  interface WcLightModal {
    close: () => Promise<void>;
    modalAnchor: string;
    modalContent: string;
    modalTitle: string;
    open: () => Promise<void>;
    toggle: () => Promise<void>;
    x: number;
    y: number;
  }
  interface WcRibbonCell {
    annotationLabels: string;
    /**
     * If set to true, won't show any color and can not be hovered or selected This is used for group that can not have annotation for a given subject
     */
    available: boolean;
    binaryColor: boolean;
    classLabels: string;
    colorBy: number;
    group: RibbonGroup;
    hovered: boolean;
    maxColor: string;
    maxHeatLevel: number;
    minColor: string;
    selected: boolean;
    subject: RibbonSubject;
  }
  interface WcRibbonStrips {
    /**
     * add a cell at the beginning of each row/subject to show all annotations
     */
    addCellAll: boolean;
    annotationLabels: string;
    baseApiUrl: string;
    /**
     * false = show a gradient of colors to indicate the value of a cell true = show only two colors (minColor; maxColor) to indicate the values of a cell
     */
    binaryColor: boolean;
    /**
     * 0 = Normal 1 = Bold
     */
    categoryAllStyle: number;
    /**
     * Override of the category case 0 (default) = unchanged 1 = to lower case 2 = to upper case
     */
    categoryCase: number;
    /**
     * 0 = Normal 1 = Bold
     */
    categoryOtherStyle: number;
    classLabels: string;
    /**
     * Which value to base the cell color on 0 = class count 1 = annotation count
     */
    colorBy: number;
    /**
     * if provided, will override any value provided in subjects and subset
     */
    data: string;
    /**
     * If true, the ribbon will fire an event if a user click an empty cell If false, the ribbon will not fire the event on an empty cell Note: if selectionMode == SELECTION.COLUMN, then the event will trigger if at least one of the selected cells has annotations
     */
    fireEventOnEmptyCells: boolean;
    groupBaseUrl: string;
    groupClickable: boolean;
    groupMaxLabelSize: number;
    groupNewTab: boolean;
    maxColor: string;
    maxHeatLevel: number;
    minColor: string;
    ribbonSummary: RibbonModel;
    selectGroup: (group_id: any) => Promise<void>;
    /**
     * If no value is provided, the ribbon will load without any group selected. If a value is provided, the ribbon will show the requested group as selected The value should be the id of the group to be selected
     */
    selected: any;
    /**
     * Click handling of a cell. 0 = select only the cell (1 subject, 1 group) 1 = select the whole column (all subjects, 1 group)
     */
    selectionMode: number;
    showOtherGroup: boolean;
    subjectBaseUrl: string;
    subjectOpenNewTab: boolean;
    /**
     * Position the subject label of each row 0 = None 1 = Left 2 = Right 3 = Bottom
     */
    subjectPosition: number;
    subjectUseTaxonIcon: boolean;
    /**
     * provide gene ids (e.g. RGD:620474,RGD:3889 or as a list ["RGD:620474", "RGD:3889"])
     */
    subjects: string;
    subset: string;
    /**
     * When this is set to false, changing the subjects Prop won't trigger the reload of the ribbon This is necessary when the ribbon is showing data other than GO or not using the internal fetchData mechanism
     */
    updateOnSubjectChange: boolean;
  }
  interface WcRibbonSubject {
    newTab: boolean;
    subject: {
      id: string;
      label: string;
      taxon_id: string;
      taxon_label: string;
      nb_classes: number;
      nb_annotations: number;
      groups: [{}];
    };
    subjectBaseURL: string;
  }
  interface WcRibbonTable {
    baseApiUrl: string;
    /**
     * Reading biolink data. This will trigger a render of the table as would changing data
     */
    bioLinkData: string;
    /**
     * Must follow the appropriate JSON data model Can be given as either JSON or stringified JSON
     */
    data: string;
    /**
     * Filter rows based on the presence of one or more values in a given column The filtering will be based on cell label or id Example: filter-by="evidence:ISS,ISO or multi-step filters: filter-by:evidence:ISS,ISO;term:xxx" Note: if value is "", remove any filtering
     */
    filterBy: string;
    groupBaseUrl: string;
    /**
     * Using this parameter, the table rows can bee grouped based on column ids A multiple step grouping is possible by using a ";" between groups The grouping applies before the ordering Example: hid-1,hid-3 OR hid-1,hid-3;hid-2 Note: if value is "", remove any grouping
     */
    groupBy: string;
    /**
     * Used to hide specific column of the table
     */
    hideColumns: string;
    /**
     * This is used to sort the table depending of a column The column cells must be single values The ordering applies after the grouping Note: if value is "", remove any ordering
     */
    orderBy: string;
    showCurie: () => Promise<void>;
    showDBXrefs: () => Promise<void>;
    showOriginalTable: () => Promise<void>;
    showTable: () => Promise<void>;
    subjectBaseUrl: string;
  }
  interface WcSpinner {
    /**
     * Define the color of the spinner. This parameter is optional and will override any declared CSS variable
     */
    spinnerColor: string;
    /**
     * Define the size of the spinner (TO DO).
     */
    spinnerSize: number;
    /**
     * Define the style of the spinner. Accepted values: default, spinner, circle, ring, dual-ring, roller, ellipsis, grid, hourglass, ripple, facebook, heart
     */
    spinnerStyle: string;
  }
}
export interface WcGoAutocompleteCustomEvent<T> extends CustomEvent<T> {
  detail: T;
  target: HTMLWcGoAutocompleteElement;
}
export interface WcRibbonStripsCustomEvent<T> extends CustomEvent<T> {
  detail: T;
  target: HTMLWcRibbonStripsElement;
}
export interface WcRibbonSubjectCustomEvent<T> extends CustomEvent<T> {
  detail: T;
  target: HTMLWcRibbonSubjectElement;
}
declare global {
  interface HTMLWcGoAutocompleteElementEventMap {
    itemSelected: any;
  }
  interface HTMLWcGoAutocompleteElement
    extends Components.WcGoAutocomplete,
      HTMLStencilElement {
    addEventListener<K extends keyof HTMLWcGoAutocompleteElementEventMap>(
      type: K,
      listener: (
        this: HTMLWcGoAutocompleteElement,
        ev: WcGoAutocompleteCustomEvent<HTMLWcGoAutocompleteElementEventMap[K]>,
      ) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof DocumentEventMap>(
      type: K,
      listener: (this: Document, ev: DocumentEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLWcGoAutocompleteElementEventMap>(
      type: K,
      listener: (
        this: HTMLWcGoAutocompleteElement,
        ev: WcGoAutocompleteCustomEvent<HTMLWcGoAutocompleteElementEventMap[K]>,
      ) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof DocumentEventMap>(
      type: K,
      listener: (this: Document, ev: DocumentEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void;
  }
  var HTMLWcGoAutocompleteElement: {
    prototype: HTMLWcGoAutocompleteElement;
    new (): HTMLWcGoAutocompleteElement;
  };
  interface HTMLWcLightModalElement
    extends Components.WcLightModal,
      HTMLStencilElement {}
  var HTMLWcLightModalElement: {
    prototype: HTMLWcLightModalElement;
    new (): HTMLWcLightModalElement;
  };
  interface HTMLWcRibbonCellElement
    extends Components.WcRibbonCell,
      HTMLStencilElement {}
  var HTMLWcRibbonCellElement: {
    prototype: HTMLWcRibbonCellElement;
    new (): HTMLWcRibbonCellElement;
  };
  interface HTMLWcRibbonStripsElementEventMap {
    cellClick: any;
    cellEnter: any;
    cellLeave: any;
    groupClick: any;
    groupEnter: any;
    groupLeave: any;
  }
  interface HTMLWcRibbonStripsElement
    extends Components.WcRibbonStrips,
      HTMLStencilElement {
    addEventListener<K extends keyof HTMLWcRibbonStripsElementEventMap>(
      type: K,
      listener: (
        this: HTMLWcRibbonStripsElement,
        ev: WcRibbonStripsCustomEvent<HTMLWcRibbonStripsElementEventMap[K]>,
      ) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof DocumentEventMap>(
      type: K,
      listener: (this: Document, ev: DocumentEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLWcRibbonStripsElementEventMap>(
      type: K,
      listener: (
        this: HTMLWcRibbonStripsElement,
        ev: WcRibbonStripsCustomEvent<HTMLWcRibbonStripsElementEventMap[K]>,
      ) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof DocumentEventMap>(
      type: K,
      listener: (this: Document, ev: DocumentEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void;
  }
  var HTMLWcRibbonStripsElement: {
    prototype: HTMLWcRibbonStripsElement;
    new (): HTMLWcRibbonStripsElement;
  };
  interface HTMLWcRibbonSubjectElementEventMap {
    subjectClick: any;
  }
  interface HTMLWcRibbonSubjectElement
    extends Components.WcRibbonSubject,
      HTMLStencilElement {
    addEventListener<K extends keyof HTMLWcRibbonSubjectElementEventMap>(
      type: K,
      listener: (
        this: HTMLWcRibbonSubjectElement,
        ev: WcRibbonSubjectCustomEvent<HTMLWcRibbonSubjectElementEventMap[K]>,
      ) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof DocumentEventMap>(
      type: K,
      listener: (this: Document, ev: DocumentEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLWcRibbonSubjectElementEventMap>(
      type: K,
      listener: (
        this: HTMLWcRibbonSubjectElement,
        ev: WcRibbonSubjectCustomEvent<HTMLWcRibbonSubjectElementEventMap[K]>,
      ) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof DocumentEventMap>(
      type: K,
      listener: (this: Document, ev: DocumentEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(
      type: K,
      listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void;
  }
  var HTMLWcRibbonSubjectElement: {
    prototype: HTMLWcRibbonSubjectElement;
    new (): HTMLWcRibbonSubjectElement;
  };
  interface HTMLWcRibbonTableElement
    extends Components.WcRibbonTable,
      HTMLStencilElement {}
  var HTMLWcRibbonTableElement: {
    prototype: HTMLWcRibbonTableElement;
    new (): HTMLWcRibbonTableElement;
  };
  interface HTMLWcSpinnerElement
    extends Components.WcSpinner,
      HTMLStencilElement {}
  var HTMLWcSpinnerElement: {
    prototype: HTMLWcSpinnerElement;
    new (): HTMLWcSpinnerElement;
  };
  interface HTMLElementTagNameMap {
    "wc-go-autocomplete": HTMLWcGoAutocompleteElement;
    "wc-light-modal": HTMLWcLightModalElement;
    "wc-ribbon-cell": HTMLWcRibbonCellElement;
    "wc-ribbon-strips": HTMLWcRibbonStripsElement;
    "wc-ribbon-subject": HTMLWcRibbonSubjectElement;
    "wc-ribbon-table": HTMLWcRibbonTableElement;
    "wc-spinner": HTMLWcSpinnerElement;
  }
}
declare namespace LocalJSX {
  interface WcGoAutocomplete {
    /**
     * Category to constrain the search; by default search "gene" Other values accepted: `undefined` : search both terms and genes `gene` : will only search genes used in GO `biological%20process` : will search for GO BP terms `molecular%20function` : will search for GO MF terms `cellular%20component` : will search for GO CC terms `cellular%20component,molecular%20function,biological%20process` : will search any GO term
     */
    category?: string;
    /**
     * Maximum number of results to show
     */
    maxResults?: number;
    /**
     * Event triggered whenever an item is selected from the autocomplete
     */
    onItemSelected?: (event: WcGoAutocompleteCustomEvent<any>) => void;
    /**
     * Default placeholder for the autocomplete
     */
    placeholder?: string;
    value?: string;
  }
  interface WcLightModal {
    modalAnchor?: string;
    modalContent?: string;
    modalTitle?: string;
    x?: number;
    y?: number;
  }
  interface WcRibbonCell {
    annotationLabels?: string;
    /**
     * If set to true, won't show any color and can not be hovered or selected This is used for group that can not have annotation for a given subject
     */
    available?: boolean;
    binaryColor?: boolean;
    classLabels?: string;
    colorBy?: number;
    group?: RibbonGroup;
    hovered?: boolean;
    maxColor?: string;
    maxHeatLevel?: number;
    minColor?: string;
    selected?: boolean;
    subject?: RibbonSubject;
  }
  interface WcRibbonStrips {
    /**
     * add a cell at the beginning of each row/subject to show all annotations
     */
    addCellAll?: boolean;
    annotationLabels?: string;
    baseApiUrl?: string;
    /**
     * false = show a gradient of colors to indicate the value of a cell true = show only two colors (minColor; maxColor) to indicate the values of a cell
     */
    binaryColor?: boolean;
    /**
     * 0 = Normal 1 = Bold
     */
    categoryAllStyle?: number;
    /**
     * Override of the category case 0 (default) = unchanged 1 = to lower case 2 = to upper case
     */
    categoryCase?: number;
    /**
     * 0 = Normal 1 = Bold
     */
    categoryOtherStyle?: number;
    classLabels?: string;
    /**
     * Which value to base the cell color on 0 = class count 1 = annotation count
     */
    colorBy?: number;
    /**
     * if provided, will override any value provided in subjects and subset
     */
    data?: string;
    /**
     * If true, the ribbon will fire an event if a user click an empty cell If false, the ribbon will not fire the event on an empty cell Note: if selectionMode == SELECTION.COLUMN, then the event will trigger if at least one of the selected cells has annotations
     */
    fireEventOnEmptyCells?: boolean;
    groupBaseUrl?: string;
    groupClickable?: boolean;
    groupMaxLabelSize?: number;
    groupNewTab?: boolean;
    maxColor?: string;
    maxHeatLevel?: number;
    minColor?: string;
    /**
     * This event is triggered whenever a ribbon cell is clicked
     */
    onCellClick?: (event: WcRibbonStripsCustomEvent<any>) => void;
    /**
     * This event is triggered whenever the mouse enters a cell area
     */
    onCellEnter?: (event: WcRibbonStripsCustomEvent<any>) => void;
    /**
     * This event is triggered whenever the mouse leaves a cell area
     */
    onCellLeave?: (event: WcRibbonStripsCustomEvent<any>) => void;
    /**
     * This event is triggered whenever a group cell is clicked
     */
    onGroupClick?: (event: WcRibbonStripsCustomEvent<any>) => void;
    /**
     * This event is triggered whenever the mouse enters a group cell area
     */
    onGroupEnter?: (event: WcRibbonStripsCustomEvent<any>) => void;
    /**
     * This event is triggered whenever the mouse leaves a group cell area
     */
    onGroupLeave?: (event: WcRibbonStripsCustomEvent<any>) => void;
    ribbonSummary?: RibbonModel;
    /**
     * If no value is provided, the ribbon will load without any group selected. If a value is provided, the ribbon will show the requested group as selected The value should be the id of the group to be selected
     */
    selected?: any;
    /**
     * Click handling of a cell. 0 = select only the cell (1 subject, 1 group) 1 = select the whole column (all subjects, 1 group)
     */
    selectionMode?: number;
    showOtherGroup?: boolean;
    subjectBaseUrl?: string;
    subjectOpenNewTab?: boolean;
    /**
     * Position the subject label of each row 0 = None 1 = Left 2 = Right 3 = Bottom
     */
    subjectPosition?: number;
    subjectUseTaxonIcon?: boolean;
    /**
     * provide gene ids (e.g. RGD:620474,RGD:3889 or as a list ["RGD:620474", "RGD:3889"])
     */
    subjects?: string;
    subset?: string;
    /**
     * When this is set to false, changing the subjects Prop won't trigger the reload of the ribbon This is necessary when the ribbon is showing data other than GO or not using the internal fetchData mechanism
     */
    updateOnSubjectChange?: boolean;
  }
  interface WcRibbonSubject {
    newTab?: boolean;
    /**
     * This event is triggered whenever a subject label is clicked Can call preventDefault() to avoid the default behavior (opening the linked subject page)
     */
    onSubjectClick?: (event: WcRibbonSubjectCustomEvent<any>) => void;
    subject?: {
      id: string;
      label: string;
      taxon_id: string;
      taxon_label: string;
      nb_classes: number;
      nb_annotations: number;
      groups: [{}];
    };
    subjectBaseURL?: string;
  }
  interface WcRibbonTable {
    baseApiUrl?: string;
    /**
     * Reading biolink data. This will trigger a render of the table as would changing data
     */
    bioLinkData?: string;
    /**
     * Must follow the appropriate JSON data model Can be given as either JSON or stringified JSON
     */
    data?: string;
    /**
     * Filter rows based on the presence of one or more values in a given column The filtering will be based on cell label or id Example: filter-by="evidence:ISS,ISO or multi-step filters: filter-by:evidence:ISS,ISO;term:xxx" Note: if value is "", remove any filtering
     */
    filterBy?: string;
    groupBaseUrl?: string;
    /**
     * Using this parameter, the table rows can bee grouped based on column ids A multiple step grouping is possible by using a ";" between groups The grouping applies before the ordering Example: hid-1,hid-3 OR hid-1,hid-3;hid-2 Note: if value is "", remove any grouping
     */
    groupBy?: string;
    /**
     * Used to hide specific column of the table
     */
    hideColumns?: string;
    /**
     * This is used to sort the table depending of a column The column cells must be single values The ordering applies after the grouping Note: if value is "", remove any ordering
     */
    orderBy?: string;
    subjectBaseUrl?: string;
  }
  interface WcSpinner {
    /**
     * Define the color of the spinner. This parameter is optional and will override any declared CSS variable
     */
    spinnerColor?: string;
    /**
     * Define the size of the spinner (TO DO).
     */
    spinnerSize?: number;
    /**
     * Define the style of the spinner. Accepted values: default, spinner, circle, ring, dual-ring, roller, ellipsis, grid, hourglass, ripple, facebook, heart
     */
    spinnerStyle?: string;
  }
  interface IntrinsicElements {
    "wc-go-autocomplete": WcGoAutocomplete;
    "wc-light-modal": WcLightModal;
    "wc-ribbon-cell": WcRibbonCell;
    "wc-ribbon-strips": WcRibbonStrips;
    "wc-ribbon-subject": WcRibbonSubject;
    "wc-ribbon-table": WcRibbonTable;
    "wc-spinner": WcSpinner;
  }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      "wc-go-autocomplete": LocalJSX.WcGoAutocomplete &
        JSXBase.HTMLAttributes<HTMLWcGoAutocompleteElement>;
      "wc-light-modal": LocalJSX.WcLightModal &
        JSXBase.HTMLAttributes<HTMLWcLightModalElement>;
      "wc-ribbon-cell": LocalJSX.WcRibbonCell &
        JSXBase.HTMLAttributes<HTMLWcRibbonCellElement>;
      "wc-ribbon-strips": LocalJSX.WcRibbonStrips &
        JSXBase.HTMLAttributes<HTMLWcRibbonStripsElement>;
      "wc-ribbon-subject": LocalJSX.WcRibbonSubject &
        JSXBase.HTMLAttributes<HTMLWcRibbonSubjectElement>;
      "wc-ribbon-table": LocalJSX.WcRibbonTable &
        JSXBase.HTMLAttributes<HTMLWcRibbonTableElement>;
      "wc-spinner": LocalJSX.WcSpinner &
        JSXBase.HTMLAttributes<HTMLWcSpinnerElement>;
    }
  }
}
