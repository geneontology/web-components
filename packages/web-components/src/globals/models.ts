export interface IRibbonGroup {
  id: string;
  label: string;
  description: string;
  type: string;
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
  group: IRibbonGroup;
}

export interface IRibbonGroupEvent {
  subjects: IRibbonSubject[];
  category: IRibbonCategory;
  group: IRibbonGroup;
}

export interface IRibbonCellClick extends IRibbonCellEvent {
  selected: boolean[];
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
  clickable?: boolean;
  selectable?: boolean;
}

export interface IHeaderCell extends ICell {
  sortable?: boolean;
  searchable?: boolean;
  baseURL?: string; // if defined, convert cell URL to use this baseURL
  foldListThr?: number; // if defined, fold the cells that have more than X items
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
