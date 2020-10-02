import io from 'socket.io-client';

let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);

class APIFetch_test{
   constructor(test_cells, num_rounds, num_recipients, current_round, call_type){
        this.test_cells = test_cells;
        this.num_rounds = num_rounds;
        this.num_recipients = num_recipients;
        this.current_round = current_round;
        this.call_type = call_type;
    }

    createJSONforPost(){
        let json_post = {};
        json_post["test_cells"] = this.test_cells;
        json_post["num_rounds"] = this.num_rounds;
        json_post["num_recipients"] = this.num_recipients;
        json_post["current_round"] = this.current_round;
        return json_post;
    }

    getData(){
        socket.on('new_results', (result) => {
           return JSON.parse(result);
        });
        socket.on('progress', (result) => {
            return result;
        });
    }

     sendRequest(){
        if (this.call_type === "Submit")
            socket.emit("new_mab_request", this.createJSONforPost())
        else if (this.call_type === "Fluctuate")
            socket.emit("fluctuate_mab_request", this.createJSONforPost())
     };
}

export default APIFetch_test;