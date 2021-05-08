mapboxgl.accessToken = "pk.eyJ1IjoiY21hdHN1IiwiYSI6ImNraGNuNmw0YzAxajIyeXA1ZWE4aG80NDcifQ.3Y8_bQTBQeuNtqFL3OMBVw";

var schoolsmap = new mapboxgl.Map({
	container: "schoolsmap",
	style: "mapbox://styles/cmatsu/cko9wqb950ghu18kzpspc5ri8",
	center: [-122.48472, 47.23277],
	zoom: 11
});

// schoolsmap.on("click", function (e) {
// 	var features = schoolsmap.queryRenderedFeatures(e.point, {
// 		layers: ["tacomaschools", "fastfood"]
// 	});
//
// 	if (!features.length) {
// 		return;
// 	}
//
// 	var feature = features[0];
//
// 	var popup = new mapboxgl.Popup({ offset: [0, -15] })
// 	.setLngLat(feature.geometry.coordinates)
// 	.setHTML(
// 		"<p><b>Name:</b> " +
// 		feature.properties.school +
// 		"</p><p><b>Address:</b> " +
// 		feature.properties.location_1_address +
// 		"</p><p><b>Educational Stage:</b> " +
// 		feature.properties.educational_stage +
// 		"</p><p><b>Stages Offered:</b> " +
// 		feature.properties.stages_offered +
// 		"</p>"
// 	)
//
// 	.addTo(schoolsmap);
// });
schoolsmap.on("load", function() {
	schoolsmap.addSource("nearest-fastfood", {
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: [
			]
		}
	});
});

var fastFoodPoints = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"Name":"McDonald's 1","City":"Tacoma","State":"WA","Address":"10417 Pacific Hwy SW","ZIP":98499},"geometry":{"type":"Point","coordinates":[-122.4830424785614,47.16323214034083]}},{"type":"Feature","properties":{"Name":"McDonald's 2","City":"Tacoma","State":"WA","Address":"11012 Pacific Ave S","ZIP":98444},"geometry":{"type":"Point","coordinates":[-122.43496656417845,47.15687445982137]}},{"type":"Feature","properties":{"Name":"McDonald's 3","City":"Tacoma","State":"WA","Address":"10909 Portland Ave E","ZIP":98445},"geometry":{"type":"Point","coordinates":[-122.40108489990233,47.15706779121257]}},{"type":"Feature","properties":{"Name":"McDonald's 4","City":"Tacoma","State":"WA","Address":"7217 Pacific Ave","ZIP":98408},"geometry":{"type":"Point","coordinates":[-122.4335879087448,47.19158987090876]}},{"type":"Feature","properties":{"Name":"McDonald's 5","City":"Tacoma","State":"WA","Address":"2916 S 38th St","ZIP":98409},"geometry":{"type":"Point","coordinates":[-122.47450768947601,47.22205653894466]}},{"type":"Feature","properties":{"Name":"McDonald's 6","City":"Tacoma","State":"WA","Address":"4814 Center St","ZIP":98409},"geometry":{"type":"Point","coordinates":[-122.50242948532104,47.234005188937665]}},{"type":"Feature","properties":{"Name":"McDonald's 7","City":"Tacoma","State":"WA","Address":"1975 S Union Ave","ZIP":98405},"geometry":{"type":"Point","coordinates":[-122.48173356056212,47.239942083251236]}},{"type":"Feature","properties":{"Name":"McDonald's 8","City":"Tacoma","State":"WA","Address":"6311 6th Ave","ZIP":98406},"geometry":{"type":"Point","coordinates":[-122.52154290676116,47.255837300612605]}},{"type":"Feature","properties":{"Name":"McDonald's 9","City":"Tacoma","State":"WA","Address":"2203 N Pearl St","ZIP":98406},"geometry":{"type":"Point","coordinates":[-122.51534163951872,47.268156908367814]}},{"type":"Feature","properties":{"Name":"McDonald's 10","City":"Tacoma","State":"WA","Address":"802 Tacoma Ave S","ZIP":98402},"geometry":{"type":"Point","coordinates":[-122.445507645607,47.25519648608356]}},{"type":"Feature","properties":{"Name":"McDonald's 11","City":"University Place","State":"WA","Address":"6700 19th St W","ZIP":98466},"geometry":{"type":"Point","coordinates":[-122.52699822861344,47.24396956755938]}},{"type":"Feature","properties":{"Name":"McDonald's 12","City":"University Place","State":"WA","Address":"3802 Bridgeport Way W","ZIP":98466},"geometry":{"type":"Point","coordinates":[-122.53637371417817,47.22901768343221]}},{"type":"Feature","properties":{"Name":"McDonald's 13","City":"Lakewood","State":"WA","Address":"7413 Custer Rd SW","ZIP":98467},"geometry":{"type":"Point","coordinates":[-122.50893248762976,47.19580836083961]}},{"type":"Feature","properties":{"Name":"McDonald's 14","City":"Lakewood","State":"WA","Address":"8201 Steilacoom Blvd SW ","ZIP":98498},"geometry":{"type":"Point","coordinates":[-122.5461975418104,47.18587117846591]}},{"type":"Feature","properties":{"Name":"McDonald's 15","City":"Tacoma","State":"WA","Address":"6002 100th St SW","ZIP":98499},"geometry":{"type":"Point","coordinates":[-122.5211969358411,47.17400823483411]}},
{"type":"Feature","properties":{"Name":"McDonald's 16","City":"Fife","State":"WA","Address":"1737 51st Ave E","ZIP":98424},"geometry":{"type":"Point","coordinates":[-122.36223894780132,47.246739377775235]}}]};

