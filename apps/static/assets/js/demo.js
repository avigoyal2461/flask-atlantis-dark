"use strict";
var bot_data; //declare bot data

var total_running = 0;
var total_not_running = 0;
var total_not_updating = 0;
var circleNotUpdating;


var total_month_data;
var completed_month_data;
var uncompleted_month_data;

var total_running;
var total_not_running;

// Cicle Chart
$(document).ready(function () {
	$.get('http://40.114.108.25:6050//processes', function (data) {
		// $.get('http://172.19.36.176:6050/processes', function (data) {
		bot_data = data; //assign global bot data to data function
		$.each(data, function (index, process) {
			if (process.Running.includes("Yes")) {
				total_running += 1;
			} else if (process.Running.includes("Not Running")) {
				total_not_running += 1;
			} else if (process.Running.includes("Disabled")) {
				console.log(process)
			} else {
				total_not_updating += 1
			}
		});
		// var circleElement = Circles.getById("Not_Updating");
		// circleElement.text = total_not_updating;
		// circleNotUpdating.update(total_not_updating)
		var circleTextElementNotUpdating = document.querySelector('#Not_Updating .circles-text');
		var circleTextElementRunning = document.querySelector('#Running .circles-text');
		var circleTextElementNotRunning = document.querySelector('#Not_Running .circles-text');
		circleTextElementNotUpdating.innerHTML = total_not_updating
		circleTextElementNotRunning.innerHTML = total_not_running
		circleTextElementRunning.innerHTML = total_running
		circleTextElementNotUpdating.maxValue = 20;
		// circleNotUpdating.update()
		// circleRunning.update()
		// circleNotRunning.update()
		// circleNotUpdating.text = total_not_updating
	});
	$.ajax({
		url:'http://172.19.36.176:6050/processes',
		method: 'PATCH',
		success: function(data){
			total_month_data = data.map(item => item.month_data);
			completed_month_data = data.map(item => item.month_data_completed);
			uncompleted_month_data = data.map(item => item.month_data_uncompleted);
			console.log(total_month_data);
			console.log(completed_month_data);
			console.log(uncompleted_month_data);
			statisticsChart.data.datasets[0].data = uncompleted_month_data;
			statisticsChart.data.datasets[1].data = completed_month_data;
			statisticsChart.data.datasets[2].data = total_month_data;

			// Update the legend and redraw the chart
			myLegendContainer.innerHTML = statisticsChart.generateLegend();
			statisticsChart.update();
			console.log("Chart updated successfully.");
		}
	});
	// $.patch('http://172.19.36.176:6050/processes', function (data) {
	// 	total_month_data = data.map(item => item.month_data);
	// 	completed_month_data = data.map(item => item.month_data_completed);
	// 	uncompleted_month_data = data.map(item => item.month_data_uncompleted);
	// 	console.log(total_month_data);
	// 	console.log(completed_month_data);
	// 	console.log(uncompleted_month_data);
	// 	statisticsChart.data.datasets[0].data = uncompleted_month_data;
	// 	statisticsChart.data.datasets[1].data = completed_month_data;
	// 	statisticsChart.data.datasets[2].data = total_month_data;

	// 	// Update the legend and redraw the chart
	// 	myLegendContainer.innerHTML = statisticsChart.generateLegend();
	// 	statisticsChart.update();
	// 	console.log("Chart updated successfully.");
	// });
});
var circleNotUpdating = Circles.create({
	id: 'Not_Updating',
	radius: 50,
	value: 80,
	maxValue: 100,
	width: 5,
	text: 0,
	colors: ['#36a3f7', '#fff'],
	duration: 400,
	wrpClass: 'circles-wrp',
	textClass: 'circles-text',
	styleWrapper: true,
	styleText: true,
	// onComplete: function (circle) {
	// 	circleNotUpdating = circle
	// }
})
var circleRunning = Circles.create({
	id: 'Running',
	radius: 50,
	value: 80,
	maxValue: 100,
	width: 5,
	text: function (value) { return value + '%'; },
	colors: ['#36a3f7', '#fff'],
	duration: 400,
	wrpClass: 'circles-wrp',
	textClass: 'circles-text',
	styleWrapper: true,
	styleText: true
})
var circleNotRunning = Circles.create({
	id: 'Not_Running',
	radius: 50,
	value: 80,
	maxValue: 100,
	width: 5,
	text: function (value) { return value + '%'; },
	colors: ['#36a3f7', '#fff'],
	duration: 400,
	wrpClass: 'circles-wrp',
	textClass: 'circles-text',
	styleWrapper: true,
	styleText: true
})
//Notify
$.notify({
	icon: 'flaticon-alarm-1',
	title: 'RPA Dashboard',
	message: 'Welcome to the RPA Dashboard homepage',
},{
	type: 'info',
	placement: {
		from: "bottom",
		align: "right"
	},
	time: 600,
});

