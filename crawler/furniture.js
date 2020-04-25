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
				                         const table = $('#CardSelectTr').children('tbody').children('tr');
				                         for (var i = 0; i < table.length; i++) {
					                         const tdArr     = table.eq(i).find('td');
					                         let img         = tdArr.eq(0).find('img').attr('src');
					                         const colorType = tdArr.eq(1).text().replace(/\n/g, '');
					                         const name      = tdArr.eq(2).text().replace(/\n/g, '');
					                         const price     = tdArr.eq(3).text().replace(/\n/g, '');
					                         const orderType = tdArr.eq(6).text().replace(/\n/g, '');
					                         const type      = tdArr.eq(7).text().replace(/\n/g, '');
					                         const size      = tdArr.eq(8).text().replace(/\n/g, '');
					                         if (name) {
						                         img  = img.replace('https://patchwiki.biligame.com/images/dongsen', '');
						                         if (!data[name]) {
							                         data[name] = {
								                         img,
								                         color: [],
								                         price: parseInt(price),
								                         type,
								                         orderType,
								                         colorType,
								                         size
							                         };

						                         }
						                         data[name].color.push(img);
					                         }
				                         }
				                         fs.writeFileSync(filename, JSON.stringify(data));
			                         }
			                         done();
		                         }
	                         });
	Func.queue(url);
};

getData('data/furniture_order.json', 'https://wiki.biligame.com/dongsen/%E5%AE%B6%E5%85%B7%E5%9B%BE%E9%89%B4'); //订购