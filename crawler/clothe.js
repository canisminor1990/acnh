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
					                         let name        = tdArr.eq(0).find('a').attr('title');
					                         let img         = tdArr.eq(0).find('img').attr('src');
					                         const color     = tdArr.eq(2).text().replace(/\n/g, '');
					                         const price     = tdArr.eq(3).text().replace(/\n/g, '');
					                         if (name) {
						                         name            = name.replace(color, '');
						                         img = img.replace('https://patchwiki.biligame.com/images/dongsen', '');
						                         if (!data[name]) {
							                         data[name] = {
								                         color: [img],
								                         price:parseInt(price)
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

getData('data/clothe-coat.json', 'https://wiki.biligame.com/dongsen/%E6%9C%8D%E9%A5%B0%E5%9B%BE%E9%89%B4'); //上装
getData('data/clothe-trousers.json', 'https://wiki.biligame.com/dongsen/%E4%B8%8B%E8%A3%85');  //下装
getData('data/clothe-dress.json', 'https://wiki.biligame.com/dongsen/%E8%BF%9E%E8%A1%A3%E8%A3%99'); //连衣裙
getData('data/clothe-hat.json', 'https://wiki.biligame.com/dongsen/%E5%B8%BD%E5%AD%90'); //帽子
getData('data/clothe-helmet.json', 'https://wiki.biligame.com/dongsen/%E5%A4%B4%E7%9B%94'); //头盔
getData('data/clothe-jewelry.json','https://wiki.biligame.com/dongsen/%E9%A5%B0%E5%93%81'); //饰品
getData('data/clothe-socks.json','https://wiki.biligame.com/dongsen/%E8%A2%9C%E5%AD%90'); //袜子
getData('data/clothe-shoes.json','https://wiki.biligame.com/dongsen/%E9%9E%8B'); //鞋子
getData('data/clothe-bag.json','https://wiki.biligame.com/dongsen/%E5%8C%85'); //包