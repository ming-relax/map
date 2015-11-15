function initMap() {
  window.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.3876, lng: -122.0575},
    zoom: 11
  });
}

function initMapMarkers(locations) {
  window.mapMarkers = locations.map(function(location) {
    return new google.maps.Marker({
      map: map,
      position: {lat: location.lat, lng: location.lng},
      title: location.name
    });
  })
}

function markerIsInLocations(marker, locations) {
    var title = marker.getTitle();
    var match = false;
    locations.forEach(function(loc) {
      if (loc.name === title) {
        match = true;
      }
    });
    return match;
}

function updateMapMarkers(locations) {
  mapMarkers.forEach(function(marker) {
    if (markerIsInLocations(marker, locations) === false)
      marker.setMap(null);
    else
      marker.setMap(window.map);
  });
}

function AppViewModel() {
  var self = this;

  this.locations = [
    {name: 'Udacity', lat: 37.40284, lng: -122.108335},
    {name: 'Google', lat: 37.427223, lng: -122.070993},
    {name: 'Twitter', lat: 37.382153, lng: -122.034223},
    {name: 'Facebook', lat: 37.485094, lng: -122.146364},
    {name: 'Apple', lat: 37.386871, lng: -122.039083}
  ];

  this.keyWord = ko.observable("");

  this.filteredLocations = ko.computed(function() {
    var currentLocations = self.locations.filter(function(location) {
      if (location.name.toLowerCase().indexOf(self.keyWord().toLowerCase()) > -1)
        return true
      else
        return false
    })
    return currentLocations;
  }, self);

};

$(function(){
  vm = new AppViewModel();
  ko.applyBindings(vm);

  initMapMarkers(vm.locations);

  vm.filteredLocations.subscribe(function(currentLocations) {
    updateMapMarkers(currentLocations);
  });
})
