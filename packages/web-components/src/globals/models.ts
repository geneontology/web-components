export interface IRibbonGroup {
  id: string;
  label: string;
  description: string;
  type: "GlobalAll" | "All" | "Term" | "Other";
}

export interface IRibbonCategory {
  id: string;
  label: string;
  description: string;
  groups: IRibbonGroup[];
}

export interface IRibbonSubject {
  id: string;
  label: string;
  taxon_id: string;
  taxon_label: string;
  nb_classes: number;
  nb_annotations: number;
  groups: Record<string, never>;
}

export interface IRibbonModel {
  categories: IRibbonCategory[];
  subjects: IRibbonSubject[];
}

export interface IRibbonCellEvent {
  subjects: IRibbonSubject[];
  group: IRibbonGroup | null;
}

export interface IRibbonGroupEvent {
  category: IRibbonCategory;
  group: IRibbonGroup;
}

export interface ISuperCell {
  id?: string;
  headerId: string;
  clickable?: boolean;
  selectable?: boolean;
  foldable?: boolean;
  values: ICell[];
}

export interface ICell {
  id?: string;
  label: string;
  description?: string;
  url?: string;
  icon?: string;
  tags?: string[];
  selectable?: boolean;
}

export interface IHeaderCell extends ICell {
  baseURL?: string; // if defined, convert cell URL to use this baseURL
  hide?: boolean; // if true, won't show the column that would be considered only for treatment (eg grouping)
}

export interface IRow {
  foldable?: boolean;
  // id?: string;
  cells: ISuperCell[];
}

export interface ITable {
  header: IHeaderCell[];
  rows: IRow[];
  newTab?: boolean;
}

export interface TableDataNode {
  id: string;
  iri: string;
  label: string;
  category?: string[];
  taxon: {
    id: string;
    iri: string;
    label: string;
  };
}

export interface TableDataAssociation {
  id: string;
  subject: TableDataNode;
  object: TableDataNode;
  negated: boolean;
  qualifiers?: string[];
  evidence: string;
  evidence_label: string;
  evidence_type: string;
  evidence_with?: string[];
  reference: string[];
}
export interface TableDataEntry {
  subject: string;
  slim: string;
  assocs: TableDataAssociation[];
}
export type TableData = TableDataEntry[];

export type ColorByOption = "classes" | "annotations";

export type SubjectPositionOption = "none" | "left" | "right";

export type SelectionModeOption = "cell" | "column";

export type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";
