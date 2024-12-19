export class RibbonGroup {
  id: string;
  label: string;
  description: string;
  type: string;
}

export class RibbonCategory {
  id: string;
  label: string;
  description: string;
  groups: [RibbonGroup];
}

export class RibbonSubject {
  id: string;
  label: string;
  taxon_id: string;
  taxon_label: string;
  nb_classes: number;
  nb_annotations: number;
  groups: [{}];
}

export class RibbonModel {
  categories: [RibbonCategory];
  subjects: [RibbonSubject];
}

export class RibbonCellEvent {
  subjects: [RibbonSubject];
  group: RibbonGroup;
}

export class RibbonGroupEvent {
  subjects: [RibbonSubject];
  category: RibbonCategory;
  group: RibbonGroup;
}

export class RibbonCellClick extends RibbonCellEvent {
  selected: boolean[];
}

export class SuperCell {
  id?: string;
  headerId: string;
  clickable?: boolean;
  selectable?: boolean;
  foldable?: boolean;
  values: Cell[];
}

export class Cell {
  id?: string;
  label: string;
  description?: string;
  url?: string;
  icon?: string;
  tags?: string[];
  clickable?: boolean;
  selectable?: boolean;
}

export class HeaderCell extends Cell {
  sortable?: boolean;
  searchable?: boolean;
  baseURL?: string; // if defined, convert cell URL to use this baseURL
  foldListThr?: number; // if defined, fold the cells that have more than X items
  hide?: boolean; // if true, won't show the column that would be considered only for treatment (eg grouping)
}

// export class RowCell extends Cell {
//     headerId: string;
// }

export class Row {
  foldable?: boolean;
  // id?: string;
  cells: SuperCell[];
}

export class Table {
  header: HeaderCell[];
  rows: Row[];
  newTab?: boolean;
}
