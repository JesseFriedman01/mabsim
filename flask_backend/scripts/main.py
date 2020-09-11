from flask import Flask, request
from flask_backend.scripts.utils2 import TestCell, MAB_sim
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'df'
CORS(app, support_credentials=True)

def param_parsing(test_cell):
    test_cell_split = test_cell.split(',')
    name = test_cell_split[0]
    open_rate = test_cell_split[1]
    percent_allocation = test_cell_split[2]
    return name, open_rate, percent_allocation

@app.route('/', methods=['GET'])
def index():
    return('<a href="/sim">sim</a>')

@app.route('/sim', methods=['GET'])
def api():
    args = request.args
    test_cells = []
    num_recipients = 0
    num_rounds = 0

    for key, value in args.items():

        if key == 'recipients':
            num_recipients = int(value)
        elif key == 'num_rounds':
            num_rounds = int(value)
        else:
            name, open_rate, percent_allocation = param_parsing(value)
            test_cells.append(TestCell(name, float(open_rate), float(percent_allocation)))

    # print(num_rounds)

    sim = MAB_sim(test_cells, num_recipients, num_rounds)
    sim.init_mab()
    sim.allocate_members()

    print(sim.output())

    return sim.output()

