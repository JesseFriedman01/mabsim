from flask import Flask, jsonify, request
from flask_socketio import SocketIO, send, emit
from random import randrange
from flask_backend.scripts.utils2 import TestCell, MAB_sim
from threading import Thread

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'

socketIo = SocketIO(app, cors_allowed_origins="*")

app.debug = True
app.host = 'localhost'

connections = {}

def createTestCellsList(test_cells_from_json):
    test_cells_list = []
    for test_cell_params in test_cells_from_json:
        test_cells_list.append(TestCell(test_cell_params['subject_line'],
                                        test_cell_params['id'],
                                        int(test_cell_params['open_rate'])/100,
                                        int(test_cell_params['percent_allocation'])/100)
                               )
    return test_cells_list

@socketIo.on("new_mab_request")
def handleMessage(json_request):

    for key, value in json_request.items():
        if key == 'num_recipients':
            num_recipients = int(value)
        elif key == 'num_rounds':
            num_rounds = int(value)
        elif key == 'test_cells':
            test_cells = createTestCellsList(value)


    sim = MAB_sim(test_cells, num_recipients, num_rounds)

    connections[request.sid] = sim
    print(connections)

    sim.init_mab()

    thread = Thread(target=sim.allocate_members)
    thread.start()
    while sim.status != 'done':
        emit('progress', connections[request.sid].curr_round)
    thread.join()
    print(connections[request.sid].output())
    emit('new_results', connections[request.sid].output())

def modifyTestCells(existing_test_cells, test_cells_from_json):
    # for test_cell in existing_test_cells:
    #     print(test_cell.id)
    for test_cell_json in test_cells_from_json:
        for test_cell_existing in existing_test_cells:
            # print(test_cell_json, test_cell_existing)
            if test_cell_json['id'] == test_cell_existing.id:
                test_cell_existing.open_rate = int(test_cell_json['open_rate'])/100



@socketIo.on("fluctuate_mab_request")
def handleMessage(json_request):

    existing_MAB_object = connections[request.sid]

    existing_MAB_object.curr_round = json_request['current_round']
    # existing_MAB_object.test_cells = createTestCellsList(json_request['test_cells'])

    modifyTestCells(existing_MAB_object.test_cells, json_request['test_cells'])

    thread = Thread(target=existing_MAB_object.allocate_members)
    thread.start()
    thread.join()
    print(connections[request.sid].output())
    emit('new_results', existing_MAB_object.output())
    # for test_cell in existing_MAB_object.test_cells:
    #     print(test_cell.open_rate)



# @socketIo.on("message")
# def handleMessage(msg):
#     None

@socketIo.on('disconnect')
def handleDisconnect():
    del(connections[request.sid])

if __name__ == '__main__':
    socketIo.run(app)