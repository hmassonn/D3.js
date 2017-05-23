function getJSONP(yourUrl){
    let Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function epurTab(obj) {
	let maps = new Map();
	let ok;
	for (let i=0;i < obj.length;i++) {
		let ville = obj[i].fields.ville;
		let trafic = obj[i].fields.trafic;
		if (ville && trafic) {
			ok = 0;
			maps.forEach(function(nb, name) {
				name = name.replace('-', ' ');
				name = name.replace('  ', ' ');
				name = name.replace('é', 'e');
				name = name.replace('è', 'e');
				name = name.replace('ê', 'e');
				ville = ville.replace('-', ' ');
				ville = ville.replace('  ', ' ');
				ville = ville.replace('é', 'e');
				ville = ville.replace('è', 'e');
				ville = ville.replace('ê', 'e');
				if (ok === 0 && name.toLowerCase() === ville.toLowerCase()) {
					nb += trafic;
					ok = 1;
				}
			});
			if (ok === 0) {
				maps.set(ville, trafic);
			}
		}
	}
	let keys = [];
	for (let key of maps) {
	  keys.push(key);
	}
	keys.sort( function(a,b){ return b[1]-a[1] });
	return keys;
}

let jsonObj = JSON.parse(getJSONP('affluence.json'));
let pure = epurTab(jsonObj);

(function(d3) {
        'use strict';
        var width = 800;
        var height = 800;
		var deltaY = 700;
		var deltaX = 160;
		var legendRectSize = 18;
		var legendSpacing = 4;
        var radius = Math.min(width, height) / 2;
        var color = d3.scaleOrdinal(d3.schemeCategory20b);
        var svg = d3.select("body")
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');

        var arc = d3.arc()
          .innerRadius(0)
          .outerRadius(radius);

        var pie = d3.pie()
          .value(function(d) { return d[1]; })
          .sort(null);

        var path = svg.selectAll('path')
          .data(pie(pure))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d) {
            return color(d.data[0]);
          });

		  var legend = d3.select("body")
			.append('svg')
			.attr('width', width)
			.attr('height', height+deltaY)
		  	.selectAll('.legend')
           	.data(color.domain())
           	.enter()
           	.append('g')
           	.attr('class', 'legend')
           	.attr('transform', function(d, i) {
		         var height = legendRectSize + legendSpacing;
		         var offset =  height * color.domain().length / 2;
		         var horz = -2 * legendRectSize;
		         var vert = i * height - offset + deltaY;
	             return 'translate(' + horz + ',' + vert + ')';
           	});

         legend.append('rect')
           .attr('width', legendRectSize + deltaX)
           .attr('height', legendRectSize)
           .style('fill', color)
           .style('stroke', color);

         legend.append('text')
           .attr('x', legendRectSize + legendSpacing + 20)
           .attr('y', legendRectSize - legendSpacing)
           .text(function(d) { return d; });

		legend.append('text')
		 .attr('x', legendRectSize + legendSpacing + deltaX)
		 .attr('y', legendRectSize - legendSpacing)
		 .text(function(d, i) { return pure[i][1]; });

      })(window.d3);
