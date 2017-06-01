d3.json('forecast.json', function(d) {

	  let temperatures = [],
		  dates = [],
		  humidity = [],
		  margin = { top: 0, right: 0, bottom: 30, left: 20 },
	      height = 400 - margin.top - margin.bottom,
		  width = 600 - margin.left - margin.right;

	  let tempColor,
		  yScale,
		  yAxisValues,
		  yAxisTicks,
		  yGuide,
		  xScale,
		  xAxisValues,
		  xAxisTicks,
		  xGuide,
		  colors,
		  tooltip,
		  myChart;

	  for (let i = 0; i < d.list.length; i++) {
		      temperatures.push(d.list[i].main.temp);
		      dates.push( new Date(d.list[i].dt_txt) );
			  humidity.push(d.list[i].main.humidity);
		    }

	  yScale = d3.scaleLinear()
	    .domain([0, d3.max(temperatures)])
	    .range([0,height]);

	  yAxisValues = d3.scaleLinear()
	    .domain([0, d3.max(temperatures)])
	    .range([height,0]);

	  yAxisTicks = d3.axisLeft(yAxisValues)
	  .ticks(10)

	  xScale = d3.scaleBand()
	    .domain(temperatures)
	    .paddingInner(.1)
	    .paddingOuter(.1)
	    .range([0, width])

	  xAxisValues = d3.scaleTime()
	    .domain([dates[0],dates[(dates.length-1)]])
	    .range([0, width])

	  xAxisTicks = d3.axisBottom(xAxisValues)
	    .ticks(d3.timeDay.every(1))

	  colors = d3.scaleLinear()
	    .domain([0, 65, d3.max(temperatures)])
	    .range(['#FFFFFF', '#2D8BCF', '#DA3637'])

	  tooltip = d3.select('body')
	    .append('div')
	    .style('position', 'absolute')
	    .style('padding', '0 10px')
	    .style('background', 'white')
	    .style('opacity', 0);

	  myChart = d3.select('#viz').append('svg')
	    .attr('width', width + margin.left + margin.right)
	    .attr('height', height + margin.top + margin.bottom)
	    .append('g')
	    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')
	    .selectAll('rect').data(temperatures)
	    .enter().append('rect')
		.attr('fill', colors)
		.attr('width', function(d) {
		          return xScale.bandwidth();
		        })
		.attr('height', 0)
		.attr('x', function(d) {
		          return xScale(d);
		        })
		.attr('y', height)
		.on('mouseover', function(d) {
          tooltip.transition()
			.duration(200)
        	.style('opacity', .9)
          tooltip.html(
			            '<div style="font-size: 2rem; font-weight: bold">' +
				              d + '&deg;</div>'
			          )
            .style('left', (d3.event.pageX -35) + 'px')
            .style('top', (d3.event.pageY -30) + 'px')
          tempColor = this.style.fill;
          d3.select(this)
            .style('fill', 'yellow')
        })
		.on('mouseout', function(d) {
		  tooltip.html('')
		  d3.select(this)
		    .style('fill', tempColor)
		});

	  yGuide = d3.select('#viz svg').append('g')
	            .attr('transform', 'translate(20,0)')
	            .call(yAxisTicks)

	  xGuide = d3.select('#viz svg').append('g')
	            .attr('transform', 'translate(20,'+ height + ')')
	            .call(xAxisTicks)

	  myChart.transition()
	    .attr('height', function(d) {
			      return yScale(d);
			    })
	    .attr('y', function(d) {
			      return height - yScale(d);
			    })
	    .delay(function(d, i) {
			      return i * 20;
			    })
	    .duration(1000)
	    .ease(d3.easeBounceOut)

		// second histograms, TO DO probleme de nb de rectangle (32>40)? et axes a ajouter

	let yS = d3.scaleLinear()
	  	    	.domain([0, d3.max(humidity)])
	  	    	.range([0,height]);

	let xS = d3.scaleBand()
			  	.domain(humidity)
			  	.paddingInner(.1)
			  	.paddingOuter(.1)
			  	.range([0, width])

	let yAV = d3.scaleLinear()
			  .domain([0, d3.max(humidity)])
			  .range([height,0]);

	let yAT = d3.axisLeft(yAV)
				.ticks(10)

	let xAV = d3.scaleTime()
			  .domain([dates[0],dates[(dates.length-1)]])
			  .range([0, width])

	let xAT = d3.axisBottom(xAV)
	  			.ticks(d3.timeDay.every(1))

	let color = d3.scaleLinear()
			  		.domain([0, d3.max(humidity)/2, d3.max(humidity)])
			  		.range(['#FFFFFF', '#aaf9ff', '#00035b'])

	let Chart = d3.select('#viz2')
					.append('svg')
					.attr('width', width + margin.left + margin.right)
					.attr('height', height + margin.top + margin.bottom)
					.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')
					.selectAll('rect').data(humidity)
					.enter().append('rect')
					.attr('fill', color)
					.attr('width', function(d) {
					          return xS.bandwidth();
					        })
					.attr('height', 0)
					.attr('x', function(d) {
					          return xS(d);
					        })
					.attr('y', height)
					.on('mouseover', function(d) {
			          tooltip.transition()
						.duration(200)
			        	.style('opacity', .9)
			          tooltip.html(
						            '<div style="font-size: 2rem; font-weight: bold">' +
							              d + '%</div>'
						          )
			            .style('left', (d3.event.pageX -35) + 'px')
			            .style('top', (d3.event.pageY -30) + 'px')
			          tempColor = this.style.fill;
			          d3.select(this)
			            .style('fill', 'white')
			        })
					.on('mouseout', function(d) {
					  tooltip.html('')
					  d3.select(this)
					    .style('fill', tempColor)
					});

	yGuide = d3.select('#viz2 svg').append('g')
   		   .attr('transform', 'translate(20,0)')
   		   .call(yAT)

    xGuide = d3.select('#viz2 svg').append('g')
   		   .attr('transform', 'translate(20,'+ height + ')')
   		   .call(xAT)

	Chart.transition()
		    .attr('height', function(d) {
				      return yS(d);
				    })
			.attr('y', function(d) {
				      return height - yS(d);
				    })
			.delay(function(d, i) {
				      return i * 20;
				    })
		    .duration(1000)

});
