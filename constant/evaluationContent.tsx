export interface EvalInfoInterface{
    icon: string
    title: string
    description: string
}

export const EvalInfoContent: EvalInfoInterface[] = [
    {
        icon: '/assets/images/evaluation/info1.svg',
        title: 'Examination Structure',
        description: "The exam consists of 100 multiple-choice questions, requiring candidates to achieve a minimum score of 70% to pass."
    },
    {
        icon: '/assets/images/evaluation/info2.svg',
        title: 'Examination Method',
        description: "Exams are conducted online and proctored, allowing candidates using a webcam and a stable internet connection"
    },
    {
        icon: '/assets/images/evaluation/info3.svg',
        title: 'Examination Duration',
        description: "The exam is scheduled for a total duration of 1 hour (60 minutes). allowing candidates to take exam from anywhere at any time"
    }
]