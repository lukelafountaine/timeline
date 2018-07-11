var Chart = require('chart.js');
var data = require('./data.json');

timeline_labels = new Set();
timelines = {};

function displayDate(date) {
    if (date < 0) {
        return (-date) + ' BCE';
    }
    return date;
}

data.forEach(item => {
    const timeline = item.timeline;
    timeline_labels.add(timeline);

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
});

datasets = [];
for (let key in timelines) {
    datasets.push(timelines[key]);
}

Chart.defaults.global.elements.point.radius = 2;
var ctx = document.getElementById("timeline");
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
                    min: new Date("-004100-10-01T07:00:00.000Z"),
                    max: new Date()
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
                labels: Array.from(timeline_labels),
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