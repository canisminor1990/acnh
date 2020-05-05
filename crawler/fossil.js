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
					                         let img     = tdArr.eq(0).find('img').attr('src');
					                         const name  = tdArr.eq(0).find('a').attr('title');
					                         const price = tdArr.eq(3).text().replace(/\n/g, '');
					                         if (name&&img) {
						                         img        = img.replace('https://patchwiki.biligame.com/images/dongsen', '');
						                         data[name] = {
							                         img,
							                         price: parseInt(price)
						                         };
					                         }
				                         }
				                         fs.writeFileSync(filename, JSON.stringify(data));
			                         }
			                         done();
		                         }
	                         });
	Func.queue(url);
};

getData('data/fossil.json', 'https://wiki.biligame.com/dongsen/%E5%8C%96%E7%9F%B3%E5%9B%BE%E9%89%B4');