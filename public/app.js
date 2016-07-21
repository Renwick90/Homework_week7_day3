

window.onload = function () {
    var url = 'https://restcountries.eu/rest/v1'
    var request = new XMLHttpRequest();
    request.open("GET", url);
    var center = {lat: 55.9486, lng: -3.1999};
    var map = new Map( center, 15);
    console.log(map);

    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var countries = JSON.parse(jsonString);
            main(countries);
        }
    }
    request.send();

};

var main = function (countries) {
    
    var cached = localStorage.getItem("selectedCountry");
    var selected = countries[0];
    if(cached){
        selected = JSON.parse(cached);
        document.querySelector('#countries').selectedIndex = selected.index;
    }    
    var center = {lat:selected.latlng[0], lng:selected.latlng[1]}
    var map = new Map(center, 6)
    populateSelect(countries, map);
    updateDisplay(selected, map);
    document.querySelector('#info').style.display = 'block';
}


var populateSelect = function (countries, map) {
    var parent = document.querySelector('#countries');
    countries.forEach(function (item, index) {
        item.index = index;
        var option = document.createElement("option");
        option.value = index.toString();
        option.text = item.name;
        option.selected = " ";
        parent.appendChild(option);
    });
    parent.style.display = 'block';
    parent.addEventListener('change', function (e) {
        var index = this.value;
        var country = countries[index];
        updateDisplay(country, map);
        localStorage.setItem("selectedCountry",JSON.stringify(country));
    });
}



updateMap = function( selected, map) {
    var center = {lat:selected.latlng[0], lng:selected.latlng[1]}
    map.googleMap.panTo(center)
}



var updateDisplay = function (selected, map) {
    var tags = document.querySelectorAll('#info p');
    tags[0].innerText = selected.name;
    tags[1].innerText = selected.population;
    tags[2].innerText = selected.capital;
    var center = {lat:selected.latlng[0], lng:selected.latlng[1]};
    if(map){
    updateMap( selected, map )}
    map.addMarker( {lat:selected.latlng[0], lng:selected.latlng[1]})
    var country = "<h4>Name: </h4>" + selected.name + "<br>"+ "<h5>Capital: </h5>" + selected.capital+ "<br>"+ "<h5>Region: </h5>" + selected.region+ "<br>" + "<h5>Population: </h5>" + selected.population+ "<br>" + "<h5>Time Zone: </h5>" + selected.timezones;
    map.addInfoWindow(center, country )
}

var Map = function(latLng, zoom){
  this.googleMap = new google.maps.Map( document.getElementById( 'map' ), {
    center: latLng,
    zoom: zoom,
});

  this.addMarker = function(latLng, title){
      var marker = new google.maps.Marker( {
        position: latLng,
        map: this.googleMap,
        title: title
    })
      return marker;

  }

  this.addInfoWindow = function( latLng, title ){
      var marker = this.addMarker( latLng, title)
      marker.addListener( 'click', function() {
        var infoWindow = new google.maps.InfoWindow({
          content: this.title
      })
        infoWindow.open( this.map, marker )
    })
  }
}
