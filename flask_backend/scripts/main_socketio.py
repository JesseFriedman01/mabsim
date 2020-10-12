from flask import Flask, jsonify, request
from flask_socketio import SocketIO, send, emit
from random import randrange
from flask_backend.scripts.utils3 import TestCell, MAB_sim, Naive_sim, Best_case_sim, create_random_list
from threading import Thread
import json
import time
import copy

app = Flask(__name__)
app.config['SECRET_KEY'] = '_'

socketIo = SocketIO(app, cors_allowed_origins="*")

app.debug = True
app.host = 'localhost'

connections = {}

def createTestCellsList(test_cells_from_json):
    test_cells_list = []
    for test_cell_params in test_cells_from_json:
        test_cells_list.append(TestCell(test_cell_params['name'],
                                        test_cell_params['id'],
                                        int(test_cell_params['open_rate'])/100,
                                        int(test_cell_params['percent_allocation'])/100)
                               )
    return test_cells_list

def createDeepCopiesOfTestCells(test_cells, num_copies):
    deep_copies = []
    for _ in range(num_copies):
        deep_copies.append(copy.deepcopy(test_cells))
    return deep_copies


@socketIo.on("new_mab_request")
def handleMessage(json_request):

    for key, value in json_request.items():
        if key == 'num_recipients':
            num_recipients = int(value)
        elif key == 'num_rounds':
            num_rounds = int(value)
        elif key == 'test_cells':
            test_cells = createTestCellsList(value)

    rand_list = create_random_list(num_rounds, num_recipients)

    test_cells_mab, test_cells_naive, test_cells_best_case = createDeepCopiesOfTestCells(test_cells, 3)

    mab = MAB_sim(test_cells_mab, num_recipients, num_rounds, rand_list)
    naive = Naive_sim(test_cells_naive, num_recipients, num_rounds, rand_list)
    best_case = Best_case_sim(test_cells_best_case, num_recipients, num_rounds, rand_list)

    connections[request.sid] = {'naive': naive, 'mab': mab, 'best_case': best_case}
    # print('connections', connections)

    naive.init_naive()
    naive.run_naive()

    mab.init_mab()

    best_case.init_best_case()
    best_case.run_best_case()

    thread = Thread(target=mab.allocate_members)
    thread.start()
    while mab.status != 'done':
        emit('progress', int((connections[request.sid]['mab'].curr_round/num_rounds) * 100))
        time.sleep(1)
    emit('progress', 100)
    thread.join()

    # print(naive.output())
    # print(best_case.output())

    # results = json.loads(connections[request.sid].output())

    # for key in results:
    #     print(key,':', results[key]['allocation_percentage_history'])

    # for key in json.loads(connections[request.sid].output()):
    #     print('dfdf', key)
    # print(connections[request.sid].output())

    # results = json.dumps(
    #            {'naive': connections[request.sid]['naive'].output(),
    #            'mab': connections[request.sid]['mab'].output(),
    #            'best_case': connections[request.sid]['best_case'].output()})

    results = json.dumps(
        {
            'Summary Data': {'naive': connections[request.sid]['naive'].output()['Summary Data'],
                             'mab': connections[request.sid]['mab'].output()['Summary Data'],
                             'best_case': connections[request.sid]['best_case'].output()['Summary Data']},

            'Detailed Data': {'mab': connections[request.sid]['mab'].output()['Test Cell Data']}
        }
    )

    # print(results)

    emit('new_results', results)

def modifyTestCells(existing_test_cells, test_cells_from_json):
    for test_cell_json in test_cells_from_json:
        for test_cell_existing in existing_test_cells:
            if test_cell_json['id'] == test_cell_existing.id:
                test_cell_existing.open_rate = int(test_cell_json['open_rate'])/100

@socketIo.on("fluctuate_mab_request")
def handleMessage(json_request):
    print('connections', connections)

    existing_naive_object = connections[request.sid]['naive']
    existing_MAB_object = connections[request.sid]['mab']
    existing_best_case_object = connections[request.sid]['best_case']

    existing_naive_object.status = 'running'
    existing_MAB_object.status = 'running'
    existing_best_case_object.status = 'running'

    existing_naive_object.curr_round = json_request['current_round']
    existing_MAB_object.curr_round = json_request['current_round']
    existing_best_case_object.curr_round = json_request['current_round']
    # existing_MAB_object.test_cells = createTestCellsList(json_request['test_cells'])

    modifyTestCells(existing_naive_object.test_cells, json_request['test_cells'])
    modifyTestCells(existing_MAB_object.test_cells, json_request['test_cells'])
    modifyTestCells(existing_best_case_object.test_cells, json_request['test_cells'])

    existing_naive_object.run_naive()
    existing_best_case_object.run_best_case()

    thread = Thread(target=existing_MAB_object.allocate_members)
    thread.start()
    while existing_MAB_object.status != 'done':
        emit('progress', int((connections[request.sid]['mab'].curr_round/connections[request.sid]['mab'].num_rounds) * 100))
        time.sleep(1)
    emit('progress', 100)
    thread.join()

    # results = json.dumps(
    #            {'naive': connections[request.sid]['naive'].output(),
    #            'mab': existing_MAB_object.output(),
    #            'best_case': connections[request.sid]['best_case'].output()})

    results = json.dumps(
        {
            'Summary Data': {'naive': existing_naive_object.output()['Summary Data'],
                             'mab': existing_MAB_object.output()['Summary Data'],
                             'best_case': existing_best_case_object.output()['Summary Data']},

            'Detailed Data': {'mab': connections[request.sid]['mab'].output()['Test Cell Data']}
        }
    )

    emit('new_results', results)

# @socketIo.on('disconnect')
# def handleDisconnect():
#     open_connection_object = connections.get(request.sid)
#     if open_connection_object:
#         del(open_connection_object)

if __name__ == '__main__':
    socketIo.run(app)