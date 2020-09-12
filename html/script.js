var ctx = document.getElementById('myChart');


var myChart = new Chart(ctx, {
    type: 'line',
    data:{
        labels: ['Red', 'Yellow','Blue'],
        datasets: [{
            label: 'Numbers',
            data: [10, 20, 30]
        }],   
    }
});