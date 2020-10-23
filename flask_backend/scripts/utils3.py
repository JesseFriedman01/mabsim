import random
from scipy.stats import beta
import numpy as np
import copy
import math
import sqlite3
from sqlite3 import Error
import json

def connect_to_db():
    # print('object', mab_object)
    conn = None
    try:
        conn = sqlite3.connect('mab')
        print(sqlite3.version)
    except Error as e:
        print(e)
    # finally:
    #     if conn:
    #         conn.close()
    return conn

def write_to_table(campaign_name, sim_description, sim_results, num_rounds, test_cells, pickled_objects_to_store):
    conn = sqlite3.connect('mab')
    c = conn.cursor()

    create_table_query = 'create table if not exists ' \
                         'saved_sims ' \
                         '(id INTEGER PRIMARY KEY ASC, ' \
                         'date_time DATETIME DEFAULT CURRENT_TIMESTAMP, ' \
                         'campaign_name TEXT, ' \
                         'description TEXT, ' \
                         'data BLOB, ' \
                         'num_rounds INTEGER, ' \
                         'test_cells BLOB, ' \
                         'pickled_objects BLOB ' \
                         ')'

    c.execute(create_table_query)

    c.execute("insert into saved_sims (campaign_name, description, data, num_rounds, test_cells, pickled_objects) values (?, ?, ?, ?, ?, ?)",
              (campaign_name, sim_description, sim_results, num_rounds, test_cells, pickled_objects_to_store))

    conn.commit()
    conn.close()

def fetch_saved_sims_profile():
    conn = sqlite3.connect('mab')
    c = conn.cursor()
    c.execute('select id, date_time, campaign_name, description from saved_sims')
    return c.fetchall()

def fetch_actual_saved_sim(id):
    conn = sqlite3.connect('mab')
    c = conn.cursor()

    c.execute("select data, num_rounds, test_cells from saved_sims where id=?", (id,))
    data_for_frontend = c.fetchall()

    c.execute("select pickled_objects from saved_sims where id=?", (id,))
    data_for_backend = c.fetchall()

    return data_for_frontend, data_for_backend

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

class Epsilon_Greedy_sim():
    def __init__(self, test_cells, num_recipients, num_rounds, rand_list):
        self.test_cells = test_cells
        self.num_recipients = num_recipients
        self.curr_round = 0
        self.num_rounds = num_rounds
        self.status = 'running'
        self.total_reward = []
        self.rand_list = rand_list
        self.total_recipients = sum(test_cell.percent_allocation for test_cell in self.test_cells) * num_recipients
        self.epsilon = 0

    def init_epsilon_greedy(self):
        for test_cell in self.test_cells:
            test_cell.num_members_allocated = int(self.num_recipients * test_cell.percent_allocation)
            test_cell.num_opens_history = [0] * self.num_rounds
            test_cell.allocation_percentage_history = [0] * self.num_rounds
            test_cell.num_members_allocated_history = [0] * self.num_rounds

        self.total_reward = [0] * self.num_rounds
        self.record_allocation_history()
        self.calc_num_opens()
        self.record_total_reward()
        self.curr_round += 1

    def record_total_reward(self):
        self.total_reward[self.curr_round] = calc_total_reward(self.test_cells, self.curr_round)

    def record_allocation_history(self):
        for test_cell in self.test_cells:
            test_cell.num_members_allocated_history[self.curr_round] = test_cell.num_members_allocated
            test_cell.allocation_percentage_history[
                self.curr_round] = test_cell.num_members_allocated / self.total_recipients

    def calc_num_opens(self):
        for test_cell in self.test_cells:
            for recipient in range(test_cell.num_members_allocated):
                test_cell.num_opens += calc_if_opened(self.rand_list, self.curr_round, recipient, test_cell.open_rate)

            test_cell.num_opens_history[self.curr_round] = test_cell.num_opens

    def reset_test_cells_allocation(self):
        for test_cell in self.test_cells:
            test_cell.num_members_allocated = 0

    def reset_test_cells_opens(self):
        for test_cell in self.test_cells:
            test_cell.num_opens = 0

    # def explore_or_exploit(self):
    #     if random.random() <= epsilon:
    #         return 'explore'
    #     return 'exploit'

    def calc_delayed_epsilon(self):
        self.epsilon = 1/(math.log(self.curr_round + .00001))
        return 1 if self.epsilon < 0 else self.epsilon

    def run_epsilon_greedy(self):
        max_open_rate = 0
        optimal_test_cell = None

        for test_cell in self.test_cells:
            open_sum = sum(test_cell.num_opens_history[0:self.curr_round])
            allocated_sum = sum(test_cell.num_members_allocated_history[0:self.curr_round])
            if open_sum/allocated_sum > max_open_rate:
                max_open_rate = open_sum/allocated_sum
                optimal_test_cell = test_cell

        return optimal_test_cell

    def allocate_members(self):
        for i in range(self.curr_round, self.num_rounds):
            self.curr_round = i
            self.reset_test_cells_allocation()

            self.calc_delayed_epsilon()

            chosen_test_cell = np.random.choice(self.test_cells) if np.random.uniform() < self.epsilon else \
                self.run_epsilon_greedy()

            for _ in range(int(self.num_recipients)):
                chosen_test_cell.num_members_allocated += 1

            self.reset_test_cells_opens()
            self.calc_num_opens()
            self.record_allocation_history()
            self.record_total_reward()

