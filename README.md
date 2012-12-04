socket.io-proxy
===============

## Usage

### Request from JS (using socket.io client)

```javascript
var socket = io.connect('http://localhost:8080');

socket.emit('request', {
  url: 'path/to/request',
  method: 'POST',
  data: 'a=1&b=2&c=3',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
}, function(response) {
  console.log(response.responseText);
});
```

### Push from PHP (using elephant.io client)

```php
$socket = $_SERVER['HTTP_X_SOCKET_IO_ID']; 

$elephant = new Elephant('http://localhost:8080', 'socket.io', 1, false, true, true);
$elephant->init();
$elephant->emit('push', array('socket' => $socket, 'message' => 'some data'));
$elephant->close();
```

