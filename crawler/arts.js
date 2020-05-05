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
					                         const name  = tdArr.eq(1).text().replace(/\n/g, '');
					                         const fake  = tdArr.eq(2).text().replace(/\n/g, '');
					                         const size  = tdArr.eq(4).text().replace(/\n/g, '').split('(')[0];
					                         if (name && img) {
						                         img        = img.replace('https://patchwiki.biligame.com/images/dongsen', '');
						                         if (!data[name]) data[name] = {};
						                         if (fake === '真') {
							                         data[name].img = img;
						                         } else if (fake === '假') {
							                         data[name].fakeImg = img;
						                         } else {
							                         data[name].img = img;
						                         }
						                         data[name].size = size;
					                         }
				                         }
				                         fs.writeFileSync(filename, JSON.stringify(data));
			                         }
			                         done();
		                         }
	                         });
	Func.queue(url);
};

getData('data/handbook-arts.json', 'https://wiki.biligame.com/dongsen/%E8%89%BA%E6%9C%AF%E5%93%81%E5%9B%BE%E9%89%B4');