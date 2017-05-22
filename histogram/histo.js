function getJSONP(yourUrl){
    let Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function epurTab(obj) {
	let map = new Map();
	for (let i = 0;i < obj.length;i++) {
		if (obj[i].fields.station && obj[i].fields.trafic) {
			map.set(obj[i].fields.station, obj[i].fields.trafic);
		}
	}
	let keys = [];
	for (let key of map)
	  keys.push(key);
	keys.sort( function(a,b){ return b[1]-a[1] });
	return keys;
}

function takeNb(list) {
	let tab = [];
	for (let i=0;i < list.length;i++) {
		let tmp = list[i];
		tab[i] = tmp[1] / 169574;
	}
	return tab;
}

let jsonObj = JSON.parse(getJSONP('affluence.json'));
let pure = epurTab(jsonObj);
let w = 8000;
let h = 1200;
let barPadding = 1;
let svg = d3.select("body").append('svg').attr('width', w).attr('height', h);
let dataset = takeNb(pure);

svg.selectAll("rect")
	.data(dataset)
	.enter()
	.append("rect")
	.attr("x", function(d, i) {
	    return i * (w / dataset.length);
	})
	.attr("y", function(d) {
    	return h - (d*4);
	})
	.attr("width", w / dataset.length - barPadding)
	.attr("height", function(d) {
    	return d*4;
	})
	.attr("fill", function(d) {
    	return "rgb(0, 0, " + parseInt(d*4) + ")";
	});

function angle(d, i) {
	console.log(i);
  return (i*21.68);
}

svg.selectAll("text")
	.data(pure)
	.enter()
	.append("text")
	.text(function(d) {
	   return d[0];
	})
	.attr("x", -80)
	.attr("y", 15)
	.attr("transform", function(d, i) {
		return "translate(" + angle(d, i) + ",1000) rotate(-90)";
	})
	.attr("font-family", "sans-serif")
	.attr("font-size", "11px")
	.attr("fill", "red")
	.attr("text-anchor", "middle");
