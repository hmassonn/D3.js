function getJSONP(yourUrl){
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function epurTab(obj) {
	var map = new Map();
	for (var i = 0;i < obj.length;i++) {
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

function createOnePillar(Obj, i) {
	var size = Obj[1] / 169574;
	var sizeMax = 50872319 / 169574;
	var rect = document.createElementNS("http://www.w3.org/2000/svg",'rect');
    rect.setAttribute('x', 30+(i*120));
    rect.setAttribute('y', 60+(sizeMax-size));
    rect.setAttribute('width', 90);
    rect.setAttribute('height', size);
    rect.setAttribute('fill', '#00ff7f');

	var text = document.createElementNS("http://www.w3.org/2000/svg",'text');
	text.setAttribute('x', 15+(i*120));
	if (i % 2 === 0)
		text.setAttribute('y', 40+(sizeMax-size));
	else
		text.setAttribute('y', 80+(sizeMax));
	text.setAttribute('fill', 'black');
	var content = document.createTextNode(Obj[0]);
	text.appendChild(content);

	var value = document.createElementNS("http://www.w3.org/2000/svg",'text');
	value.setAttribute('x', 40+(i*120));
	value.setAttribute('y', 59+(sizeMax));
	value.setAttribute('fill', 'black');
	var content2 = document.createTextNode(Obj[1]);
	value.appendChild(content2);

	var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
	g.appendChild(rect);
	g.appendChild(text);
	g.appendChild(value);
	return g;
}

function createAllPillar(list) {
	var newElem = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	newElem.style.width = "45000";
	newElem.style.height = "400";

	for (var i=0;i < list.length;i++) {
		newElem.appendChild(createOnePillar(list[i], i));
	}
	return newElem;
}

var jsonObj = JSON.parse(getJSONP('affluence.json'));
let pure = epurTab(jsonObj);

document.body.appendChild(createAllPillar(pure));
