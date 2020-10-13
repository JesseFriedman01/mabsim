import React from 'react';


export const getChartSpecs = (chart_width, chart_height, margin) => {
    const specs = [
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
          'height': chart_height * 2 + margin,
          'grid_width': 3,
          'help_text': {
            'What does this chart illustrate?': <>
                                                 A comparison of total reward (e.g. cumulative open rate) for the Base Case, MAB, and the Best Case. The definition of each is below:
                                                 <br /><br />
                                                 ⚫ Base Case - allocation is performed once, at the first round of the simulation (per the setup configuration) and never changed.
                                                 <br /><br />
                                                 ⚫ MAB - allocation is performed after each round round via the MAB algorithm (i.e. Thompson Sampling).
                                                 <br /><br />
                                                 ⚫ Best Case - allocation is performed such that all recipients are allocated to the test cell with the highest open rate (per the setup configuration or subsequent modifications to open rates).
                                                </>,
            'Why is it important?': 'This visualization helps us to determine and quantify the value of MAB, versus simply setting initial allocation values and never subsequently modifying them (i.e. the Base Case). While the Best Case is unachievable in real life applications (as we don\'t know the open rates ahead of time), it is helpful to see how MAB and the Base Case compare.'
           }
        },
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
          'height': chart_height * 2 + margin,
          'grid_width': 1,
          'help_text': {
            'What does this chart illustrate?': 'The percentage of members in each round that are allocated to each test cell.',
            'Why is it important?': 'With each successive round, the MAB algorithm is "learning" the optimal test cell. As it gains increasing confidence that a given test cell is in fact optimal, it allocates additional members to this test cell. Ultimately, the success of the MAB algorithm can be measured by the extent to which it allocates members to the optimal test cell and the number of rounds that elapse before it identifies the optimal test cell.'
            }
        },
        {
          'data_type': 'MAB detailed',
          'parent_key': 'Test Cell Data',
          'data_to_plot': 'estimated_open_rate',
          'chart_title': 'Estimated open rates',
          'x_axis_title': 'Round',
          'y_axis_title': 'Open Rate',
          'x_pos': 0,
          'y_pos': 1,
          'width': chart_width,
          'height': chart_height,
          'grid_width': 1,
          'help_text': {
            'What does this chart illustrate?': 'The estimated open rate for each test cell per the MAB algorithm, in each round. This is calculated by taking the mean of the beta distribution for each test cell in each round.',
            'Why is it important?': 'Remember that while we configured the open rates for each test cell in the setup of this simulation, these are unknown to the MAB algorithm. We\'d like to see the MAB algorithm converge towards the actual open rate(s) with each successive round.'
           }
        },
        {
          'data_type': 'MAB detailed',
          'parent_key': 'Test Cell Data',
          'data_to_plot': 'actual_open_rate',
          'chart_title': 'Actual open rates',
          'x_axis_title': 'Round',
          'y_axis_title': 'Open Rate',
          'x_pos': 1,
          'y_pos': 1,
          'width': chart_width,
          'height': chart_height,
          'grid_width': 1,
          'help_text': {
            'What does this chart illustrate?': 'The actual open rate for each test cell per the MAB algorithm, in each round. These were configured upon the setup of this simulation.',
            'Why is it important?': 'In the event that you don\'t recall the open rates as configured upon the setup of this simulation, you can refer to them here. In addition, if you choose to modify the open rates (via the "Modify Open Rates" button), this will help you keep track of (and visualize) the changing open rates.'
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
          'data_to_plot': 'beta_distribution',
          'chart_title': 'Beta distribution',
          'x_pos': 0,
          'y_pos': 2,
          'width': chart_width * 2,
          'height': chart_height,
          'slice_y_axis': false,
          'grid_width': 2,
          'help_text': {
            'What does this chart illustrate?': 'The beta distribution of each test cell in each round as derived from the MAB algorithm employed (i.e. Thompson Sampling).',
            'Why is it important?': 'Beta distribution lies at the heart of Thompson Sampling and is ultimately how allocation to a given test cell is determined. Visually, as a beta distribution plot grows increasingly narrow and taller around the mean (on the x-axis), the algorithm is gaining increasing confidence in that test cell\'s actual open rate. Moreover, for each recipient in each round, a value is drawn at random from within the area of each test cell\'s beta distribution and then the recipient is allocated to the test cell with the largest drawn value.'
           }
        },

    ]
    return specs
};
