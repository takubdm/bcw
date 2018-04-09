function AddOn()
{
  var DEFAULT_TEXT = 'Tags';
  var WISHLIST_FILTERED_TEXT = {
    true: 'filtered',
    false: 'wishlist'
  };
  var FILTERED_TEXT = 'filtered';
  var isRegExpEnabled = false;
  this.showUsage = function()
  {
    console.info([
        "Usage:",
        " - showUsage()",
        "    Shows this.",
        " - toggleRegExp()",
        "    Toggles RegExp for tags."
    ].join("\n"));
  }
  this.toggleRegExp = function()
  {
    isRegExpEnabled = !isRegExpEnabled;
    console.log('isRegExpEnabled: ' + isRegExpEnabled);
  }
  this.enableTagLinks = function()
  {
    var thTags = $('th.tags');
    var tdTags = $('td.tags');
    tdTags.each(function(){
      var links = [];
      var tags = $(this).text().split(", ");
      tags.forEach(function(tag){
        links.push('<a href="#' + tag + '">' + tag + '</a>');
      });
      $(this).html(links.join(", "));
    });
    tdTags.find('a').off('click');
    tdTags.find('a').on('click', function(){
      var tag = $(this).text();
      var thTags = $('th.tags');
      var criteria = thTags.text().split(",");
      var isTagExists = false;
      criteria = criteria.filter(function(criterion){
        criterion = criterion.trim();
        tagExists = criterion.match(new RegExp(RegExp.escape(tag), 'i'));
        if (tagExists) isTagExists= true;
        return criterion != "" && criterion != DEFAULT_TEXT && !tagExists;
      });
      if (!isTagExists) criteria.push(tag);
      thTags.text(criteria.join(", "));
      thTags.trigger($.Event('keypress', {'keyCode': 13}));
      thTags.trigger('blur');
      $(this).trigger('blur');
      return false;
    });
  }
  this.resetFilter = function()
  {
    var thTags = $('th.tags');
    thTags.text('');
    thTags.trigger($.Event('keypress', {'keyCode': 13}));
    thTags.text(DEFAULT_TEXT);
  }
  this.enableSearchForm = function()
  {
    var thTags = $('th.tags');
    thTags.attr('contenteditable', true);
    thTags.on('keypress', funcKeyPress);
  }
  this.disableSearchForm = function()
  {
    var thTags = $('th.tags');
    thTags.attr('contenteditable', false);
    thTags.off('keypress');
  }
  this.disableTagLinks = function()
  {
    var tdTags = $('tr:gt(0) td.tags');
    tdTags.find('a').off('click');
    tdTags.each(function(){
      var innerHTML = $(this).html().replace(/<a .*?>(.*?)<\/a>/g, "<span>$1</span>");
      $(this).html(innerHTML);
    });
  }
  this.addSearchForm = function()
  {
    var thTags = $('th.tags');
    thTags.attr('contenteditable', true).focus(function(){
      if ($(this).text() == DEFAULT_TEXT)
      {
        container.find('tr:gt(0)').show();
        $(this).text('');
      }
    }).blur(function(){
      if ($(this).text().trim() == "")
      {
        container.find('tr:gt(0)').show();
        $(this).text(DEFAULT_TEXT);
      }
    }).on('keypress', funcKeyPress);
  }
  var funcKeyPress = function(e)
  {
    if (e.keyCode != 13) return; // ENTER
    var tr = container.find('tr:gt(0)');
    var allTrNum = tr.length;
    tr.show();
    var criteria = $(this).text().split(",");
    //
    var matchedTr = tr.filter(function(){
      var tags = $(this).find('td.tags').text().split(", ");
      return !searchTags(criteria, tags);
    });
    var matchedTrNum = matchedTr.length;
    matchedTr.hide();
    stripeTable(container.find('tr:gt(0):visible'));
    $('#wishlist > h2').text(
      WISHLIST_FILTERED_TEXT[ matchedTrNum > 0 ]
    );
    $('#wishlist > .num').text(allTrNum - matchedTrNum);
    //
    return false;
  }
  var searchTags = function(criteria, target)
  {
    return criteria.every(function(criterion){
      criterion = criterion.trim();
      var isTagIncluded = false;
      for (var i=0, l=target.length; i<l; i++)
      {
        var pattern = isRegExpEnabled ?
          criterion :
          RegExp.escape(criterion);
        if (target[i].match(new RegExp(pattern, 'i')))
        {
          isTagIncluded = true;
          break;
        }
      }
      return isTagIncluded;
    });
  }
  var stripeTable = function(tr)
  {
    var eo = 0;
    tr.each(function(){
      $(this).attr('class', ['even', 'odd'][eo++ % 2]);
    });
  }
}
RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
