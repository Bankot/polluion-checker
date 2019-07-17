import { countries } from "./countries.js";
window.addEventListener("DOMContentLoaded", event => {
  const addSelect = () => {
    Object.keys(countries).map(n => {
      let option = document.createElement("option");
      option.value = countries[n].code;
      option.innerHTML = countries[n].name;
      document.getElementById("country-select").appendChild(option);
    });
  };
  addSelect();
  document.getElementById("submit-select").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("info-container").innerHTML = "";
    addLoader("info-container");
    let selectValue = document.getElementById("country-select").value;
    getInfo(getCities(selectValue));
  });
  const getCities = async city => {
    let citiesList = [];

    await fetch(
      `https://api.openaq.org/v1/measurements?limit=300&country=${city}&order_by[]=value&order_by[]=date&sort=desc&parameter=${`so2`}`
    )
      .then(res => res.json())
      .then(city => {
        city.results.map(city => {
          if (
            !citiesList.some(name => name.city === city.city) &&
            citiesList.length < 10
          ) {
            citiesList.push(city);
          }
        });
      })
      .catch(err => {
        console.error(err);
      });
    return citiesList;
  };
  const getInfo = arrayOfCities => {
    arrayOfCities.then(res => {
      res.map(n => {
        fetch(
          `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=opensearch&prop=extracts&format=json&formatversion=2&uselang=en&search=${
            n.city
          }`
        )
          .then(res => res.json())
          .then(res => drawInfo(res[0], res[2], n.unit, n.parameter, n.value));
      });
    });
  };

  const drawInfo = (header, info, unit, parameter, value) => {
    //DIV
    let divContainer = document.createElement("div");
    divContainer.classList.add("info-container__item");
    //H1
    let h2 = document.createElement("h2");
    h2.addEventListener("click", () => {
      if (p2.innerHTML) {
        p2.classList.toggle("info-container__item__p2--active");
      } else {
        alert("No info for this city :(");
      }
    });
    h2.classList.add("info-container__item__header");
    h2.innerHTML = `${header}`;
    //p1
    let p1 = document.createElement("p");
    p1.classList.add("info-container__item__p1");
    p1.innerHTML = `${value.toFixed(0) + unit} ${parameter}`;
    //p2
    let p2 = document.createElement("p");
    p2.classList.add("info-container__item__p2");
    p2.innerHTML = info;
    //append
    divContainer.appendChild(h2);
    divContainer.appendChild(p1);
    divContainer.appendChild(p2);
    document.getElementById("info-container").appendChild(divContainer);
    removeLoader("info-container");
  };
  const addLoader = itemId => {
    let loaderDiv = document.createElement("div");
    let loaderDiv2 = document.createElement("div");
    let loaderDiv3 = document.createElement("div");
    loaderDiv.classList.add("lds-heart");
    loaderDiv.id = "loader";
    loaderDiv.appendChild(loaderDiv2);
    document.getElementById(itemId).appendChild(loaderDiv);
  };
  const removeLoader = () => {
    if (document.getElementById("loader")) {
      document.getElementById("loader").remove();
    }
  };
});
