<?php
  define('WISHLIST', 'wishlist.json');
  $func = array(
    'load' => 'load_wishlist',
    'retrieve' => 'retrieve_data'
  );
  $mode = $_POST['mode'];
  $func[$mode]();
?>
<?php
  function load_wishlist()
  {
      header('Access-Control-Allow-Origin: *');
      header('content-type: application/json; charset=utf-8');
    echo json_encode(file_get_contents(WISHLIST));
  }
  function update_wishlist($new_data, $current_data)
  {
    if (empty($new_data)) return;
    array_unshift($current_data, $new_data);
    file_put_contents(WISHLIST, json_encode($current_data));
  }
  function retrieve_data()
  {
    $response = array();
    $current_data = json_decode(file_get_contents(WISHLIST), true);
    $url = $_POST['url'];
    if (in_wishlist($url, $current_data))
    {
      $response['status'] = 'Data already exists.';
      $response['data'] = array('url' => $url);
    }
    else
    {
      $src = file_get_contents($url);
      $page_exists = $src && page_exists($src);
      if ($page_exists)
      {
        $album = get_album($src);
        $artist = get_artist($src);
        $price = get_price($src);
        $tags = get_tags($src);
        $new_data = array(
          'album' => $album,
          'artist' => $artist,
          'price' => $price,
          'tags' => $tags,
          'url' => $url
        );
        $response['status'] = 'Data retrieved.';
        $response['data'] = $new_data;
        update_wishlist($new_data, $current_data);
      }
      else
      {
        $response['status'] = 'Page does not exist.';
        $response['data'] = array(
          'url' => $url
        );
      }
    }
    header('content-type: application/json; charset=utf-8');
    echo json_encode($response);
  }
  function in_wishlist($url, $current_data)
  {
    $in_wishlist = false;
    foreach($current_data as $data)
    {
      if ($data['url'] == $url)
      {
        $in_wishlist = true;
        break;
      }
    }
    return $in_wishlist;
  }
  function get_tags($src)
  {
    $pattern = '|<a class="tag" .*?>(.*?)</a>|s';
    preg_match_all($pattern, $src, $matches);
    $tags = array();
    foreach($matches[1] as $match)
    {
      $tags[] = trim($match);
    }
    return $tags;
  }
  function get_price($src)
  {
    $pattern = '|<li class="buyItem digital">.*?</li>|s';
    $is_digital_available = preg_match($pattern, $src, $matches);
    if ($is_digital_available)
    {
      $src_digital = $matches[0];
      $pattern = '|<span class="base-text-color">(.*?)</span>|s';
      preg_match($pattern, $src_digital, $matches);
      $price = trim($matches[1]);

      if ($price == '')
      {
        $price = 'name your price';
      }
    }
    else
    {
      $price = '';
    }
    return $price;
  }
  function get_artist($src)
  {
    $pattern = '|<span itemprop="byArtist">\s+<a href=".*?">(.*?)</a>\s+</span>|s';
    preg_match($pattern, $src, $matches);
    $artist = trim($matches[1]);
    return $artist;
  }
  function get_album($src)
  {
    $pattern = '|<h2 class="trackTitle" itemprop="name">(.*?)</h2>|s';
    preg_match($pattern, $src, $matches);
    $album = trim($matches[1]);
    return $album;
  }
  function page_exists($src)
  {
    $pattern = '<h2>Sorry, that something isn’t here.</h2>';
    $page_exists = strpos($src, $pattern) === FALSE;
    return $page_exists;
  }
?>
