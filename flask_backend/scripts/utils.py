import random
from scipy.stats import beta
import json
import matplotlib.pyplot as plt

class TestCell:
    def __init__(self, name, open_rate, is_holdout=False):
        self.name = name
        self.open_rate = open_rate
        self.former_open_rates = []
        self.changed_rate = None
        self.is_holdout = is_holdout
        self.num_opens = 0
        self.num_sent = 0
        self.chosen_history = []
        # self.percent_allocation = percent_allocation
        self.num_allocated_history = []
        # self.num_allocated = int

class MAB_sim():
    def __init__(self):
        self.test_cells = []

    def set_test_cells(self, test_cells):
        self.test_cells = test_cells

    def get_reward(self, test_cell):
        return 1 if random.random() <= test_cell.open_rate else 0

    def modify_open_rates(self):
        min_open_rate = min(test_cell.open_rate for test_cell in self.test_cells)
        max_open_rate = max(test_cell.open_rate for test_cell in self.test_cells)

        for test_cell in self.test_cells:
            test_cell.former_open_rates.append(test_cell.open_rate)
            test_cell.open_rate = random.uniform(min_open_rate, max_open_rate)

    def update_test_cell_history(self):
        for test_cell in self.test_cells:
            test_cell.chosen_history.append(test_cell.num_sent)
            # test_cell.num_allocated.append(test_cell.num_sent)

    def run_thomspon_sampling(self):
        best_test_cell = None
        beta_max = 0
        for test_cell in self.test_cells:
            beta_d = beta.rvs(test_cell.num_opens + 1, test_cell.num_sent - test_cell.num_opens + 1, size=1)
            if beta_d > beta_max:
                beta_max = beta_d
                best_test_cell = test_cell
        return best_test_cell

    # def initialize_mab(self):
    #     for test_cell in test_cells:
    #         test_cell.num_allocated_history.append(int(num_recipients * test_cell.percent_allocation))

    # def allocate_members(self):
    #     for test_cell in test_cells:
    #         for i in range(test_cell.num_allocated_history[-1]):
    #             test_cell.num_opens += self.get_reward(test_cell)
    #             test_cell.num_sent += 1

    def run_simulation(self, num_rounds, fluctuate=None):
        for i in range(num_rounds):
            # if i == 0:
            #     self.initialize_mab(num_recipients)
            #     self.allocate_members()
            #     continue
            test_cell_chosen = self.run_thomspon_sampling()
            print(test_cell_chosen)
            # test_cell_chosen.num_sent = num_recipients
            test_cell_chosen.num_opens += self.get_reward(test_cell_chosen)
            # print(test_cell_chosen.name)
            self.update_test_cell_history()
            # if i % 100 == 0 and i > 0:
            #     # test_cells[0].open_rate = .1
            #     # test_cells[1].open_rate = .4
            #     self.modify_open_rates()

    def output(self):
        results = {}
        for test_cell in self.test_cells:
            results[test_cell.name] = {'open_rate':test_cell.open_rate, 'former_open_rates':test_cell.former_open_rates, 'opens':test_cell.num_opens, 'sents':test_cell.num_sent, 'chosen_history':test_cell.chosen_history}

        return json.dumps(results)

if __name__=='__main__':
    test_cells = [TestCell('A', .4), TestCell('B', .1)]

    mab = MAB_sim()
    mab.set_test_cells(test_cells)
    mab.run_simulation(1000)

    for test_cell in test_cells:
        print(test_cell.name, test_cell.num_allocated_history, test_cell.num_opens, test_cell.num_sent)
        # plt.plot(test_cell.chosen_history, label = test_cell.name)
#
#     print(mab.output())
#
#     plt.legend()
#     plt.show()