class UCB1_sim():
    def __init__(self, test_cells, num_recipients, num_rounds, rand_list):
        self.test_cells = test_cells
        self.num_recipients = num_recipients
        self.curr_round = 0
        self.num_rounds = num_rounds
        self.status = 'running'
        self.total_reward = []
        self.rand_list = rand_list
        self.total_recipients = sum(test_cell.percent_allocation for test_cell in self.test_cells) * num_recipients

    def init_UCB1(self):
        for test_cell in self.test_cells:
            test_cell.num_members_allocated = int(self.num_recipients * test_cell.percent_allocation)
            test_cell.num_opens_history = [0] * self.num_rounds
            test_cell.allocation_percentage_history = [0] * self.num_rounds
            test_cell.num_members_allocated_history = [0] * self.num_rounds
            test_cell.num_times_chosen = 1

        self.total_reward = [0] * self.num_rounds

        self.record_allocation_history()
        self.calc_num_opens()
        self.record_total_reward()

        self.curr_round += 1

    def record_total_reward(self):
        self.total_reward[self.curr_round] = calc_total_reward(self.test_cells, self.curr_round)

    def record_allocation_history(self):
        for test_cell in self.test_cells:
            test_cell.num_members_allocated_history[self.curr_round] = test_cell.num_members_allocated
            test_cell.allocation_percentage_history[self.curr_round] = test_cell.num_members_allocated / self.total_recipients

    def calc_num_opens(self):
        for test_cell in self.test_cells:
            for recipient in range(test_cell.num_members_allocated):
                test_cell.num_opens += calc_if_opened(self.rand_list, self.curr_round, recipient, test_cell.open_rate)

            test_cell.num_opens_history[self.curr_round] = test_cell.num_opens

    def reset_test_cells_allocation(self):
        for test_cell in self.test_cells:
            test_cell.num_members_allocated = 0

    def reset_test_cells_opens(self):
        for test_cell in self.test_cells:
            test_cell.num_opens = 0

    def run_UCB1(self):
        max = 0
        optimal_test_cell = None

        for test_cell in self.test_cells:
            open_sum = sum(test_cell.num_opens_history[0:self.curr_round])
            allocated_sum = sum(test_cell.num_members_allocated_history[0:self.curr_round])

            formula_part_1 = open_sum/ allocated_sum
            formula_part_2 = math.sqrt( (2*math.log(self.curr_round )) / allocated_sum )
            fomula_combined = formula_part_1 + formula_part_2

            if fomula_combined > max:
                max = fomula_combined
                optimal_test_cell = test_cell

        return optimal_test_cell

    def allocate_members(self):
        for i in range(self.curr_round, self.num_rounds):
            self.curr_round = i
            self.reset_test_cells_allocation()

            chosen_test_cell = self.run_UCB1()

            for _ in range(int(self.num_recipients)):
                chosen_test_cell.num_members_allocated += 1

            self.reset_test_cells_opens()
            self.calc_num_opens()
            self.record_allocation_history()
            self.record_total_reward()

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
    None
    # for _ in range(100):
    #     test_cells = [TestCell('A', 0, .15, .25), TestCell('B', 1, .1, .25), TestCell('C', 1, .11, .25), TestCell('D', 1, .13, .25)]
    #
    #     test_cells_naive = copy.deepcopy(test_cells)
    #     test_cells_epsilon_greedy = copy.deepcopy(test_cells)
    #     test_cells_ucb1 = copy.deepcopy(test_cells)
    #     test_cells_mab = copy.deepcopy(test_cells)
    #     test_cells_best_case = copy.deepcopy(test_cells)
    #
    #     num_rounds = 100
    #     num_recipients = 100
    #
    #     rand_list = create_random_list(num_rounds, num_recipients)
    #
    #     eg = Epsilon_Greedy_sim(test_cells_epsilon_greedy, num_recipients, num_rounds, rand_list)
    #     eg.init_epsilon_greedy()
    #     eg.allocate_members()
    #
    #     # print('greedy', eg.total_reward[-1])
    #
    #     ucb = UCB1_sim(test_cells_ucb1, num_recipients, num_rounds, rand_list)
    #     ucb.init_UCB1()
    #     ucb.allocate_members()
    #
    #     # print('ucb', ucb.total_reward[-1])
    #
    #     mab = MAB_sim(test_cells_mab, num_recipients, num_rounds, rand_list)
    #     mab.init_mab()
    #     mab.allocate_members()
    #
    #     # print('mab', mab.total_reward[-1])
    #
    #     best_case = Best_case_sim(test_cells_best_case, num_recipients, num_rounds, rand_list)
    #     best_case.init_best_case()
    #     best_case.run_best_case()
    #
    #     print( 'eg', (eg.total_reward[-1]/best_case.total_reward[-1]) * 100,
    #            'ucb', (ucb.total_reward[-1]/best_case.total_reward[-1]) * 100,
    #            'mab', (mab.total_reward[-1]/best_case.total_reward[-1] * 100) )

    # print('best_case', best_case.total_reward[-1])
    #
    # print('UCB / MAB = ', (ucb.total_reward[-1]/mab.total_reward[-1]) * 100)

# naive = Naive_sim(test_cells_naive, num_recipients, num_rounds, rand_list)
# naive.init_naive()
# naive.run_naive()
#
# print('naive', naive.total_reward[-1])
#
# ucb = UCB1_sim(test_cells_ucb1, num_recipients, num_rounds, rand_list)
# ucb.init_UCB1()
# ucb.allocate_members()
#
# print('ucb', ucb.total_reward[-1])
#
# mab = MAB_sim(test_cells_mab, num_recipients, num_rounds, rand_list)
# mab.init_mab()
# mab.allocate_members()
#
# print('mab', mab.total_reward[-1])
#
# best_case = Best_case_sim(test_cells_best_case, num_recipients, num_rounds, rand_list)
# best_case.init_best_case()
# best_case.run_best_case()
#
# print('best_case', best_case.total_reward[-1])

