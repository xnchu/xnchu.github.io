---
layout: page
title: Real time solar wind monitor
permalink: /rtsw/
description: Real-time visualization of solar wind parameters
nav: true
nav_order: 6
display_categories: [work, fun]
horizontal: false
---

<link rel="stylesheet" href="{{ '/assets/css/rtsw.css' | relative_url }}">

<div class="container">
    <h1>Real-Time Solar Wind Monitor</h1>
    
    <div class="dashboard">
        <div class="chart-container">
            <canvas id="magChart"></canvas>
        </div>
        
        <div class="chart-container">
            <canvas id="densityChart"></canvas>
        </div>

        <div class="chart-container">
            <canvas id="speedChart"></canvas>
        </div>

        <div class="chart-container">
            <canvas id="temperatureChart"></canvas>
        </div>
    </div>
</div>

<!-- Load Chart.js and required plugins -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@2.0.0/dist/chartjs-adapter-date-fns.bundle.min.js"></script>

<!-- Load your custom JavaScript -->
<script src="{{ '/assets/js/rtsw.js' | relative_url }}"></script>

