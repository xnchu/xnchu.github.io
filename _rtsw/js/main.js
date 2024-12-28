document.addEventListener('DOMContentLoaded', async () => {
    const charts = new SolarWindCharts();

    async function loadData() {
        try {
            const [magResponse, plasmaResponse] = await Promise.all([
                fetch('data/mag-1-day.json'),
                fetch('data/plasma-1-day.json')
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