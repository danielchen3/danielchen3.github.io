export function Create_State_Chart(canvasId, timeData, title = 'State Alerts') {
    if (!timeData || Object.keys(timeData).length === 0) {
        console.error('Invalid input data');
        return null;
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Error finding canvas element ID ${canvasId}`);
        return null;
    }
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(timeData),
            datasets: [{
                label: title,
                data: Object.values(timeData),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'In-state Alerts'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

export function Create_County_Chart(canvasId, timeData, title = 'Alert Status') {
    if (!timeData || Object.keys(timeData).length === 0) {
        console.error('Invalid input data');
        return null;
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Error finding canvas element ID ${canvasId}`);
        return null;
    }

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(timeData),
            datasets: [{
                label: title,
                data: Object.values(timeData),
                backgroundColor: Object.values(timeData).map(value => 
                    value === 1 ? 'rgba(246, 17, 17, 0.8)' : 'rgba(75, 192, 192, 0.8)'
                ),
                borderColor: Object.values(timeData).map(value => 
                    value === 1 ? 'rgb(229, 14, 60)' : 'rgb(75, 192, 192)'
                ),
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return value === 1 ? 'Alert' : 'Normal';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y === 1 ? 'Alert Status: Active' : 'Alert Status: Normal';
                        }
                    }
                }
            }
        }
    });
}