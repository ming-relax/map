### What is this

This is a website that show you the map of some famous silicon vally companies.

### How to see the result

Just open the `index.html` in your browser

### How do I implement it

- I defined a big view model, `AppModelView`, for this appllication and initialize it with predefined data.

- For each company's information, I defined a separate view model, `CompanyViewModel`; and each `CompanyViewModel` is instantiated in the `AppModelView` as one of its observable array's element.

- Google map's map marker and infowindow are instantiated inside `CompanyViewModel`

- I use wikipedia api to get information about the company and show this information in google map's info window.