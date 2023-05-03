const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

fs.readFile('scenarios.json', (err, data) => {
    if (err) throw err;

    let scenarios = JSON.parse(data);
    let scenarioNames = scenarios.map(scenario => scenario.name);
    let latencies = scenarios.map(scenario => scenario.networkLatency);

    const width = 800; //px
    const height = 600; //px
    
    const chartCallback = (ChartJS) => {
        // Disable the on-canvas plugin
        ChartJS.plugins.register({
            beforeDraw: function(chartInstance) {
                const ctx = chartInstance.chart.ctx;
                ctx.save();
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
                ctx.restore();
            }
        });
    };
    
    const configuration = {
        type: 'bar',
        data: {
            labels: scenarioNames,
            datasets: [{
                label: 'Network Latency (ms)',
                data: latencies,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Network Latency by Scenario'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            plugins: { // Include your plugins directly in the configuration
                beforeDraw: function (chartInstance, easing) {
                    const ctx = chartInstance.chart.ctx;
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
                }
            }
        }
    };
    (async () => {
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });
        const image = await chartJSNodeCanvas.renderToBuffer(configuration);
        fs.writeFile('chart.png', image, err => {
            if (err) throw err;
            console.log('The chart has been saved!');
        });
    })();
});
