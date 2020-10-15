import random
from scipy.stats import beta
import numpy as np
import copy

def calc_if_opened(rand_list, current_round, recipient_num, test_cell_open_rate):
    return 1 if rand_list[current_round][recipient_num] <= test_cell_open_rate else 0

def create_random_list(num_rounds, num_members):
    random_list = []

    for round in range(num_rounds):
        round_rand_list = []
        for member in range(num_members):
            round_rand_list.append(random.random())
        random_list.append(round_rand_list)

    return random_list

def calc_total_reward(test_cells, current_round):
    sum_reward = 0
    for test_cell in test_cells:
        sum_reward += sum(test_cell.num_opens_history[0:current_round])

    return sum_reward

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

class Naive_sim():
    def __init__(self, test_cells, num_recipients, num_rounds, rand_list):
        self.test_cells = test_cells
        self.num_recipients = num_recipients
        self.curr_round = 0
        self.num_rounds = num_rounds
        self.status = 'running'
        self.total_reward = []
        self.rand_list = rand_list

    def init_naive(self):
        for test_cell in self.test_cells:
            test_cell.num_members_allocated = int(self.num_recipients * test_cell.percent_allocation)
            test_cell.num_opens_history = [0] * self.num_rounds

        self.total_reward = [0] * self.num_rounds

    def record_total_reward(self):
        self.total_reward[self.curr_round] = calc_total_reward(self.test_cells, self.curr_round)

    def run_naive(self):
        for i in range(self.curr_round, self.num_rounds):
            self.curr_round = i

            for test_cell in self.test_cells:
                opens_in_round = 0
                for recipient in range(0, test_cell.num_members_allocated):
                    opens_in_round += calc_if_opened(self.rand_list, self.curr_round, recipient, test_cell.open_rate)
                test_cell.num_opens_history[self.curr_round] = opens_in_round
                # test_cell.num_opens_history.append(opens_in_round)

            self.record_total_reward()

    def output(self):
        results = {}
        results['Summary Data'] = {'name': 'Base Case', 'total_reward_history': self.total_reward}
        return results

class MAB_sim():
    def __init__(self, test_cells, num_recipients, num_rounds, rand_list):
        self.test_cells = test_cells
        self.num_recipients = num_recipients
        self.curr_round = 0
        self.num_rounds = num_rounds
        self.status = 'running'
        self.epsilon = .05
        self.total_recipients = sum(test_cell.percent_allocation for test_cell in self.test_cells) * num_recipients
        self.total_reward = []
        self.rand_list = rand_list

    def calc_num_opens(self):
        for test_cell in self.test_cells:
            for recipient in range(test_cell.num_members_allocated):
                test_cell.num_opens += calc_if_opened(self.rand_list, self.curr_round, recipient, test_cell.open_rate)

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

        self.total_reward = [0] * self.num_rounds

        self.record_actual_open_rate()
        self.record_estimated_open_rate()
        self.record_beta_distribution()
        self.record_allocation_history()
        self.calc_num_opens()
        self.record_total_reward()

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

    def record_total_reward(self):
        self.total_reward[self.curr_round] = calc_total_reward(self.test_cells, self.curr_round)

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
            self.record_total_reward()

        self.status = 'done'

    def output(self):
        results = {}

        test_cell_dict = {}

        for test_cell in self.test_cells:
            test_cell_dict[test_cell.id] = {'name': test_cell.name,
                                            'allocation_percentage_history': test_cell.allocation_percentage_history,
                                            'allocation_num_members': test_cell.num_members_allocated_history,
                                            'actual_open_rate': test_cell.actual_open_rate,
                                            'estimated_open_rate': test_cell.estimated_open_rate,
                                            'beta_distribution': test_cell.beta_distribution,
                                            # 'num_opens_history': test_cell.num_opens_history
                                            }

        results['Summary Data'] = {'name': 'MAB', 'total_reward_history': self.total_reward}
        results['Test Cell Data'] = test_cell_dict


        return results

