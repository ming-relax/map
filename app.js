function initMap() {
  window.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.3876, lng: -122.0575},
    zoom: 9
  });
}

function CompanyViewModel(company) {
  var self = this;

  self.name = company.name;
  self.lat = company.lat;
  self.lng = company.lng;

  // isSelect observable
  self.isSelected = ko.observable(false);
  self.select = function() {
    self.isSelected(true);
    self.mapMarker.setMap(window.map);
    self.infoWindow.open(map, self.mapMarker);
  }

  self.unselect = function() {
    self.isSelected(false);
    self.mapMarker.setMap(null);
  }

  // mapMarker
  self.mapMarker = new google.maps.Marker({
    map: window.map,
    position: {lat: company.lat, lng: company.lng},
    title: company.name
  });

  var contentString = '<div id="content">'+
  '<div id="siteNotice">'+
  '</div>'+
  '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
  '<div id="bodyContent">'+
  '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
  'sandstone rock formation in the southern part of the '+
  'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
  'south west of the nearest large town, Alice Springs; 450&#160;km '+
  '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
  'features of the Uluru - Kata Tjuta National Park. Uluru is '+
  'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
  'Aboriginal people of the area. It has many springs, waterholes, '+
  'rock caves and ancient paintings. Uluru is listed as a World '+
  'Heritage Site.</p>'+
  '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
  'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
  '(last visited June 22, 2009).</p>'+
  '</div>'+
  '</div>';

  self.infoWindow = new google.maps.InfoWindow({
    content: contentString
  });

  self.mapMarker.addListener('click', function() {
    self.infoWindow.open(map, self.mapMarker);
  });

}

function AppViewModel(companies) {
  var self = this;

  self.keyWord = ko.observable("");

  self.companies = ko.observableArray();
  companies.forEach(function(company) {
    vm = new CompanyViewModel(company)
    self.companies.push(vm);
  });

  self.filteredCompanies = ko.computed(function() {
    var currentCompanies = self.companies().filter(function(company) {
      if (company.name.toLowerCase().indexOf(self.keyWord().toLowerCase()) > -1)
        return true
      else
        return false      
    })
    
    self.companies().forEach(function(company) {
      company.mapMarker.setMap(null);
    });

    currentCompanies.forEach(function(company) {
      company.mapMarker.setMap(map)
    });

    return currentCompanies;
  })

  self.select = function(company) {
    self.companies().forEach(function(c) {      
      if (c === company) {
        c.select();
      } else {
        c.unselect();
      }      
    });
  }

};

$(function(){

  var companies = [
    {name: 'Udacity', lat: 37.40284, lng: -122.108335},
    {name: 'Google', lat: 37.427223, lng: -122.070993},
    {name: 'Twitter', lat: 37.382153, lng: -122.034223},
    {name: 'Facebook', lat: 37.485094, lng: -122.146364},
    {name: 'Apple', lat: 37.386871, lng: -122.039083},
    {name: 'Dropbox', lat: 37.776541, lng: -122.391627}
  ];

  vm = new AppViewModel(companies);

  ko.applyBindings(vm);

})
