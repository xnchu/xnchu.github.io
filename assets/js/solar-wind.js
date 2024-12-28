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
    timestamps: data.slice(startIndex).map(row => new Date(row[0])),
    values: data.slice(startIndex)
  };
}

// Function to create the multi-panel solar wind chart
function createSolarWindChart(plasmaData, magneticData) {
  const ctx = document.getElementById('solarWindChart');
  const processedPlasma = processData(plasmaData);
  const processedMagnetic = processData(magneticData);

  // Set chart height
  ctx.height = 800;  // Increased height to accommodate all panels

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: processedPlasma.timestamps,
      datasets: [
        // Panel 1: Magnetic field components
        {
          label: 'Bx (nT)',
          data: processedMagnetic.values.map(row => ({ x: new Date(row[0]), y: row[1] })),
          borderColor: 'rgb(75, 192, 192)',
          segment: { borderColor: ctx => ctx.p0.parsed.y > 0 ? 'rgb(75, 192, 192)' : 'rgb(75, 192, 192)' }
        },
        {
          label: 'By (nT)',
          data: processedMagnetic.values.map(row => ({ x: new Date(row[0]), y: row[2] })),
          borderColor: 'rgb(255, 99, 132)',
          segment: { borderColor: ctx => ctx.p0.parsed.y > 0 ? 'rgb(255, 99, 132)' : 'rgb(255, 99, 132)' }
        },
        {
          label: 'Bz (nT)',
          data: processedMagnetic.values.map(row => ({ x: new Date(row[0]), y: row[3] })),
          borderColor: 'rgb(255, 205, 86)',
          segment: { borderColor: ctx => ctx.p0.parsed.y > 0 ? 'rgb(255, 205, 86)' : 'rgb(255, 205, 86)' }
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      plugins: {
        title: {
          display: true,
          text: 'Solar Wind Parameters'
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour',
            displayFormats: {
              hour: 'HH:mm'
            }
          },
          title: {
            display: true,
            text: 'Time (UTC)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Value'
          },
          beginAtZero: false
        }
      }
    }
  });
}

// Initialize the chart when the page loads
async function initializeChart() {
  const data = await fetchSolarWindData();
  if (data) {
    const chart = createSolarWindChart(data.plasmaData, data.magneticData);
    console.log('Chart created:', chart); // Debug log
    console.log('Data received:', data); // Debug log
  } else {
    console.error('No data received');
  }
}

// Add event listener for page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded'); // Debug log
  initializeChart();
});

// Update data every 5 minutes
setInterval(initializeChart, 5 * 60 * 1000);