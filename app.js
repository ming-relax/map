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

  $.ajax( {
    url: "https://en.wikipedia.org/w/api.php",
    data: {
      action: "query", 
      titles: self.name, 
      prop: "revisions|categories", 
      rvprop: "content",
      list: "categorymembers",
      cmtitle: "Category:Company",
      format: "json"
    },
    dataType: 'jsonp',
    type: 'GET',
    headers: { 'Api-User-Agent': 'Example/1.0' },
    success: function(data) {
       $.ajax({
        url: "https://en.wikipedia.org/w/api.php",
        data: {
          action: "parse",
          pageid: Object.keys(data.query.pages)[0],
          contentmodel: "wikitext",
          prop: "text",
          disableeditsection: true,
          noimages: true,
          mobileformat: true,
          format: "json"
        },
        dataType: 'jsonp',
        success: function(data) {
          self.infoWindow = new google.maps.InfoWindow({
            content: data.parse.text["*"]
          });

          self.mapMarker.addListener('click', function() {
            self.infoWindow.open(map, self.mapMarker);
          });

        }
       })
    }
} );

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
  ];

  vm = new AppViewModel(companies);

  ko.applyBindings(vm);

})
