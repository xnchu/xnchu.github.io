---
layout: page
title: solar-wind
permalink: /solar-wind/
description: Real-time visualization of solar wind parameters
nav: true
nav_order: 5
display_categories: [work, fun]
horizontal: false
---

<div class="container mt-4">
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Solar Wind Parameters</h5>
          <canvas id="solarWindChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</div> 

<!-- Load Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Load your custom JavaScript -->
<script src="{{ '/assets/js/solar-wind.js' | relative_url }}"></script> 