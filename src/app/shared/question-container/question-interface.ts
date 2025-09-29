export interface ResponseQuestion {
    id:string,
    question:string,
    seniority: string,
    type: string,
    options: string[],
    correct_option: number[],
    explanation: string,
    link: string,
    is_active: boolean,
    created_at: Date
    updated_at: Date
    quiz_id: string
  }

export interface Question {
  id?: string,
    questionNumber: number,
    question: string,
    type: string,
    options: string[],
    correct_option: number[],
  seniority?: string,
}

export interface UpdateQuizRequest{
  name: string,
  description: string
  cell_id: string,
  seniority: string,
  challenge_type: string,
  max_time: number,
  created_by_id: string,
  is_active: boolean,
  questions: Question[]
}

export interface Quiz {
  id: string;
  name: string;
  description: string;
  cell_id: string;
  cell: Cell;
  seniority: string;
  challenge_type: string;
  max_time: number;
  created_by_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  questions: ResponseQuestion[];

}
export interface Cell {
  id: string;
  name: string;
  is_active: boolean;
  module_id: string;
  created_at: string;
  updated_at: string;
  module: Module;
}
export interface Module{
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
