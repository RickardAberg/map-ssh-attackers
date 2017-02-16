

window.onload = function(){
    //makeChart();
    lineChart.create();
    getStats();
    //locationLookup();
};

var timeChartData;
var myLineChart;
var lineChart = {
    create: function() {
        timeChartData = {
            labels: [],
            datasets: [
                {
                    label: "Loggningar",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: []
                }
            ]
        };

        var ctx = document.getElementById("canvas").getContext("2d");
        myLineChart = new Chart(ctx).Line(timeChartData);
    },
    update: function(month, day, value) {
        myLineChart.datasets[0].points[2].value = 50;
        // Would update the first dataset's value of 'March' to be 50
        myLineChart.update();
    },
    addData: function (month, day, value) {
        var label = month + day;
        myLineChart.addData([value], label);
    }
};

var getStats = function(){
    xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange=function()
        {
            if (xhttp.readyState==4 && xhttp.status==200) {
                var stats = JSON.parse(xhttp.responseText);

                var table = document.getElementById("stats");
                number = 1;
                number_month = "";
                number_day = 0;

                for (i = 0; i < stats.data.length; i++){
                    var row = table.insertRow(i+1);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                    var cell7 = row.insertCell(6);
                    var cell8 = row.insertCell(7);
                    var cell9 = row.insertCell(8);
                    cell1.innerHTML = stats.data[i][0]; // Månad
                    cell2.innerHTML = stats.data[i][1]; // Dag
                    cell3.innerHTML = stats.data[i][2]; // Tid
                    cell4.innerHTML = stats.data[i][3]; // Invalid
                    cell5.innerHTML = stats.data[i][4]; // User
                    cell6.innerHTML = stats.data[i][5]; // "username"
                    cell7.innerHTML = stats.data[i][6]; // "ip"

                    if (number_month == stats.data[i][0] && number_day == stats.data[i][1]) {
                        number = number + 1;
                    }
                    else
                    {
                        if (number_month != "")
                            lineChart.addData(number_month, number_day, number);
                        number_month = stats.data[i][0];
                        number_day = stats.data[i][1];
                        number = 1;
                    }
                    cell8.innerHTML = stats.data[i][7]; // "location"
                    cell9.innerHTML = number; // "location"

                }
                lineChart.addData(number_month, number_day, number); // tilllagd för att inte misa sista :D

                worldMap(stats);
            }
        };
        xhttp.open("GET", "/stats_by_day/", true);
        xhttp.send();
};

var worldMap = function (statsData){
    google.charts.load('current', {'packages':['geochart']});
    data_that_drawRegionsMap_need = statsData.map;
    google.charts.setOnLoadCallback(drawRegionsMap);


};

var data_that_drawRegionsMap_need;
var drawRegionsMap = function() {
    var dataaa = [
        ['Country', 'Popularity']
    ];
    for (var i = 0; i < data_that_drawRegionsMap_need.length; i++) {
        dataaa.push(data_that_drawRegionsMap_need[i])
    }
    var data = google.visualization.arrayToDataTable(dataaa);

    var options = {};

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    chart.draw(data, options);
};