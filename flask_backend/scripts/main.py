from flask import Flask, request
from flask_backend.scripts.utils2 import TestCell, MAB_sim
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'df'
CORS(app, support_credentials=True)

def createTestCellsList(test_cells_from_json):
    test_cells_list = []
    for test_cell_params in test_cells_from_json:
        test_cells_list.append(TestCell(test_cell_params['subject_line'], int(test_cell_params['open_rate'])/100, int(test_cell_params['percent_allocation'])/100))
    return test_cells_list

@app.route('/', methods=['GET'])
def index():
    return('<a href="/sim">sim</a>')

@app.route('/sim', methods=['GET', 'POST'])
def api():
    for key, value in request.json.items():
        if key == 'num_recipients':
            num_recipients = int(value)
        elif key == 'num_rounds':
            num_rounds = int(value)
        elif key == 'test_cells':
            test_cells = createTestCellsList(value)

    sim = MAB_sim(test_cells, num_recipients, num_rounds)
    sim.init_mab()
    sim.allocate_members()

    print(sim.output())

    return sim.output()

