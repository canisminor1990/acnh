import Crawler from 'crawler';
import _ from 'lodash';
import fs from 'fs';

const data       = {};
const assetsData = {};

const DIY = new Crawler({
	                        maxConnections: 10,
	                        callback      : (error, res, done) => {
		                        if (error) {
			                        console.log(error);
		                        } else {
			                        const $     = res.$;
			                        const table = $('#CardSelectTr').children('tbody').children('tr');
			                        for (var i = 0; i < table.length; i++) {
				                        const tdArr = table.eq(i).find('td');
				                        const name  = tdArr.eq(0).find('a').attr('title');
				                        const url   = tdArr.eq(0).find('a').attr('href');
				                        let img     = tdArr.eq(0).find('img').attr('src');
				                        let type    = tdArr.eq(1).text().replace(/\n/g, '');
				                        if (img) {
					                        if (!type) {
						                        if (type.indexOf('桌' > -1) ||
						                            type.indexOf('柜' > -1) ||
						                            type.indexOf('灯' > -1) ||
						                            type.indexOf('凳' > -1) ||
						                            type.indexOf('椅' > -1) ||
						                            type.indexOf('台' > -1) ||
						                            type.indexOf('推车' > -1) ||
						                            type.indexOf('床' > -1) ||
						                            type.indexOf('架' > -1) ||
						                            type.indexOf('马桶' > -1) ||
						                            type.indexOf('台' > -1) ||
						                            type.indexOf('沙发' > -1) ||
						                            type.indexOf('道具' > -1)) {
							                        type = '家具';
						                        } else if (type.indexOf('墙' > -1) ||
						                                   type.indexOf('地板' > -1)) {
							                        type = '墙壁·地板·地垫';
						                        } else if (type.indexOf('棒' > -1)) {
							                        type = '工具';
						                        } else {
							                        type = '其他';
						                        }
					                        }
					                        img = img.replace('https://patchwiki.biligame.com/images/dongsen/thumb', '');
					                        img = img.split('/');
					                        img.pop();
					                        img        = img.join('/');
					                        data[name] = {
						                        img,
						                        type,
						                        assets: {}
					                        };
					                        DiyPage.queue('https://wiki.biligame.com' + url);
				                        }
			                        }
		                        }
		                        done();
	                        }
                        });

const DiyPage = new Crawler({
	                            maxConnections: 10,
	                            callback      : (error, res, done) => {
		                            if (error) {
			                            console.log(error);
		                            } else {
			                            var $       = res.$;
			                            const table = $('.wikitable').children('tbody').children('tr');
			                            const name  = table.eq(0).find('th').text().replace(/\n/g, '');
			                            for (var i = 6; i < table.length - 1; i++) {
				                            const tdArr      = table.eq(i).find('td');
				                            const assetsName = tdArr.eq(0).text().replace(/\n/g, '');
				                            const assetsImg  = tdArr.eq(0).find('img').attr('src');
				                            const assetsNum  = parseInt(tdArr.eq(1).text());
				                            if (assetsName !== '50px') {
					                            data[name].assets[assetsName] = assetsNum;
					                            assetsData[assetsName]        = assetsImg.replace('https://patchwiki.biligame.com/images/dongsen', '');
				                            }
			                            }
			                            if (name === '树篱') {
				                            fs.writeFileSync('data/diy.json', JSON.stringify(data));
				                            fs.writeFileSync('data/diy-assets.json', JSON.stringify(assetsData));
			                            }
		                            }
		                            done();
	                            }
                            });

DIY.queue('https://wiki.biligame.com/dongsen/DIY%E9%85%8D%E6%96%B9');
