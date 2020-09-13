import random
from scipy.stats import beta
import json
import matplotlib.pyplot as plt
import numpy as np

class TestCell:
    def __init__(self, name, open_rate, percent_allocation, is_holdout=False):
        self.name = name
        self.open_rate = open_rate
        self.percent_allocation = percent_allocation
        self.num_opens = 0
        self.num_opens_history = []
        self.num_members_allocated = 0
        self.num_members_allocated_history = []
        self.allocation_percentage_history = []

class MAB_sim():
    def __init__(self, test_cells, num_recipients, num_rounds):
        self.test_cells = test_cells
        self.num_recipients = num_recipients
        self.round = 0
        self.num_rounds = num_rounds
        self.members_per_round = num_recipients/num_rounds

    def calc_if_opened(self, test_cell):
        return 1 if random.random() <= test_cell.open_rate else 0

    def calc_num_opens(self):
        for test_cell in self.test_cells:
            for _ in range(test_cell.num_members_allocated):
                test_cell.num_opens += self.calc_if_opened(test_cell)

            test_cell.num_opens_history.append(test_cell.num_opens)

    def init_mab(self):
        for test_cell in self.test_cells:
            test_cell.num_members_allocated = int(self.members_per_round * test_cell.percent_allocation)

        self.record_allocation_history()
        self.calc_num_opens()

    def run_thompson_sampling(self):
        best_test_cell = None
        beta_max = 0

        for test_cell in self.test_cells:
            open_sum = sum(test_cell.num_opens_history)
            allocated_sum = sum(test_cell.num_members_allocated_history)
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
            test_cell.num_members_allocated_history.append(test_cell.num_members_allocated)
            test_cell.allocation_percentage_history.append( (test_cell.num_members_allocated / self.members_per_round) )

    def allocate_members(self):
        for i in range(self.num_rounds - 1):
            self.reset_test_cells_allocation()

            for _ in range(int(self.members_per_round)):
                optimal_test_cell = self.run_thompson_sampling()
                optimal_test_cell.num_members_allocated += 1

            self.reset_test_cells_opens()
            self.calc_num_opens()
            self.record_allocation_history()

    def output(self):
        results = {}
        for test_cell in self.test_cells:
            results[test_cell.name] = {
                                        'allocation_percentage_history': test_cell.allocation_percentage_history
                                      }

        return json.dumps(results)

if __name__=='__main__':

    a = 7
    b = 3

    quantile = np.arange(0, 1, 0.01)

    pdf = beta.pdf(quantile, a, b, loc = 0, scale = 1)
    mean = beta.stats(a, b, moments='m')
    #
    print(mean)

    plt.plot(pdf)
    plt.show()

    # test_cells = [TestCell('A', .1, .5), TestCell('B', .2, .5)]
    #
    # num_members = 10000
    # num_rounds = 100
    #
    # mab = MAB_sim(test_cells, num_members, num_rounds)
    # mab.init_mab()
    # mab.allocate_members()
    #
    # print(mab.output())

    # for test_cell in test_cells:
    #     print(len(test_cell.allocation_percentage_history))
    #     # plt.plot(test_cell.allocation_percentage_history, label=test_cell.name)
    #     # print(test_cell.name, test_cell.allocation_percentage_history)
    #
    # plt.legend()
    # plt.show()


