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

// Function to process and format the data for Chart.js
function processData(data, skipHeader = true) {
  const startIndex = skipHeader ? 1 : 0;
  return {
    labels: data.slice(startIndex).map(row => new Date(row[0]).toLocaleTimeString()),
    data: data.slice(startIndex)
  };
}

// Function to create the plasma parameters chart
function createPlasmaChart(data) {
  const ctx = document.getElementById('plasmaChart').getContext('2d');
  const processedData = processData(data);

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: processedData.labels,
      datasets: [
        {
          label: 'Density (n/cm³)',
          data: processedData.data.map(row => row[1]),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Speed (km/s)',
          data: processedData.data.map(row => row[2]),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
        {
          label: 'Temperature (K)',
          data: processedData.data.map(row => row[3]),
          borderColor: 'rgb(255, 205, 86)',
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time (UTC)'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Value'
          }
        }
      }
    }
  });
}

// Function to create the magnetic field components chart
function createMagneticChart(data) {
  const ctx = document.getElementById('magneticChart').getContext('2d');
  const processedData = processData(data);

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: processedData.labels,
      datasets: [
        {
          label: 'Bx (nT)',
          data: processedData.data.map(row => row[1]),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'By (nT)',
          data: processedData.data.map(row => row[2]),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
        {
          label: 'Bz (nT)',
          data: processedData.data.map(row => row[3]),
          borderColor: 'rgb(255, 205, 86)',
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time (UTC)'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Magnetic Field (nT)'
          }
        }
      }
    }
  });
}

// Initialize the charts when the page loads
async function initializeCharts() {
  const data = await fetchSolarWindData();
  if (data) {
    createPlasmaChart(data.plasmaData);
    createMagneticChart(data.magneticData);
  }
}

// Add event listener for page load
document.addEventListener('DOMContentLoaded', initializeCharts);

// Update data every 5 minutes
setInterval(initializeCharts, 5 * 60 * 1000);