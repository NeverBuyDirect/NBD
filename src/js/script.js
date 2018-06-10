$(document).ready(function () {

  var partners = null

  $.ajax({
    url: 'https://cdn.rawgit.com/NeverBuyDirect/cd97e752d0a01c86d4e281890ac154b8/raw/partners.js',
    dataType: 'jsonp',
    jsonpCallback: '_NBD_loadData',
    jsonp: false,
    success: function(data) {
      partners = data;
    }
  });

  function getSource(host) {
    return {
      'www.banggood.com': 'banggood',
      'www.amazon.com': 'amazon-us',
      'www.amazon.co.uk': 'amazon-uk',
    }[host];
  }

  function getSourceURI(source, parsedURI, data) {
    var func = {
      'banggood': function (parsedURI, data) {
        return parsedURI.search(function (query) {
          query.q = data.code;
          return query;
        }).href()
      },
      'amazon-us': function (parsedURI, data) {
        return parsedURI.search(function (query) {
          query.tag = data.code;
          return query;
        }).href()
      },
      'amazon-uk': function (parsedURI, data) {
        return parsedURI.search(function (query) {
          query.tag = data.code;
          return query;
        }).href()
      },
    }[source]
    if (func) return func(parsedURI, data);
    return parsedURI.href();
  }

  function getNewURI(parsedURI) {
    var host = parsedURI.host();
    var source = getSource(host);
    if (source) {
      var hasSource = partners.filter(function (e) {
        return e.sources[source];
      });
      var selected = hasSource[Math.floor(Math.random()*hasSource.length)];
      if (selected) {
        var selectedData = selected.sources[source];
        var newURI = getSourceURI(source, parsedURI, selectedData);
        return newURI;
      }
    }
    return parsedURI.href();
  }

  $('#go').click(function () {
    if (!partners) return;
    var uri = $('#uri').val();
    var parsedURI = URI(uri);
    var newURI = getNewURI(parsedURI);
    if (window.__NBD_EXTENSION__) {
      chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
        chrome.tabs.update(tab.id, { url: newURI });
        window.close();
      });
    } else window.location.href = newURI;
  })
})
