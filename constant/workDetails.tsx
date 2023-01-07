interface WorkDetails {
  [key: string]: [
    {
      id: string
      title: string
      description: string
    },
    {
      id: string
      title: string
      description: string
    },
  ]
}

export const workDetails: WorkDetails[] = [
  {
    content1: [
      {
        id: '1',
        title: 'Overview',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At adipiscing proin facilisis nulla ut suspendisse sit tempor. Turpis nibh sit elementum eros interdum purus. Pretium a mattis pellentesque et leo risus varius nunc.',
      },
      {
        id: '1',
        title: 'Overview',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At adipiscing proin facilisis nulla ut suspendisse sit tempor. Turpis nibh sit elementum eros interdum purus. Pretium a mattis pellentesque et leo risus varius nunc.',
      },
    ],
    content2: [
      {
        id: '1',
        title: 'Overview',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At adipiscing proin facilisis nulla ut suspendisse sit tempor. Turpis nibh sit elementum eros interdum purus. Pretium a mattis pellentesque et leo risus varius nunc.',
      },
      {
        id: '1',
        title: 'Overview',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At adipiscing proin facilisis nulla ut suspendisse sit tempor. Turpis nibh sit elementum eros interdum purus. Pretium a mattis pellentesque et leo risus varius nunc.',
      },
    ],
  },
]