// JQVmap
// $('#map-example').vectorMap(
// {
// 	map: 'world_en',
// 	backgroundColor: 'transparent',
// 	borderColor: '#fff',
// 	borderWidth: 2,
// 	color: '#e4e4e4',
// 	enableZoom: true,
// 	hoverColor: '#35cd3a',
// 	hoverOpacity: null,
// 	normalizeFunction: 'linear',
// 	scaleColors: ['#b6d6ff', '#005ace'],
// 	selectedColor: '#35cd3a',
// 	selectedRegions: ['ID', 'RU', 'US', 'AU', 'CN', 'BR'],
// 	showTooltip: true,
// 	onRegionClick: function(element, code, region)
// 	{
// 		return false;
// 	}
// });

//Chart

var ctx = document.getElementById('statisticsChart').getContext('2d');

var statisticsChart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		datasets: [ {
			label: "Uncompleted",
			borderColor: '#f3545d',
			pointBackgroundColor: 'rgba(243, 84, 93, 0.6)',
			pointRadius: 0,
			backgroundColor: 'rgba(243, 84, 93, 0.4)',
			legendColor: '#f3545d',
			fill: true,
			borderWidth: 2,
			// data: [154, 184, 175, 203, 210, 231, 240, 278, 252, 312, 320, 374]
			data: uncompleted_month_data
		}, {
			label: "Completed",
			borderColor: '#fdaf4b',
			pointBackgroundColor: 'rgba(253, 175, 75, 0.6)',
			pointRadius: 0,
			backgroundColor: 'rgba(253, 175, 75, 0.4)',
			legendColor: '#fdaf4b',
			fill: true,
			borderWidth: 2,
			// data: [256, 230, 245, 287, 240, 250, 230, 295, 331, 431, 456, 521]
			data: completed_month_data
		}, {
			label: "Total Items",
			borderColor: '#177dff',
			pointBackgroundColor: 'rgba(23, 125, 255, 0.6)',
			pointRadius: 0,
			backgroundColor: 'rgba(23, 125, 255, 0.4)',
			legendColor: '#177dff',
			fill: true,
			borderWidth: 2,
			// data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 900]
			data: total_month_data
		}]
	},
	options : {
		responsive: true, 
		maintainAspectRatio: false,
		legend: {
			display: false
		},
		tooltips: {
			bodySpacing: 4,
			mode:"nearest",
			intersect: 0,
			position:"nearest",
			xPadding:10,
			yPadding:10,
			caretPadding:10
		},
		layout:{
			padding:{left:5,right:5,top:15,bottom:15}
		},
		scales: {
			yAxes: [{
				ticks: {
					fontStyle: "500",
					beginAtZero: false,
					maxTicksLimit: 5,
					padding: 10
				},
				gridLines: {
					drawTicks: false,
					display: false
				}
			}],
			xAxes: [{
				gridLines: {
					zeroLineColor: "transparent"
				},
				ticks: {
					padding: 10,
					fontStyle: "500"
				}
			}]
		}, 
		legendCallback: function(chart) { 
			var text = []; 
			text.push('<ul class="' + chart.id + '-legend html-legend">'); 
			for (var i = 0; i < chart.data.datasets.length; i++) { 
				text.push('<li><span style="background-color:' + chart.data.datasets[i].legendColor + '"></span>'); 
				if (chart.data.datasets[i].label) { 
					text.push(chart.data.datasets[i].label); 
				} 
				text.push('</li>'); 
			} 
			text.push('</ul>'); 
			return text.join(''); 
		}  
	}
});

var myLegendContainer = document.getElementById("myChartLegend");

