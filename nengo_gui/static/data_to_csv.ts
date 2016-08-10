/**
 * A function that returns simulation data as a csv, only saving data
 * which is present in a graph.
 * As well, it only saves the data in the datastore, which is based on the
 * amount of time kept in the simulation.
 *
 * @param {Component[]} data_set - A list of the graph items in the simulation
 */

import Value from "./components/value";
import XYValue from "./components/xyvalue";

export default function data_to_csv(data_set) {

    var values = [];
    var dim_values = [];
    var times = [];
    var csv = [];
    var csv_string = "";

    var data_set = data_set.filter(function(data) {
        return data.constructor === Value || data.constructor === XYValue;
    });

    // Extracts all the values from the data_set variable
    for (var x = 0; x < data_set.length; x++) {
        values.push([]);
        for (var y = 0; y < data_set[x].data_store.data.length; y++) {
            values[x].push(data_set[x].data_store.data[y]);
        }
    }

    // Grabs all the time steps
    times = data_set[0].data_store.times;

    // Headers for the csv file
    csv.push(["Graph Name"]);
    csv.push(["Times"]);

    // Adds ensemble name and appropirate number of spaces to the header
    for (var x = 0; x < data_set.length; x++) {
        csv[0].push(data_set[x].label.innerHTML);
        for (var z = 0; z < values[x].length - 1; z++) {
            csv[0].push([]);
        }

    }
    for (var x = 0; x < values.length; x++) {
        for (var y = 0; y < values[x].length; y++) {
            csv[1].push("Dimension" + (y + 1));
        }
    }

    // Puts the data at each time step into a row in the csv
    for (var x = 0; x < times.length; x++) {
        var temp_arr = [times[x]];
        for (var y = 0; y < values.length; y++) {
            for (var z = 0; z < values[y].length; z++) {
                temp_arr.push(values[y][z][x]);
            }
        }
        csv.push(temp_arr);
    }

    // Turns the array into a CSV string
    csv.forEach(function(elem, index) {
        csv[index] = elem.join(",");
    });
    csv_string = csv.join("\n");
    return csv_string;
};