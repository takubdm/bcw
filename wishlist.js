function BandcampWishlist()
{
  var urlToRetrieve = [];
  var eachCallback = function(result){};
  var finalCallback = function(){};
  this.loadWishlist = function(callback)
  {
    $.ajax({
      type: "POST",
      url: "wishlist.php",
      data: {
        'mode': 'load'
      },
      dataType: 'json',
      success: function(result)
      {
        var json = $.parseJSON(result);
        if (callback) callback(json);
      }
    });
  }
  this.retrieveData = function(tr, preFunc, ecb, fcb)
  {
    eachCallback = ecb === undefined ? eachCallback : ecb;
    finalCallback = fcb === undefined ? finalCallback : fcb;
    urlToRetrieve = [];
    var thNum = tr.parent().find('th').length;
    tr.each(function(){
      var url = $(this).data('url');
      var isAllNa = $(this).children('td').filter(function(){
        return $(this).text() == 'N/A';
      }).length == thNum;
      if (isAllNa) urlToRetrieve.push(url);
    });
    //
    preFunc();
    retrieveDataIterate(urlToRetrieve.pop());
  }
  var retrieveDataIterate = function(url)
  {
    if (url == null)
    {
      finalCallback();
      return;
    }
    //
    $.ajax({
      type: "POST",
      url: "wishlist.php",
      data: {
        'mode': 'retrieve',
        'url': url
      },
      dataType: 'json',
      success: function(result)
      {
        eachCallback(result);
        retrieveDataIterate(urlToRetrieve.pop());
      }
    });
  }
}
