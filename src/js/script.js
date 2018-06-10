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
      'www.gearbest.com': 'gearbest',
      'www.amazon.com': 'amazon-us',
      'www.amazon.co.uk': 'amazon-uk',
      'www.amazon.fr': 'amazon-fr',
      'www.amazon.ca': 'amazon-ca',
      'www.amazon.de': 'amazon-de',
      'www.amazon.it': 'amazon-it',
      'www.amazon.nl': 'amazon-nl',
      'www.amazon.es': 'amazon-es',
      'www.amazon.com.au': 'amazon-au',
      'www.amazon.mx': 'amazon-mx',
      'www.amazon.com.br': 'amazon-br',
      'www.amazon.in': 'amazon-in',
      'www.amazon.co.jp': 'amazon-jp',
      'www.amazon.com.sg': 'amazon-sg',
      'www.amazon.cn': 'amazon-cn',
    }[host];
  }

  function getSourceURI(source, parsedURI, data) {

    function simpleCode(key, dataKey) {
        return function (parsedURI, data) {
            return parsedURI.search(function (query) {
              query[key] = data[dataKey];
              return query;
            }).href()
        }
    }

    var amazon = simpleCode('tag', 'code');

    var func = {
      'banggood': simpleCode('q', 'code'),
      'gearbest': simpleCode('lkid', 'lkid'),
      'amazon-us': amazon,
      'amazon-uk': amazon,
      'amazon-fr': amazon,
      'amazon-ca': amazon,
      'amazon-de': amazon,
      'amazon-it': amazon,
      'amazon-nl': amazon,
      'amazon-es': amazon,
      'amazon-au': amazon,
      'amazon-mx': amazon,
      'amazon-br': amazon,
      'amazon-in': amazon,
      'amazon-jp': amazon,
      'amazon-sg': amazon,
      'amazon-cn': amazon,
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
      chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        chrome.tabs.update(tab.id, { url: newURI });
        window.close();
      });
    } else window.location.href = newURI;
  })
})
