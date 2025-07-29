export interface RibbonGroup {
  id: string;
  label: string;
  description: string;
  type: "GlobalAll" | "All" | "Term" | "Other";
}

export interface RibbonCategory {
  id: string;
  label: string;
  description: string;
  groups: RibbonGroup[];
}

export interface RibbonGroupCounts {
  nb_classes: number;
  nb_annotations: number;
}

// The key of this record is an evidence type, e.g. "IEA", "EXP", or "ALL". There may also be a
// special "available" key that indicates whether the group is available for the subject.
export type RibbonSubjectGroupCounts = Record<string, RibbonGroupCounts> & {
  available?: boolean;
};

export interface RibbonSubject extends RibbonGroupCounts {
  id: string;
  label: string;
  taxon_id: string;
  taxon_label: string;
  // The key of this record is a group id, e.g. "GO:0008150"
  groups: Record<string, RibbonSubjectGroupCounts>;
}

export interface RibbonData {
  categories: RibbonCategory[];
  subjects: RibbonSubject[];
}

export interface RibbonCellEvent {
  subjects: RibbonSubject[];
  group: RibbonGroup | null;
}

export interface RibbonGroupEvent {
  category: RibbonCategory;
  group: RibbonGroup;
}

export interface DisplaySuperCell {
  id?: string;
  headerId: string;
  clickable?: boolean;
  selectable?: boolean;
  foldable?: boolean;
  values: DisplayCell[];
}

export interface DisplayCell {
  id?: string;
  label: string;
  description?: string;
  url?: string;
  icon?: string;
  tags?: string[];
  selectable?: boolean;
}

export interface DisplayHeaderCell extends DisplayCell {
  baseURL?: string; // if defined, convert cell URL to use this baseURL
  hide?: boolean; // if true, won't show the column that would be considered only for treatment (eg grouping)
}

export interface DisplayRow {
  foldable?: boolean;
  // id?: string;
  cells: DisplaySuperCell[];
}

export interface DisplayTable {
  header: DisplayHeaderCell[];
  rows: DisplayRow[];
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
