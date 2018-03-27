function VueGenerator()
{
  this.resetProgress = function()
  {
    $('#processing > .num').text(0);
    $('#processed > .num').text(0);
  }
  this.updateTable = function(table, cb)
  {
    var callback = cb !== undefined ? cb : function(){};
    return function(result)
    {
      var status = result.status;
      if (status == "Page does not exist.")
      {
        var data = result.data;
        var url = data.url;
        var tr = table.find('tr.extend[data-url="' + url + '"]');
        tr.remove();
        console.error(status, url);
      }
      if (status == "Data already exists.")
      {
        var data = result.data;
        var url = data.url;
        var tr = table.find('tr.extend[data-url="' + url + '"]');
        tr.remove();
        console.warn(status, url);
      }
      if (status == "Data retrieved.")
      {
        var num = parseInt($('#wishlist > .num').text());
        var data = result.data;
        var artist = data.artist;
        var album = data.album;
        var price = data.price;
        var tags = data.tags;
        var url = data.url;
        var tr = table.find('tr.extend[data-url="' + url + '"]');
        tr.find('td.product').text('').append(
          $('<a href="' + url + '" target="_blank"></a>').append(
            $('<span class="album">' + album + '</span>')
          ).append(
            $('<span> by </span>')
          ).append(
            $('<span class="artist">' + artist + '</span>')
          )
        );
        tr.find('td.price').text(
          price == '' ? 'N/A' : price
        );
        tr.find('td.tags').text(
          tags == '' ? 'N/A' : tags.join(", ")
        );
        tr.removeClass('extend');
        $('#wishlist > .num').text(num + 1);
        callback();
      }
      var currentProcessed = parseInt($('#processed > .num').text());
      $('#processed > .num').text(currentProcessed + 1);
      stripeTable(table.find('tr:gt(0):visible'));
    }
  }
  this.extendTable = function(urls, table)
  {
    urls = urls.reverse();
    urls.forEach(function(url)
    {
      var tr = $('<tr class="extend"></tr>').attr('data-url', url).append(
        $('<td class="product">N/A</td>')
      ).append(
        $('<td class="price">N/A</td>')
      ).append(
        $('<td class="tags">N/A</td>')
      );
      tr.insertBefore(table.find('tr:eq(1)'));
    });
    $('#processing > .num').text(urls.length);
    //stripeTable(table.find('tr:gt(0)'));
  }
  this.generateTable = function(container, cb)
  {
    var callback = cb !== undefined ? cb : function(){};
    return function(data)
    {
      var table = $('<table></table>').append(
        $('<caption></caption>').append(
          $('<span id="wishlist"><h2>wishlist</h2><span class="num"></span></span>')
        ).append(
          $('<span id="processing"><h2>processing</h2><span class="num">0</span></span>')
        ).append(
          $('<span id="processed"><h2>processed</h2><span class="num">0</span></span>')
        )
      ).append(
        $('<tbody></tbody>')
      ).append(
        $('<tr class="header"></tr>').append(
          $('<th class="product">Product</th><th class="price">Price</th><th class="tags">Tags</th>')
        )
      );
      var even_odd = ['even', 'odd'];
      var eo = 0;
      data.forEach(function(info)
      {
        var artist = info.artist;
        var album = info.album;
        var price = info.price != '' ? info.price : 'N/A';
        var tags = info.tags != '' ? info.tags : ['N/A'];
        var url = info.url;
        var tr = $('<tr></tr>').attr('data-url', url);
        var tdProduct = $('<td class="product"></td>');
        if (artist != "" && album != "")
        {
          tdProduct.append(
            $('<a href="' + url + '" target="_blank"></a>').append(
              $('<span class="album">' + album + '</span>')
            ).append(
              $('<span> by </span>')
            ).append(
              $('<span class="artist">' + artist + '</span>')
            )
          );
        }
        else
        {
          tdProduct.text('N/A');
        }
        var tdPrice = $('<td class="price">' + price + '</td>');
        var tdTags = $('<td class="tags">' + tags.join(", ") + '</td>');
        tr.append(tdProduct);
        tr.append(tdPrice);
        tr.append(tdTags);
        table.append(tr);
      });
      stripeTable(table.find('tr:gt(0)'));
      table.find('#wishlist > .num').text(data.length);
      container.append(table);
      callback();
    }
  }
  var stripeTable = function(tr)
  {
    var eo = 0;
    tr.each(function(){
      $(this).addClass(['even', 'odd'][eo++ % 2]);
      $(this).removeClass(['even', 'odd'][eo % 2]);
    });
  }
}
