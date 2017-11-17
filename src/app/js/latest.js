(function() {
  'use strict';

  var app = {
    spinner: document.querySelector('.loader')
  };

  var container = document.querySelector('.container');

  function fetchCommits() {
    var url = 'https://api.github.com/repos/unicodeveloper/resources-i-like/commits';

    fetch(url)
    .then(function(fetchResponse){
      return fetchResponse.json();
    })
    .then(function(response) {

        var commitData = {
            'first': {
              message: response[0].commit.message,
              author: response[0].commit.author.name,
              time: response[0].commit.author.date,
              link: response[0].html_url
            },
            'second': {
              message: response[1].commit.message,
              author: response[1].commit.author.name,
              time: response[1].commit.author.date,
              link: response[1].html_url
            },
            'third': {
              message: response[2].commit.message,
              author: response[2].commit.author.name,
              time: response[2].commit.author.date,
              link: response[2].html_url
            },
            'fourth': {
              message: response[3].commit.message,
              author: response[3].commit.author.name,
              time: response[3].commit.author.date,
              link: response[3].html_url
            },
            'fifth': {
              message: response[4].commit.message,
              author: response[4].commit.author.name,
              time: response[4].commit.author.date,
              link: response[4].html_url
            }
        };

        container.querySelector('.first').innerHTML =
        "<h4> Message: " + response[0].commit.message + "</h4>" +
        "<h4> Author: " + response[0].commit.author.name + "</h4>" +
        "<h4> Time committed: " + (new Date(response[0].commit.author.date)).toUTCString() +  "</h4>" +
        "<h4>" + "<a href='" + response[0].html_url + "'>Click me to see more!</a>"  + "</h4>";

        container.querySelector('.second').innerHTML =
        "<h4> Message: " + response[1].commit.message + "</h4>" +
        "<h4> Author: " + response[1].commit.author.name + "</h4>" +
        "<h4> Time committed: " + (new Date(response[1].commit.author.date)).toUTCString()  +  "</h4>" +
        "<h4>" + "<a href='" + response[1].html_url + "'>Click me to see more!</a>"  + "</h4>";

        container.querySelector('.third').innerHTML =
        "<h4> Message: " + response[2].commit.message + "</h4>" +
        "<h4> Author: " + response[2].commit.author.name + "</h4>" +
        "<h4> Time committed: " + (new Date(response[2].commit.author.date)).toUTCString()  +  "</h4>" +
        "<h4>" + "<a href='" + response[2].html_url + "'>Click me to see more!</a>"  + "</h4>";

        container.querySelector('.fourth').innerHTML =
        "<h4> Message: " + response[3].commit.message + "</h4>" +
        "<h4> Author: " + response[3].commit.author.name + "</h4>" +
        "<h4> Time committed: " + (new Date(response[3].commit.author.date)).toUTCString()  +  "</h4>" +
        "<h4>" + "<a href='" + response[3].html_url + "'>Click me to see more!</a>"  + "</h4>";

        container.querySelector('.fifth').innerHTML =
        "<h4> Message: " + response[4].commit.message + "</h4>" +
        "<h4> Author: " + response[4].commit.author.name + "</h4>" +
        "<h4> Time committed: " + (new Date(response[4].commit.author.date)).toUTCString() +  "</h4>" +
        "<h4>" + "<a href='" + response[4].html_url + "'>Click me to see more!</a>"  + "</h4>";

        app.spinner.setAttribute('hidden', true);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  fetchCommits();
})();
