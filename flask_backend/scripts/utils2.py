import random
from scipy.stats import beta
import json
import matplotlib.pyplot as plt
import numpy as np
import multiprocessing

class TestCell:
    def __init__(self, name, id, open_rate, percent_allocation, is_holdout=False):
        self.id = id
        self.name = name
        self.open_rate = open_rate
        self.percent_allocation = percent_allocation
        self.num_opens = 0
        self.num_opens_history = []
        self.num_members_allocated = 0
        self.num_members_allocated_history = []
        self.allocation_percentage_history = []
        self.actual_open_rate = []
        self.estimated_open_rate = []
        self.beta_distribution = []

class MAB_sim():
    def __init__(self, test_cells, num_recipients, num_rounds):
        self.test_cells = test_cells
        self.num_recipients = num_recipients
        self.curr_round = 0
        self.num_rounds = num_rounds
        self.status = 'running'
        self.epsilon = .05
        self.total_recipients = sum(test_cell.percent_allocation for test_cell in self.test_cells) * num_recipients

    def calc_if_opened(self, test_cell):
        return 1 if random.random() <= test_cell.open_rate else 0

    def calc_num_opens(self):
        for test_cell in self.test_cells:
            for _ in range(test_cell.num_members_allocated):
                test_cell.num_opens += self.calc_if_opened(test_cell)

            test_cell.num_opens_history[self.curr_round] = test_cell.num_opens

    def init_mab(self):
        for test_cell in self.test_cells:
            test_cell.num_members_allocated = int(self.num_recipients * test_cell.percent_allocation)
            test_cell.num_opens_history = [0] * self.num_rounds
            test_cell.num_members_allocated_history = [0] * self.num_rounds
            test_cell.allocation_percentage_history = [0] * self.num_rounds
            test_cell.actual_open_rate = [0] * self.num_rounds
            test_cell.estimated_open_rate = [0] * self.num_rounds
            test_cell.beta_distribution = [0] * self.num_rounds

        self.record_actual_open_rate()
        self.record_estimated_open_rate()
        self.record_beta_distribution()
        self.record_allocation_history()
        self.calc_num_opens()

        self.curr_round += 1

    def run_thompson_sampling(self):
        best_test_cell = None
        beta_max = 0
        for test_cell in self.test_cells:
            open_sum = sum(test_cell.num_opens_history[0:self.curr_round])
            allocated_sum = sum(test_cell.num_members_allocated_history[0:self.curr_round])
            beta_d = beta.rvs(open_sum + 1, allocated_sum - open_sum + 1, size=1)
            if beta_d > beta_max:
                beta_max = beta_d
                best_test_cell = test_cell
        return best_test_cell

    def reset_test_cells_allocation(self):
        for test_cell in self.test_cells:
            test_cell.num_members_allocated = 0

    def reset_test_cells_opens(self):
        for test_cell in self.test_cells:
            test_cell.num_opens = 0

    def record_allocation_history(self):
        for test_cell in self.test_cells:
            test_cell.num_members_allocated_history[self.curr_round] = test_cell.num_members_allocated
            test_cell.allocation_percentage_history[self.curr_round] = test_cell.num_members_allocated / self.total_recipients

    def record_actual_open_rate(self):
        for test_cell in self.test_cells:
            test_cell.actual_open_rate[self.curr_round] = test_cell.open_rate

    def record_estimated_open_rate(self):
        for test_cell in self.test_cells:
            open_sum = sum(test_cell.num_opens_history)
            allocated_sum = sum(test_cell.num_members_allocated_history)
            mean = beta.stats(open_sum + 1, allocated_sum - open_sum + 1, moments='m')
            test_cell.estimated_open_rate[self.curr_round] = mean.item()

    def record_beta_distribution(self):
        quantile = np.arange(0, 1, 0.01)
        for test_cell in self.test_cells:
            open_sum = sum(test_cell.num_opens_history)
            allocated_sum = sum(test_cell.num_members_allocated_history)
            pdf = beta.pdf(quantile, open_sum + 1, allocated_sum - open_sum + 1, loc=0, scale=1)
            test_cell.beta_distribution[self.curr_round] = list(np.nan_to_num(pdf))

    def allocate_members(self):
        for i in range(self.curr_round, self.num_rounds):
            self.curr_round = i
            self.reset_test_cells_allocation()

            for _ in range(int(self.total_recipients)):
                chosen_test_cell = np.random.choice(self.test_cells) if np.random.uniform() < self.epsilon else \
                                   self.run_thompson_sampling()
                chosen_test_cell.num_members_allocated += 1

            self.reset_test_cells_opens()
            self.calc_num_opens()
            self.record_allocation_history()
            self.record_actual_open_rate()
            self.record_estimated_open_rate()
            self.record_beta_distribution()

        self.status = 'done'

    def output(self):
        results = {}
        for test_cell in self.test_cells:
            results[test_cell.id] = {
                                      'name': test_cell.name,
                                      'allocation_percentage_history': test_cell.allocation_percentage_history,
                                      'allocation_num_members': test_cell.num_members_allocated_history,
                                      'actual_open_rate': test_cell.actual_open_rate,
                                      'estimated_open_rate': test_cell.estimated_open_rate,
                                      'beta_distribution': test_cell.beta_distribution

                                     }

        return json.dumps(results)

if __name__=='__main__':
    test_cells = [TestCell('A', 0, .1, .2), TestCell('B', 1, .2, .2)]

    num_members = 10
    num_rounds = 10

    mab = MAB_sim(test_cells, num_members, num_rounds)
    # print(mab.calc_total_recipients())
    mab.init_mab()
    mab.allocate_members()

    for test_cell in test_cells:
        print(test_cell.num_members_allocated_history)
        print(test_cell.actual_open_rate)

