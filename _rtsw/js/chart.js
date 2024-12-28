class SolarWindCharts {
    constructor() {
        this.magChart = null;
        this.plasmaChart = null;
        this.initCharts();
    }

    initCharts() {
        // Initialize Magnetic Field Chart
        const magCtx = document.getElementById('magChart').getContext('2d');
        this.magChart = new Chart(magCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Bx GSM',
                        data: [],
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1
                    },
                    {
                        label: 'By GSM',
                        data: [],
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    },
                    {
                        label: 'Bz GSM',
                        data: [],
                        borderColor: 'rgb(54, 162, 235)',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Magnetic Field (nT)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time (UTC)'
                        }
                    }
                }
            }
        });

        // Initialize Plasma Chart
        const plasmaCtx = document.getElementById('plasmaChart').getContext('2d');
        this.plasmaChart = new Chart(plasmaCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Density (n/cm³)',
                        data: [],
                        borderColor: 'rgb(255, 159, 64)',
                        yAxisID: 'density',
                        tension: 0.1
                    },
                    {
                        label: 'Speed (km/s)',
                        data: [],
                        borderColor: 'rgb(153, 102, 255)',
                        yAxisID: 'speed',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    density: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Density (n/cm³)'
                        }
                    },
                    speed: {
                        type: 'linear',
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Speed (km/s)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time (UTC)'
                        }
                    }
                }
            }
        });
    }

    updateCharts(magData, plasmaData) {
        // Update magnetic field chart
        const times = magData.map(d => new Date(d[0]).toLocaleTimeString());
        const bx = magData.map(d => parseFloat(d[1]));
        const by = magData.map(d => parseFloat(d[2]));
        const bz = magData.map(d => parseFloat(d[3]));

        this.magChart.data.labels = times;
        this.magChart.data.datasets[0].data = bx;
        this.magChart.data.datasets[1].data = by;
        this.magChart.data.datasets[2].data = bz;
        this.magChart.update();

        // Update plasma chart
        const plasmaTimes = plasmaData.map(d => new Date(d[0]).toLocaleTimeString());
        const density = plasmaData.map(d => parseFloat(d[1]));
        const speed = plasmaData.map(d => parseFloat(d[2]));

        this.plasmaChart.data.labels = plasmaTimes;
        this.plasmaChart.data.datasets[0].data = density;
        this.plasmaChart.data.datasets[1].data = speed;
        this.plasmaChart.update();

        // Update current values
        this.updateCurrentValues(magData[magData.length - 1], plasmaData[plasmaData.length - 1]);
    }

    updateCurrentValues(magData, plasmaData) {
        document.getElementById('density').textContent = parseFloat(plasmaData[1]).toFixed(2);
        document.getElementById('speed').textContent = parseFloat(plasmaData[2]).toFixed(1);
        document.getElementById('temperature').textContent = parseFloat(plasmaData[3]).toFixed(0);
        document.getElementById('bx').textContent = parseFloat(magData[1]).toFixed(2);
        document.getElementById('by').textContent = parseFloat(magData[2]).toFixed(2);
        document.getElementById('bz').textContent = parseFloat(magData[3]).toFixed(2);
    }
} 