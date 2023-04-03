export interface ChallengeInstructionInterface {
    id?: number;
    image: string;
    title: string;
    text: string;
}

export const ChallengeInstructionContent: ChallengeInstructionInterface[] = [
    {
        id: 1,
        image: '/assets/icons/laptopIcon.svg',
        title: 'Registration',
        text: 'Register for the program via Perxels Design School website and fill the registration form.',
    },
    {
        id: 2,
        image: '/assets/icons/ruler.svg',
        title: 'Do Your Work',
        text: "Proceed with the challenge and ensure to submit before the submission deadline."
    },
    {
        id: 3,
        image: '/assets/icons/trophy.svg',
        title: 'Final Lap',
        text: "Entries are reviewed and scored. Winners are announced and the winning entry will be contacted."
    }
]