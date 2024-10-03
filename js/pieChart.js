let charts = {};
// Prepare the chart data based on filtered cards
function getTopItems(category, allProjects, limit = 10) {
    const countMap = {};

    if(category == "tools" && allProjects.length >0 && allProjects[0].bulletPoints)
    {
        
        allProjects.forEach(project => {
            project.bulletPoints.forEach( bullet => {
                bullet.tools.forEach(item => {
                    countMap[item] = (countMap[item] || 0) + 1;
                });
            });
        });
    }
    else
    {
        allProjects.forEach(project => {
            project[category].forEach(item => {
                countMap[item] = (countMap[item] || 0) + 1;
            });
        });
    }

    // Sort the items by count and limit to top 5
    return Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(entry => ({
            label: entry[0],
            count: entry[1],
            color: getOrAssignColor(entry[0], category),
        }));
}

// Initialize the chart with Chart.js
function createPieChart(canvasId, chartData, title) {
    const ctx = document.getElementById(canvasId+"Chart").getContext('2d');
    const chart=  new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartData.map(item => item.label),
            datasets: [{
                data: chartData.map(item => item.count),
                backgroundColor: chartData.map(item => item.color)
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const label = chartData[tooltipItem.dataIndex].label;
                            const value = chartData[tooltipItem.dataIndex].count;

                            return `${label}: ${value}`;
                        }
                    }
                }
            },
            title: {
                display: true,
                text: title
            }
        }
    });

    const legendContainer = document.getElementById(canvasId+"Legend");
    legendContainer.innerHTML = '';
    let i = 0;
    chartData.forEach(item => {
        if(i<5)
        {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
    
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = item.color; // Set the background color
    
            const labelText = document.createTextNode(item.label + " (" + item.count+")");
    
            legendItem.appendChild(colorBox);
            legendItem.appendChild(labelText);
            legendContainer.appendChild(legendItem);

            i=i+1;
        }
        
    });
    charts[canvasId] = chart;
}

// Update charts dynamically when filters change
function updateCharts(filteredProjects) {
    if(charts)
    {
        const topNatures = getTopItems('natures', filteredProjects);
        const topTechnologies = getTopItems('technologies', filteredProjects);
        const topTools = getTopItems('tools', filteredProjects);
        
    
        ["nature", "technology","tools"].forEach( chartId => {
            let chart = charts[chartId];
            let top ;
            if(chartId == "nature")
                top = topNatures;
            if(chartId == "technology")
                top = topTechnologies;
            if(chartId == "tools")
                top = topTools;
    
            if(chart && chart.data)
            {
                chart.data.datasets[0].data = top.map(item => item.count);
                chart.data.labels = top.map(item => item.label);
                chart.data.datasets[0].backgroundColor = top.map(item => item.color);
                chart.update();
            

                const legendContainer = document.getElementById(chartId+"Legend");
                legendContainer.innerHTML= '';
                let i = 0;
                top.forEach(item => {
                    if(i<5)
                    {
                        const legendItem = document.createElement('div');
                        legendItem.className = 'legend-item';
                
                        const colorBox = document.createElement('div');
                        colorBox.className = 'color-box';
                        colorBox.style.backgroundColor = item.color; // Set the background color
                
                        const labelText = document.createTextNode(item.label);
                
                        legendItem.appendChild(colorBox);
                        legendItem.appendChild(labelText);
                        legendContainer.appendChild(legendItem);

                        i=i+1;
                    }
                });
            }
        });
    }
}

/**Initially populate the charts with all data
document.addEventListener('DOMContentLoaded', function () {
    const allProjects = projects; // Assume this contains all projects data
    const topNatures = getTopItems('natures', allProjects);
    const topTechnologies = getTopItems('technologies', allProjects);
    const topTools = getTopItems('tools', allProjects);

    natureChart = createPieChart('natures', topNatures, 'Top Natures');
    technologyChart = createPieChart('technologies', topTechnologies, 'Top Technologies');
    toolsChart = createPieChart('tools', topTools, 'Top Tools');
}); */
