import Crawler from 'crawler';
import fs from 'fs';

const getData = (filename, url) => {
	const Func = new Crawler({
		                         maxConnections: 10,
		                         callback      : (error, res, done) => {
			                         if (error) {
				                         console.log(error);
			                         } else {
				                         const data  = {};
				                         const $     = res.$;
				                         const table = $('.wikitable').children('tbody').children('tr');
				                         for (var i = 0; i < table.length; i++) {
					                         const tdArr = table.eq(i).find('td');
					                         let name    = tdArr.eq(1).text().replace(/\n/g, '');
					                         let img     = tdArr.eq(3).find('img').attr('src');
					                         if (name) {
						                         img        = img.replace('https://patchwiki.biligame.com/images/dongsen', '');
						                         data[name] = img;
					                         }
				                         }
				                         fs.writeFileSync(filename, JSON.stringify(data));
			                         }
			                         done();
		                         }
	                         });
	Func.queue(url);
};

getData('data/cd.json', 'https://wiki.biligame.com/dongsen/%E5%94%B1%E7%89%87%E5%9B%BE%E9%89%B4');