class Best_case_sim():
    def __init__(self, test_cells, num_recipients, num_rounds, rand_list):
        self.test_cells = test_cells
        self.num_recipients = num_recipients
        self.curr_round = 0
        self.num_rounds = num_rounds
        self.status = 'running'
        self.total_reward = []
        self.best_test_cell = None
        self.rand_list = rand_list
        self.open_history = []

    def get_test_cell_with_highest_open_rate(self):
        highest_open_rate = 0
        best_test_cell = None

        for test_cell in self.test_cells:
            if test_cell.open_rate > highest_open_rate:
                highest_open_rate = test_cell.open_rate
                best_test_cell = test_cell

        return best_test_cell

    # def allocate_all_members_to_best_test_cell(self):
    #     self.best_test_cell.num_members_allocated = self.num_recipients

    def init_best_case(self):
        self.open_history = [0] * self.num_rounds
        self.total_reward = [0] * self.num_rounds
        for test_cell in self.test_cells:
            test_cell.num_opens_history = [0] * self.num_rounds

    def calc_total_reward(self):
        sum_reward = 0
        sum_reward += sum(self.open_history[0:self.curr_round])
        return sum_reward

    # def record_total_reward(self):
    #     self.total_reward[self.curr_round] = calc_total_reward(self.test_cells, self.curr_round)

    def run_best_case(self):
        for i in range(self.curr_round, self.num_rounds):
            self.curr_round = i
            opens_in_round = 0

            self.best_test_cell = self.get_test_cell_with_highest_open_rate()

            for recipient in range(0, self.num_recipients):
                opens_in_round += calc_if_opened(self.rand_list, self.curr_round, recipient, self.best_test_cell.open_rate)

            self.open_history[self.curr_round] = opens_in_round

            self.total_reward[self.curr_round] = self.calc_total_reward()

    def output(self):
        results = {}
        results['Summary Data'] = {'name': 'Optimal Case', 'total_reward_history': self.total_reward}
        return results

if __name__=='__main__':
    test_cells = [TestCell('A', 0, .2, .5), TestCell('B', 1, .1, .5)]

    test_cells_naive = copy.deepcopy(test_cells)
    test_cells_mab = copy.deepcopy(test_cells)
    test_cells_best_case = copy.deepcopy(test_cells)

    num_rounds = 10
    num_recipients = 10


    rand_list = create_random_list(num_rounds, num_recipients)

    best_case = Best_case_sim(test_cells_best_case, num_recipients, num_rounds, rand_list)
    best_case.init_best_case()
    best_case.run_best_case()

    for test_cell in best_case.test_cells:
        print(test_cell.num_opens_history)

    print(best_case.total_reward)

    best_case.curr_round = 5

    test_cells_best_case[0].open_rate = .1
    test_cells_best_case[1].open_rate = .2

    print('_____________')

    best_case.run_best_case()

    for test_cell in best_case.test_cells:
        print(test_cell.id, test_cell.num_opens_history)

    print(best_case.total_reward)

    # naive = Naive_sim(test_cells_naive, num_recipients, num_rounds, rand_list)
    # naive.init_naive()
    # naive.run_naive()
    #
    # print(naive.total_reward)
    #
    # test_cells_naive[1].open_rate = 1
    #
    # naive.curr_round = 5
    #
    # naive.run_naive()
    #
    # for test_cell in test_cells_naive:
    #     print(test_cell.num_opens_history)

    # print(naive.total_reward)

    # print('naive', naive.total_reward[-1])
    #
    # mab = MAB_sim(test_cells_mab, num_members, num_rounds)
    # mab.init_mab()
    # mab.allocate_members()
    #
    # print('mab', mab.total_reward[-1])
    #
    # best_case = Best_case_sim(test_cells_best_case, num_members, num_rounds)
    # best_case.run_best_case()
    #
    # print('best case', best_case.total_reward[-1], '\n')

    # print(best_case.total_reward[-1] > mab.total_reward[-1])
