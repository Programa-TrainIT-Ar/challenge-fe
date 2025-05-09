export interface Cell {
    id: number;
    name: string;
  }
  
  export interface Module {
  id: number;
  name: string;
  cell: Cell[]
}

export interface Seniority {
  class: string;
  name: string;
}