var popup = new mapboxgl.Popup();

schoolsmap.on("click", "fastfood", function(e) {
	var feature = e.features[0];
	popup.setLngLat(feature.geometry.coordinates)
		.setHTML("<b>Name:</b> " + feature.properties.Name + "<br><b>Address:</b> " + feature.properties.Address + ",<br>" + feature.properties.City + " " + feature.properties.State + " " + feature.properties.ZIP)
		.addTo(schoolsmap);
});

schoolsmap.on("click", "tacomaschools", function(f) {
	var refSchool = f.features[0];
	var nearestFastFood = turf.nearest(refSchool, fastFoodPoints);

	schoolsmap.getSource("nearest-fastfood").setData({
		type: "FeatureCollection",
		features: [nearestFastFood]
	});

	var hasLayer = schoolsmap.getLayer('nearestFastFoodLayer');
	schoolsmap.addLayer({
			id: "nearestFastFoodLayer",
			type: "circle",
			source: "nearest-fastfood",
			paint: {
				"circle-radius": 20,
				"circle-color": "#ffffff",
				"circle-opacity": 0.5
			}
		}, "fastfood");

	var distance = turf.distance(refSchool, nearestFastFood, {units: "miles"}).toFixed(2);

	var eduOption = "";

	if (refSchool.properties.StagesOffered != undefined) {
		eduOption = "<br><b>Education Level:</b> " + refSchool.properties.StagesOffered;
	}

	popup.setLngLat(refSchool.geometry.coordinates.slice())
		.setHTML("<b>Name:</b> " + refSchool.properties.Name + "<br><b>Address:</b> " + refSchool.properties.Address + ",<br>" + refSchool.properties.City + " " + refSchool.properties.State + " " + refSchool.properties.ZIP + "<br><b>Education Level:</b> " + refSchool.properties.EducationalStage + eduOption + "<br><br>The nearest store is <b>" + nearestFastFood.properties.Name + "</b>, located at " + nearestFastFood.properties.Address + ", " + nearestFastFood.properties.City + " " + nearestFastFood.properties.State + " " + nearestFastFood.properties.ZIP + ". It is <b>" + distance + " miles</b> away.")
		.addTo(schoolsmap);
});

//toggle layers
var toggleableLayerIds = ["tacomaschools", "fastfood"];
for (var i = 0; i < toggleableLayerIds.length; i++) {
	var id = toggleableLayerIds[i];
	var link = document.createElement("a");
	link.href = "#";
	link.className = "active";
	link.textContent = id;
	link.onclick = function(e) {
		var clickedLayer = this.textContent;
		e.preventDefault();
		e.stopPropagation();
		var visibility = schoolsmap.getLayoutProperty(clickedLayer, "visibility");
		if (this.className === "active") {
			schoolsmap.setLayoutProperty(clickedLayer, "visibility", "none");
			this.className = "";
		} else {
			this.className = "active";
			schoolsmap.setLayoutProperty(clickedLayer, "visibility", "visible");
		}
	};
	var layers = document.getElementById("menu");
	layers.appendChild(link);
}
