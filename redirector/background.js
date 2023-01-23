chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var redirects, pattern, from, to, redirectUrl;
    redirects = localStorage.getItem('redirects')
    if(redirects == null) {
      redirects = [["https://docs.google.com/(.*)","https://docs.google.com.mcas.ms/$1"],["https://meet.google.com/(.*)","https://meet.google.com.mcas.ms/$1"],["https://jira.([^.]+).org/(.*)","https://jira.$1.org.mcas.ms/$2"],["https://confluence.([^.]+).org.mcas.ms/(.*)","https://confluence.$1.org.mcas.ms/$2"]];
      localStorage.setItem('redirects',JSON.stringify(redirects));
      storageUpdate();      
    } else {
      redirects = JSON.parse(redirects);
    }
    for (var i=0; i<redirects.length; i++) {
      from = redirects[i][0];
      to = redirects[i][1];
      try {
        pattern = new RegExp(from, 'ig');
      } catch(err) {
        //bad pattern
        continue;
      }
      match = details.url.match(pattern);
      if (match) {
        redirectUrl = details.url.replace(pattern, to);
        if (redirectUrl != details.url) {
          return {redirectUrl: redirectUrl};
        }
      }
    }
    return {};
  },
  {
    urls: [
      "<all_urls>",
    ],
  },
  ["blocking"]
);
