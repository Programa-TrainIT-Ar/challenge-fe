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
    questionNumber: number,
    question: string,
    type: string,
    options: string[],
    correct_option: number[],
}