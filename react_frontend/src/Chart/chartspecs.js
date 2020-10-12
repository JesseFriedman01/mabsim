export const getChartSpecs = (chart_width, chart_height) => {
    const specs = [
        {
          'data_type': 'MAB detailed',
          'parent_key': 'Test Cell Data',
          'data_to_plot': 'allocation_percentage_history',
          'chart_title': 'Test cell allocation by percentage',
          'x_axis_title': 'Round',
          'y_axis_title': 'Allocation Percentage',
          'x_pos': 0,
          'y_pos': 0,
          'width': chart_width,
          'height': chart_height,
          'grid_width': 1,
          'help_text': {
                        'What does this chart illustrate?': 'The percentage of members in each round that are allocated to each test cell.',
                        'Why is it important?': 'With each successive round, the MAB algorithm is "learning" the optimal test cell. As it gains increasing confidence that a given test cell is in fact optimal, it allocates additional members to this test cell. Ultimately, the success of the MAB algorithm can be measured by the extent to which it allocates members to the optimal test cell and the number of rounds that elapse before it identifies the optimal test cell.'
                       }
        },
        {
          'data_type': 'MAB detailed',
          'parent_key': 'Test Cell Data',
          'data_to_plot': 'allocation_num_members',
          'chart_title': 'Test cell allocation by number',
          'x_axis_title': 'Round',
          'y_axis_title': 'Num Allocation',
          'x_pos': 2,
          'y_pos': 0,
          'width': chart_width,
          'height': chart_height,
          'grid_width': 1,
          'help_text': {
                        'What does this chart illustrate?': 'The total number of members in each round that are allocated to each test cell.',
                        'Why is it important?': 'With each successive round, the MAB algorithm is "learning" the optimal test cell. As it gains increasing confidence that a given test cell is in fact optimal, it allocates additional members to this test cell. Ultimately, the success of the MAB algorithm can be measured by the extent to which it allocates members to the optimal test cell and the number of rounds that elapse before it identifies the optimal test cell.'
                       }
        },
        {
          'data_type': 'MAB detailed',
          'parent_key': 'Test Cell Data',
          'data_to_plot': 'estimated_open_rate',
          'chart_title': 'Estimated open rate',
          'x_axis_title': 'Round',
          'y_axis_title': 'Open Rate',
          'x_pos': 0,
          'y_pos': 1,
          'width': chart_width * 2,
          'height': chart_height,
          'grid_width': 2
        },
        {
          'data_type': 'MAB detailed',
          'parent_key': 'Test Cell Data',
          'data_to_plot': 'actual_open_rate',
          'chart_title': 'Actual open rate',
          'x_axis_title': 'Round',
          'y_axis_title': 'Open Rate',
          'x_pos': 2,
          'y_pos': 1,
          'width': chart_width,
          'height': chart_height,
          'grid_width': 1
        },
        {
          'data_type': 'MAB detailed',
          'parent_key': 'Test Cell Data',
          'data_to_plot': 'beta_distribution',
          'chart_title': 'Beta distribution',
          'x_pos': 0,
          'y_pos': 3,
          'width': chart_width * 2,
          'height': chart_height,
          'slice_y_axis': false,
          'grid_width': 2
        },
        {
          'data_type': 'Summary Data',
          'parent_key': 'Total Reward',
          'data_to_plot': 'total_reward_history',
          'chart_title': 'Total Reward',
          'x_axis_title': 'Round',
          'y_axis_title': 'Reward',
          'x_pos': 3,
          'y_pos': 3,
          'width': chart_width * 3,
          'height': chart_height,
          'grid_width': 3,
        },
    ]
    return specs
};
