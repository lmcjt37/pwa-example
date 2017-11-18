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
            var item = localData["user_" + i];

            container.querySelector(`.user_${i}`).innerHTML =
                "<h4> Title: " + item.title + "</h4>" +
                "<h4> User: " + item.user + "</h4>" +
                "<h4> Created: " + (new Date(item.time)).toUTCString() +  "</h4>" +
                "<h4>" + "<a href='" + item.url + "'>Go to PR</a>"  + "</h4>";

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
                        url: items[i].pull_request.html_url
                    }

                    localStorage.setItem('prData', JSON.stringify(data));

                    container.querySelector(`.user_${i}`).innerHTML =
                        "<h4> Title: " + items[i].title + "</h4>" +
                        "<h4> User: " + items[i].user.login + "</h4>" +
                        "<h4> Created: " + (new Date(items[i].created_at)).toUTCString() +  "</h4>" +
                        "<h4>" + "<a href='" + items[i].pull_request.html_url + "'>Go to PR</a>"  + "</h4>";
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
            console.log("Fetched from API");
        } else {
            fetchDataFromLocalStorage(localStorage.getItem('prData'));
            console.log("Fetched from Local Storage");
        }
    } else {
        toast("We can't cache your app data yet..");
    }

    document.getElementById('butRefresh').addEventListener('click', function() {
        // Get fresh, updated data whenever it's clicked
        toast('Fetching latest data...');
        fetchData();
    });

})();
