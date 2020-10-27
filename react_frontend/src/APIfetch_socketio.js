import React, { useEffect } from 'react';
import io from 'socket.io-client';

//const endPoint = "http://localhost:5000";
//const socket = io.connect(`${endPoint}`);

export default function APIFetch(props) {
    const [testCells, setTestCells] = React.useState(props.test_cell_list)
    const [numRounds, setNumRounds] = React.useState(props.num_rounds)
    const [numRecipients, setNumRecipients] = React.useState(props.num_recipients)
    const [currentRound, setCurrentRound] = React.useState(props.current_round)

    useEffect(() => {
      sendRequest();
      getData();
    }, []);

    const createJSONforPost = () => {
        let json_post = {};
        json_post["test_cells"] = testCells
        json_post["num_rounds"] = numRounds
        json_post["num_recipients"] = numRecipients
        json_post["current_round"] = currentRound
        return json_post;
    }

    const getData = () => {
        props.getAPIData(null)
        props.socket.once('new_results', (result) => {
            props.getAPIData(JSON.parse(result));
        });
        props.socket.on('progress', (result) => {
            props.getAPIProgress(result);
        });
    }

    const sendRequest = () => {
        if (props.name === "Submit")
            props.socket.emit("new_mab_request", createJSONforPost())
        else if (props.name === "Fluctuate")
            props.socket.emit("fluctuate_mab_request", createJSONforPost())
    };

    return(null)
}
