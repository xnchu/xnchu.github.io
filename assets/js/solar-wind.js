// Function to fetch data from the provided URLs
async function fetchSolarWindData() {
  try {
    const [plasmaResponse, magneticResponse] = await Promise.all([
      fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json'),
      fetch('https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json')
    ]);

    const plasmaData = await plasmaResponse.json();
    const magneticData = await magneticResponse.json();

    return { plasmaData, magneticData };
  } catch (error) {
    console.error('Error fetching solar wind data:', error);
    return null;
  }
}

// Function to process and format the data
function processData(data, skipHeader = true) {
  const startIndex = skipHeader ? 1 : 0;
  return {
    timestamps: data.slice(startIndex).map(row => new Date(row[0]).toLocaleTimeString()),
    values: data.slice(startIndex)
  };
}

// Function to create the multi-panel solar wind chart
function createSolarWindChart(plasmaData, magneticData) {
  const ctx = document.getElementById('solarWindChart').getContext('2d');
  const processedPlasma = processData(plasmaData);
  const processedMagnetic = processData(magneticData);

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: processedPlasma.timestamps,
      datasets: [
        // Magnetic field components
        {
          label: 'Bx (nT)',
          data: processedMagnetic.values.map(row => row[1]),
          borderColor: 'rgb(75, 192, 192)',
          yAxisID: 'magnetic'
        },
        {
          label: 'By (nT)',
          data: processedMagnetic.values.map(row => row[2]),
          borderColor: 'rgb(255, 99, 132)',
          yAxisID: 'magnetic'
        },
        {
          label: 'Bz (nT)',
          data: processedMagnetic.values.map(row => row[3]),
          borderColor: 'rgb(255, 205, 86)',
          yAxisID: 'magnetic'
        },
        // Density
        {
          label: 'Density (n/cm³)',
          data: processedPlasma.values.map(row => row[1]),
          borderColor: 'rgb(153, 102, 255)',
          yAxisID: 'density'
        },
        // Speed
        {
          label: 'Speed (km/s)',
          data: processedPlasma.values.map(row => row[2]),
          borderColor: 'rgb(54, 162, 235)',
          yAxisID: 'speed'
        },
        // Temperature
        {
          label: 'Temperature (K)',
          data: processedPlasma.values.map(row => row[3]),
          borderColor: 'rgb(255, 159, 64)',
          yAxisID: 'temperature'
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time (UTC)'
          }
        },
        magnetic: {
          position: 'left',
          title: {
            display: true,
            text: 'Magnetic Field (nT)'
          },
          grid: {
            drawOnChartArea: true
          }
        },
        density: {
          position: 'left',
          title: {
            display: true,
            text: 'Density (n/cm³)'
          },
          grid: {
            drawOnChartArea: false
          }
        },
        speed: {
          position: 'left',
          title: {
            display: true,
            text: 'Speed (km/s)'
          },
          grid: {
            drawOnChartArea: false
          }
        },
        temperature: {
          position: 'left',
          title: {
            display: true,
            text: 'Temperature (K)'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      },
      layout: {
        padding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }
      }
    }
  });
}

// Initialize the chart when the page loads
async function initializeChart() {
  const data = await fetchSolarWindData();
  if (data) {
    createSolarWindChart(data.plasmaData, data.magneticData);
  }
}

// Add event listener for page load
document.addEventListener('DOMContentLoaded', initializeChart);

// Update data every 5 minutes
setInterval(initializeChart, 5 * 60 * 1000);