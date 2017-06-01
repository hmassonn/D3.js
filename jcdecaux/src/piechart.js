(function(d3) {
    'use strict';

    let width = 360;
    let height = 360;
    let radius = Math.min(width, height) / 2;
    let donutWidth = 75;
    let legendRectSize = 18;
    let legendSpacing = 4;

	let color = d3.scaleOrdinal(d3.schemeCategory20);

    let svg = d3.select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

    let arc = d3.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

    let pie = d3.pie()
      .value(function(d) { return d.count; })
      .sort(null);

    let tooltip = d3.select('#chart')
      .append('div')
      .attr('class', 'tooltip');

    tooltip.append('div')
      .attr('class', 'label');

    tooltip.append('div')
      .attr('class', 'count');

    tooltip.append('div')
      .attr('class', 'percent');

//	toronto parking ticket number in 2012
    d3.csv('weekdays.csv', function(error, dataset) {
      dataset.forEach(function(d) {
        d.count = +d.count;
        d.enabled = true;
      });

      let path = svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) {
          return color(d.data.label);
        })
        .each(function(d) { this._current = d; });

      path.on('mouseover', function(d) {
        let total = d3.sum(dataset.map(function(d) {
          return (d.enabled) ? d.count : 0;
        }));
        let percent = Math.round(1000 * d.data.count / total) / 10;
        tooltip.select('.label').html(d.data.label);
        tooltip.select('.count').html(d.data.count);
        tooltip.select('.percent').html(percent + '%');
        tooltip.style('display', 'block');
      });

      path.on('mouseout', function() {
        tooltip.style('display', 'none');
      });

      path.on('mousemove', function(d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
          .style('left', (d3.event.layerX + 10) + 'px');
      });

      let legend = svg.selectAll('.legende')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legende')
        .attr('transform', function(d, i) {
			if (i <= 4) {
				return 'translate(' + (-2000) + ',' + (-2000) + ')';
			}
	          let height = legendRectSize + legendSpacing;
	          let offset =  height * color.domain().length / 2;
	          let horz = -2 * legendRectSize;
	          let vert = (i-3) * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
        });

      legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color)
        .on('click', function(label) {
          let rect = d3.select(this);
          let enabled = true;
          let totalEnabled = d3.sum(dataset.map(function(d) {
            return (d.enabled) ? 1 : 0;
          }));
          if (rect.attr('class') === 'disabled') {
            rect.attr('class', '');
          } else {
            if (totalEnabled < 2)
				return ;
            rect.attr('class', 'disabled');
            enabled = false;
          }
          pie.value(function(d) {
            if (d.label === label)
				d.enabled = enabled;
            return (d.enabled) ? d.count : 0;
          });
          path = path.data(pie(dataset));
          path.transition()
            .duration(750)
            .attrTween('d', function(d) {
              let interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                return arc(interpolate(t));
              };
            });
        });

      legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });

    });

	// second pie chart
	// http://www.spiria.com/fr/blogue/culture-geek/programmation-les-tendances-2016
		let datas = [
		  { label: 'OS X', count: 26.2, enabled: true},
		  { label: 'Windows 7', count: 22.5, enabled: true},
		  { label: 'Linux', count: 21.7, enabled: true},
		  { label: 'Windows 10', count: 20.8, enabled: true},
		  { label: 'Windows 8', count: 8.4, enabled: true}
		];

		let svg2 = d3.select('#pie')
			.append('svg')
			.attr('width', width*2)
			.attr('height', height)
			.append('g')
			.attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

		let arc2 = d3.arc()
			.innerRadius(0)
	      	.outerRadius(radius);

		let path2 = svg2.selectAll('path')
			.data(pie(datas))
			.enter()
			.append('path')
			.attr('d', arc2)
			.attr('fill', function(d, i) {
				return color(d.data.label);
		  	});

		let legend2 = svg2.selectAll('.legend')
			.data(color.domain())
			.enter()
			.append('g')
			.attr('class', 'legend')
			.attr('transform', function(d, i) {
				let h = legendRectSize + legendSpacing;
				let offset =  h * color.domain().length / 2;
				let horz = -2 * legendRectSize;
				let vert = i * h - offset;
					return 'translate(' + (width/2+legendSpacing) + ',' + (vert+h*datas.length-(height/2)) + ')';
			});

		legend2.append('rect')
	          .attr('width', legendRectSize)
	          .attr('height', legendRectSize)
	          .style('fill', color)
	          .style('stroke', color)
			  .on('click', function(label) {
	  	          let rect = d3.select(this);
	  	          let enabled = true;
	  	          d3.sum(datas.map(function(d) {
	  	            return (d.enabled) ? 1 : 0;
	  	          }));
	  	          if (rect.attr('class') === 'disabled') {
	  	            rect.attr('class', '');
	  	          } else {
	  	            rect.attr('class', 'disabled');
	  	            enabled = false;
	  	          }
	  	          pie.value(function(d) {
	  	            if (d.label === label) {
	  					d.enabled = enabled;
					}
	  	            return (d.enabled) ? d.count : 0;
	  	          });
	  	          path2 = path2.data(pie(datas));
	  	          path2.transition()
	  	            .attrTween('d', function(d) {
	  	              let interpol = d3.interpolate(this._current, d);
	  	              this._current = interpol(0);
	  	              return function(t) {
	  	                return arc2(interpol(t));
	  	              };
	  	            });
	  	        });

	    legend2.append('text')
	      .attr('x', legendRectSize + legendSpacing)
	      .attr('y', legendRectSize - legendSpacing)
	      .text(function(d) { return d; });

})(window.d3);
