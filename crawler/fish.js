import Crawler from 'crawler';
import fs from 'fs';
import _ from 'lodash'

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
					                         const name        = tdArr.eq(0).find('a').attr('title');
					                         let img         = tdArr.eq(0).find('img').attr('src');
					                         const place     = tdArr.eq(1).text().replace(/\n/g, '');
					                         const weather     = tdArr.eq(2).text().replace(/\n/g, '');
					                         let monthN     = tdArr.eq(3).text().replace(/\n/g, '').replace('（全年）、','').split('、');
					                         let monthS     = tdArr.eq(4).text().replace(/\n/g, '').replace('（全年）、','').split('、');
					                         let time     = tdArr.eq(5).text().replace(/\n/g, '').replace('（全天）、','').split('、');
					                         const price     = tdArr.eq(6).text().replace(/\n/g, '');
					                         if (name) {
						                         img = img.replace('https://patchwiki.biligame.com/images/dongsen', '');
						                         data[name] = {
							                         img,
							                         place,
							                         weather,
							                         monthN:handleNum(monthN),
							                         monthS:handleNum(monthS),
							                         time:handleNum(time),
							                         price:parseInt(price)
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

function handleNum (arry)  {
	let newArry = []
	_.forEach(arry,num => {
		newArry.push(parseInt(num))
	})
	return _.compact(newArry.sort((a,b)=> a-b))
}

getData('data/handbook-fish.json', 'https://wiki.biligame.com/dongsen/%E5%8D%9A%E7%89%A9%E9%A6%86%E5%9B%BE%E9%89%B4'); //鱼
getData('data/handbook-insect.json', 'https://wiki.biligame.com/dongsen/%E8%99%AB%E5%9B%BE%E9%89%B4');  //虫
