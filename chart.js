var Chart = require('chart.js');
var data = require('./data.json');

timeline_labels = {};

function displayDate(date) {
    if (date < 0) {
        return (-date) + ' BCE';
    }
    return date;
}

// initialize which timelines to show
data.forEach(item => {
    timeline_labels[item.timeline] = true;
})

function toggleTimeline(event) {
    timeline_labels[event.target.id] = !timeline_labels[event.target.id];
    drawChart();
}

for (let timeline in timeline_labels) {

    // dont display a checkbox for the empty timeline
    if (timeline === '') { 
        continue;
    }

    // create checkbox for category
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.id = timeline;
    checkbox.onclick = toggleTimeline;

    // create label for category
    const label = document.createElement('label')
    label.htmlFor = timeline;
    label.appendChild(document.createTextNode(timeline));

    const container = document.getElementById('checkboxes');
    container.appendChild(checkbox);
    container.appendChild(label);
}

function drawChart() {

    timelines = {};

    let min_date = new Date();
    let max_date = new Date("-004100-10-01T07:00:00.000Z")
    data.forEach(item => {

        const timeline = item.timeline;

        // if the checkbox is not selected
        // dont display this timeline
        if (!timeline_labels[timeline]) {
            return;
        }
    
        const color = 'black';
    
        if (!timelines[timeline]) {
            timelines[timeline] = {
                data: [],
                fill: false,
                borderWidth: 1,
                borderColor: color,
                pointBackgroundColor: color
            }
        }
    
        timelines[item.timeline].data.push({
            x: new Date(item.date),
            y: item.timeline,
            title: item.title,
            details: item.details,
            date: item.date,
            showMonth: item.showMonth
        })

        const event_date = new Date(item.date);
        if (event_date < min_date) {
            min_date = event_date;
        }
        if (event_date > max_date) {
            max_date = event_date;
        }
    });
    
    datasets = [];
    min_date.setFullYear(min_date.getFullYear() - 50);
    max_date.setFullYear(max_date.getFullYear() + 50);
    for (let key in timelines) {
        datasets.push(timelines[key]);
    }

    var ctx = document.getElementById("timeline");
    if (ctx) {
        ctx.parentElement.removeChild(ctx);
    }

    var ctx = document.createElement("canvas");
    ctx.id = "timeline";
    document.body.prepend(ctx);
    

    let labels_to_show = [];
    for (let label in timeline_labels) {
        if (timeline_labels.hasOwnProperty(label) && timeline_labels[label]) {
            labels_to_show.push(label);
        }
    }

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            quarter: 'MMM YYYY'
                        },
                        min: min_date,
                        max: max_date
                    },
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        callback: function (value, index, values) {
                            if (value < 0) {
                                return (-value) + ' BCE';
                            }
                            return value;
                        }
                    }
                }],
                yAxes: [{
                    type: 'category',
                    labels: labels_to_show,
                    gridLines: {
                        display: false
                    }
                }]
            },
            title: {
                display: true,
                text: 'Approximate Timeline of Bible Events'
            },
            tooltips: {
                enabled: true,
                callbacks: {
                    label: function (tooltipItem, data) {
                        const event = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        const date = new Date(event.date);
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

                        let result = ''
                        if (event.showMonth) {
                            result = months[date.getMonth()] + ', ';
                        }

                        return result + displayDate(date.getFullYear()) + ' ' + event.details;
                    },
                    title: function (tooltipItems, data) {
                        const event = data.datasets[tooltipItems[0].datasetIndex].data[tooltipItems[0].index];
                        return event.title;
                    },
                    afterTitle: function(tooltipItems, data) {
                        return '';
                    }
                }
            },
            onClick: function(data, activeElements) {
                // TODO: Display more details below the timeline
            }
        }
    });
}

drawChart();