// generate HTML legend
myLegendContainer.innerHTML = statisticsChart.generateLegend();

// bind onClick event to all LI-tags of the legend
var legendItems = myLegendContainer.getElementsByTagName('li');
for (var i = 0; i < legendItems.length; i += 1) {
	legendItems[i].addEventListener("click", legendClickCallback, false);
}

var dailyCompletions = document.getElementById('dailyCompletions').getContext('2d');

var mydailyCompletions = new Chart(dailyCompletions, {
	type: 'line',
	data: {
		labels:["Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday"],
		//"August",
		//"September"],

		datasets:[ {
			label: "Sales Analytics", 
			fill: !0, 
			backgroundColor: "rgba(255,255,255,0.2)",
			borderColor: "#fff", 
			borderCapStyle: "butt", 
			borderDash: [], 
			borderDashOffset: 0, 
			pointBorderColor: "#fff", 
			pointBackgroundColor: "#fff", 
			pointBorderWidth: 1, 
			pointHoverRadius: 5, 
			pointHoverBackgroundColor: "#fff", 
			pointHoverBorderColor: "#fff", 
			pointHoverBorderWidth: 1, 
			pointRadius: 1, 
			pointHitRadius: 5, 
			data: [65, 59, 80, 81, 56, 55, 40]
		}]
	},
	options : {
		maintainAspectRatio:!1, legend: {
			display: !1
		}
		, animation: {
			easing: "easeInOutBack"
		}
		, scales: {
			yAxes:[ {
				display:!1, ticks: {
					fontColor: "rgba(0,0,0,0.5)", fontStyle: "bold", beginAtZero: !0, maxTicksLimit: 10, padding: 0
				}
				, gridLines: {
					drawTicks: !1, display: !1
				}
			}
			], xAxes:[ {
				display:!1, gridLines: {
					zeroLineColor: "transparent"
				}
				, ticks: {
					padding: -20, fontColor: "rgba(255,255,255,0.2)", fontStyle: "bold"
				}
			}
			]
		}
	}
});

$("#activeUsersChart").sparkline([112,109,120,107,110,85,87,90,102,109,120,99,110,85,87,94], {
	type: 'bar',
	height: '100',
	barWidth: 9,
	barSpacing: 10,
	barColor: 'rgba(255,255,255,.3)'
});

var topProductsChart = document.getElementById('topProductsChart').getContext('2d');

var myTopProductsChart = new Chart(topProductsChart, {
	type:"line",
	data: {
		labels:["January", 
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"January",
		"February",
		"March",
		"April"],
		datasets:[ {
			label: "Sales Analytics", 
			fill: !0, backgroundColor: "rgba(53, 205, 58, 0.2)", 
			borderColor: "#35cd3a", 
			borderCapStyle: "butt", 
			borderDash: [],
			borderDashOffset: 0, 
			pointBorderColor: "#35cd3a",
			pointBackgroundColor: "#35cd3a", 
			pointBorderWidth: 1, 
			pointHoverRadius: 5, 
			pointHoverBackgroundColor: "#35cd3a", 
			pointHoverBorderColor: "#35cd3a", 
			pointHoverBorderWidth: 1, 
			pointRadius: 1, 
			pointHitRadius: 5, 
			data: [20, 10, 18, 14, 32, 18, 15, 22, 8, 6, 17, 12, 17, 18, 14, 25, 18, 12, 19, 21, 16, 14, 24, 21, 13, 15, 27, 29, 21, 11, 14, 19, 21, 17]
		}
		]
	},
	options : {
		maintainAspectRatio:!1, legend: {
			display: !1
		}
		, animation: {
			easing: "easeInOutBack"
		}
		, scales: {
			yAxes:[ {
				display:!1, ticks: {
					fontColor: "rgba(0,0,0,0.5)", fontStyle: "bold", beginAtZero: !0, maxTicksLimit: 10, padding: 0
				}
				, gridLines: {
					drawTicks: !1, display: !1
				}
			}
			], xAxes:[ {
				display:!1, gridLines: {
					zeroLineColor: "transparent"
				}
				, ticks: {
					padding: -20, fontColor: "rgba(255,255,255,0.2)", fontStyle: "bold"
				}
			}
			]
		}
	}
});
