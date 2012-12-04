var url = require('url'),
	http = require('http'),
	server = require('../../library/socket.io').listen(8080);

server.sockets.on('connection', function(socket) {
	socket.on('push', function(options, callback) {
		if(options.socket) {
			var destination = server.sockets.socket(options.socket);
			
			if(destination && options.message) {
				destination.emit('push', options.message);
			}
		}
	});
	
	socket.on('request', function(options, callback) {
		var headers = socket.handshake.headers,
			options = options || {},
			data = options.data || null,
			urlData = {};
		
		if(typeof options.url === 'string') {
			urlData = url.parse(options.url || '');
		}
		
		if(options.headers) {
			for(var key in options.headers) {
				headers[key] = options.headers[key];
			}
		}
		
		headers['x-socket-io-id'] = socket.id;
		
		var port = options.port || 80,
			path = options.path || urlData.path || '';
		
		var hostname = options.hostname || urlData.hostname;
		
		if(!hostname) {
			urlData = url.parse(headers.referer);
			hostname = urlData.hostname;
			
			if(path.indexOf('/') !== 0) {
				path = urlData.path + path;
			}
		}
		
		var method = (options.method || (data ? 'POST' : 'GET')).toUpperCase();
		
		var request = http.request({
			hostname: hostname,
			port: port,
			path: path,
			method: method,
			headers: headers
		});
		
		request.on('response', function(response) {
			var result = {
				status: response.statusCode,
				headers: response.headers,
				success: true
			};
			
			var data = [];
			
			response.on('data', function(responseData) {
				data.push(responseData);
			});
			
			response.on('end', function() {
				var responseData = data.join('');
				
				result.responseText = responseData;
				
				if(typeof callback === 'function') {
					callback(result);
				}
			});
		});
		
		if(data) {
			request.write(data);
		}
		
		request.end();
	});
});