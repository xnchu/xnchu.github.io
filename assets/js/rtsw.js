class SolarWindCharts {
    constructor() {
        this.magChart = null;
        this.densityChart = null;
        this.speedChart = null;
        this.temperatureChart = null;
        this.initCharts();
    }

    initCharts() {
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            elements: {
                point: {
                    radius: 0
                },
                line: {
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: true
                    },
                    ticks: {
                        maxRotation: 0,
                        font: {
                            size: 10
                        },
                        callback: function(value, index, values) {
                            const time = this.getLabelForValue(value);
                            const hour = parseInt(time.split(':')[0]);
                            const minute = parseInt(time.split(':')[1]);
                            // Show only ticks at 00, 03, 06, 09, 12, 15, 18, 21
                            return hour % 3 === 0 ? time : '';
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: true
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        };

        const hideXAxis = {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                x: {
                    ...commonOptions.scales.x,
                    display: false
                }
            }
        };

        // Then add a custom plugin to draw the legend on the left
        const leftLegendPlugin = {
            id: 'leftLegend',
            afterDraw: (chart, args, options) => {
                const { ctx, chartArea, scales } = chart;
                const { left, top } = chartArea;
                const datasets = chart.data.datasets;
                
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.font = '12px Arial';
                
                // Draw legend items to the left of y-axis
                datasets.forEach((dataset, i) => {
                    const y = scales.y.getPixelForValue(scales.y.max - (i * (scales.y.max - scales.y.min) / 4));
                    
                    // Draw line
                    ctx.strokeStyle = dataset.borderColor;
                    ctx.beginPath();
                    ctx.moveTo(left - 50, y);
                    ctx.lineTo(left - 35, y);
                    ctx.stroke();
                    
                    // Draw text
                    ctx.fillStyle = dataset.borderColor;
                    ctx.fillText(dataset.label, left - 30, y);
                });
            }
        };

        // Initialize Magnetic Field Chart
        const magCtx = document.getElementById('magChart').getContext('2d');
        this.magChart = new Chart(magCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Bx',
                        data: [],
                        borderColor: 'black',
                        tension: 0
                    },
                    {
                        label: 'By',
                        data: [],
                        borderColor: 'blue',
                        tension: 0
                    },
                    {
                        label: 'Bz',
                        data: [],
                        borderColor: 'red',
                        tension: 0
                    }
                ]
            },
            options: {
                ...hideXAxis,
                plugins: {
                    leftLegend: {},
                    legend: {
                        display: false
                    }
                },
                scales: {
                    ...hideXAxis.scales,
                    y: {
                        ...hideXAxis.scales.y,
                        min: -10,
                        max: 10,
                        position: 'right',
                        title: {
                            display: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value;
                            }
                        }
                    }
                }
            }
        });

        // Initialize Density Chart
        const densityCtx = document.getElementById('densityChart').getContext('2d');
        this.densityChart = new Chart(densityCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Density (n/cm³)',
                    data: [],
                    borderColor: 'orange',
                    tension: 0
                }]
            },
            options: {
                ...hideXAxis,
                plugins: {
                    leftLegend: {},
                    legend: {
                        display: false
                    }
                },
                scales: {
                    ...hideXAxis.scales,
                    y: {
                        ...hideXAxis.scales.y,
                        type: 'logarithmic',
                        min: 0.1,
                        max: 100,
                        position: 'right',
                        title: {
                            display: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value;
                            }
                        }
                    }
                }
            }
        });

        // Initialize Speed Chart
        const speedCtx = document.getElementById('speedChart').getContext('2d');
        this.speedChart = new Chart(speedCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Speed (km/s)',
                    data: [],
                    borderColor: 'purple',
                    tension: 0
                }]
            },
            options: {
                ...hideXAxis,
                plugins: {
                    leftLegend: {},
                    legend: {
                        display: false
                    }
                },
                scales: {
                    ...hideXAxis.scales,
                    y: {
                        ...hideXAxis.scales.y,
                        min: 200,
                        max: 800,
                        position: 'right',
                        title: {
                            display: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value;
                            }
                        }
                    }
                }
            }
        });

        // Initialize Temperature Chart (keep x-axis for this one)
        const tempCtx = document.getElementById('temperatureChart').getContext('2d');
        this.temperatureChart = new Chart(tempCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperature (K)',
                    data: [],
                    borderColor: 'green',
                    tension: 0
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    ...commonOptions.scales,
                    y: {
                        ...commonOptions.scales.y,
                        type: 'logarithmic',
                        min: 1e4,
                        max: 1e6,
                        position: 'right',
                        title: {
                            display: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value;
                            }
                        }
                    }
                }
            }
        });

        // Add the plugin to Chart.js
        Chart.register(leftLegendPlugin);
    }

    updateCharts(magData, plasmaData) {
        // Format times to show only hours
        const formatTime = (timeStr) => {
            const date = new Date(timeStr);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        // Update magnetic field chart
        const times = magData.map(d => formatTime(d[0]));
        const bx = magData.map(d => parseFloat(d[1]));
        const by = magData.map(d => parseFloat(d[2]));
        const bz = magData.map(d => parseFloat(d[3]));

        this.magChart.data.labels = times;
        this.magChart.data.datasets[0].data = bx;
        this.magChart.data.datasets[1].data = by;
        this.magChart.data.datasets[2].data = bz;
        this.magChart.update();

        // Update plasma charts
        const plasmaTimes = plasmaData.map(d => formatTime(d[0]));
        const density = plasmaData.map(d => parseFloat(d[1]));
        const speed = plasmaData.map(d => parseFloat(d[2]));
        const temperature = plasmaData.map(d => parseFloat(d[3]));

        this.densityChart.data.labels = plasmaTimes;
        this.densityChart.data.datasets[0].data = density;
        this.densityChart.update();

        this.speedChart.data.labels = plasmaTimes;
        this.speedChart.data.datasets[0].data = speed;
        this.speedChart.update();

        this.temperatureChart.data.labels = plasmaTimes;
        this.temperatureChart.data.datasets[0].data = temperature;
        this.temperatureChart.update();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const charts = new SolarWindCharts();

    async function loadData() {
        try {
            const [magResponse, plasmaResponse] = await Promise.all([
                fetch('https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json'),
                fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json'),                
            ]);

            const magData = await magResponse.json();
            const plasmaData = await plasmaResponse.json();

            // Remove headers
            magData.shift();
            plasmaData.shift();

            charts.updateCharts(magData, plasmaData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    // Initial load
    await loadData();

    // Refresh every 5 minutes
    setInterval(loadData, 5 * 60 * 1000);
}); 

 