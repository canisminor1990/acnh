import Crawler from 'crawler';
import fs from 'fs';
import _ from "lodash"

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
					                         const tdArr     = table.eq(i).find('td');
					                         let img         = tdArr.eq(0).find('img').attr('src');
					                         const colorType = tdArr.eq(1).text().replace(/\n/g, '');
					                         const name      = tdArr.eq(2).text().replace(/\n/g, '');
					                         const price     = tdArr.eq(3).text().replace(/\n/g, '');
					                         const orderType = tdArr.eq(6).text().replace(/\n/g, '');
					                         const type      = tdArr.eq(7).text().replace(/\n/g, '');
					                         const size      = tdArr.eq(8).text().replace(/\n/g, '').split("(")[0];
					                         if (name && img) {
						                         img  = img.replace('https://patchwiki.biligame.com/images/dongsen', '');
						                         if (!data[name]) {
							                         data[name] = {
								                         img: [img],
								                         price: parseInt(price),
								                         type,
								                         orderType,
								                         colorType,
								                         size
							                         };

						                         }
						                         data[name].img.push(img);
					                         }
				                         }
				                         fs.writeFileSync(filename, JSON.stringify(data));
			                         }
			                         done();
		                         }
	                         });
	Func.queue(url);
};

//getData('data/furniture_1.json', 'https://wiki.biligame.com/dongsen/%E5%AE%B6%E5%85%B7%E5%9B%BE%E9%89%B4');
//getData('data/furniture_2.json', 'https://wiki.biligame.com/dongsen/%E9%9D%9E%E5%8D%96%E5%93%81%E5%AE%B6%E5%85%B7');

const file_1 = JSON.parse(fs.readFileSync('data/furniture_1.json','utf-8'))
const file_2 = JSON.parse(fs.readFileSync('data/furniture_2.json','utf-8'))
const file = {...file_1,...file_2}

const furnitureBig = {}
const furnitureSmall = {}
const furnitureWall = {}

_.forEach(file,(item,name) => {
	if (item.type === "家具") furnitureBig[name] = item
	if (item.type === "小物件") furnitureSmall[name] = item
	if (item.type === "壁挂物") furnitureWall[name] = item
})

fs.writeFileSync('data/furniture-big.json', JSON.stringify(furnitureBig));
fs.writeFileSync('data/furniture-small.json', JSON.stringify(furnitureSmall));
fs.writeFileSync('data/furniture-wall.json', JSON.stringify(furnitureWall));


