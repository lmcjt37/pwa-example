(function() {
  'use strict';

  var app = {
    spinner: document.querySelector('.loader')
  };

  var container = document.querySelector('.container');
  var maxPrs = 5;

  // Check that localStorage is both supported and available
  function storageAvailable(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return false;
    }
  }

  // Get the Data from the Web Storage
  function fetchDataFromLocalStorage(data) {
    var localData = JSON.parse(data);

    app.spinner.setAttribute('hidden', true);

    for (var i = 0; i < maxPrs; i++) {

      container.querySelector("" + commitContainer[i]).innerHTML =
      "<h4> Message: " + localData[posData[i]].message + "</h4>" +
      "<h4> Author: " + localData[posData[i]].author + "</h4>" +
      "<h4> Time committed: " + (new Date(localData[posData[i]].time)).toUTCString() +  "</h4>" +
      "<h4>" + "<a href='" + localData[posData[i]].link + "'>Click me to see more!</a>"  + "</h4>";

      container.querySelector(`.user_${i}`).innerHTML =
          "<h4> Title: " + localData[i].title + "</h4>" +
          "<h4> User: " + localData[i].user.login + "</h4>" +
          "<h4> Created: " + (new Date(localData[i].created_at)).toUTCString() +  "</h4>" +
          "<h4>" + "<a href='" + localData[i].pull_request.url + "'>Go to PR</a>"  + "</h4>";

    }
  };

  function fetchData() {
    var url = 'https://api.github.com/search/issues?q=author:lmcjt37+type:pr';

    fetch(url)
        .then(function(fetchResponse){
            return fetchResponse.json();
        })
        .then(function(response) {

            var data = {},
                items = response.items;

            for (var i = 0; i < maxPrs; i++) {
                data["user_" + i] = {
                    title: items[i].title,
                    user: items[i].user.login,
                    time: items[i].created_at,
                    url: items[i].pull_request.url
                }

                localStorage.setItem('prData', JSON.stringify(data));

                container.querySelector(`.user_${i}`).innerHTML =
                    "<h4> Title: " + items[i].title + "</h4>" +
                    "<h4> User: " + items[i].user.login + "</h4>" +
                    "<h4> Created: " + (new Date(items[i].created_at)).toUTCString() +  "</h4>" +
                    "<h4>" + "<a href='" + items[i].pull_request.url + "'>Go to PR</a>"  + "</h4>";
            }

            app.spinner.setAttribute('hidden', true);
          })
          .catch(function(error) {
            console.error(error);
          });
  };

  if (storageAvailable('localStorage')) {
    if (localStorage.getItem('prData') === null) {
      /* The user is using the app for the first time, or the user has not
       * saved any commit data, so show the user some fake data.
       */
      fetchData();
      console.log("Fetch from API");
    } else {
      fetchDataFromLocalStorage(localStorage.getItem('prData'));
      console.log("Fetch from Local Storage");
    }
  } else {
    toast("We can't cache your app data yet..");
  }
})();
