var utils = {
	connectionDB : function(mongoose, config){
		var path;

		path = 'mongodb://';
		//path += config.user + ':' + config.password  + '@';
		path += config.db.host + (config.db.port.length > 0 ? ':' : '');		
		path += config.db.port + '/';		
		path += config.db.collection;
		console.log(path)
		return mongoose.connect(path);
	},
	create_avatar : function(cheerio, request, done){		
		var url = 'https://octodex.github.com';
		var arr =[];
		request(url, function(error, response, html){
			console.log(error)
			console.log(response)
			console.log(html)
			if(!error){
				var $ = cheerio.load(html);
				$('.item a').each(function (index, value){
					gitavatar = $(this).first().children().attr('data-src');
					if (gitavatar !== undefined){
					var final= url+gitavatar;
					arr.push(final);
					}
				});					
				result = arr[getRamdom(0,arr.length)];	
				console.log(result);
				done(result);
				return;
			}else{
				done('');
				return;
			}
		});

		function getRamdom(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		
	}
};

module.exports = utils;