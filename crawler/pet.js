import Crawler from 'crawler';
import _ from 'lodash';
import fs from 'fs';

const data = {};

const Pet = new Crawler({
	                        maxConnections: 10,
	                        callback      : (error, res, done) => {
		                        if (error) {
			                        console.log(error);
		                        } else {
			                        const $       = res.$;
			                        const table = $('#CardSelectTr').children('tbody').children('tr');
			                        for (var i = 0; i < table.length; i++) {
				                        const tdArr     = table.eq(i).find('td');
				                        const name      = tdArr.eq(0).find('a').attr('title');
				                        const avatar    = tdArr.eq(0).find('img').attr('src');
				                        const url       = tdArr.eq(0).find('a').attr('href');
				                        const sex       = tdArr.eq(1).text().replace(/\n/g, '');
				                        const character = tdArr.eq(2).text().replace(/\n/g, '');
				                        const race      = tdArr.eq(3).text().replace(/\n/g, '');
				                        const birth     = tdArr.eq(4).text().replace(/\n/g, '').split("月");
				                        const phrase    = tdArr.eq(5).text().replace(/\n/g, '');
				                        if (avatar) {
					                        data[name] = {
						                        avatar:avatar.replace("https://patchwiki.biligame.com/images/dongsen",""),
						                        avatarBig: '',
						                        sex,
						                        character,
						                        race,
						                        birthMouth:parseInt(birth[0]),
						                        birthDay:parseInt(birth[1].replace("日",'').replace(/ /g,'')),
						                        phrase,
						                        motto    : ''
					                        };
					                        PetPage.queue('https://wiki.biligame.com' + url);
				                        }
			                        }
		                        }
		                        done();
	                        }
                        });

const PetPage = new Crawler({
	                            maxConnections: 10,
	                            callback      : (error, res, done) => {
		                            if (error) {
			                            console.log(error);
		                            } else {
			                            var $           = res.$;
			                            const name      = $('.mw-selflink.selflink').text().replace(/\n/g, '');
			                            const avatarBig = $('.box-poke-right').find('img').attr('src');
			                            const box       = $('.box-poke-left').find('.box-poke');
			                            const motto     = box.eq(4).find('.box-font').text().replace(/\n/g, '');
			                            const jpen     = box.eq(5).find('.box-font').text().replace(/\n/g, '').split("(英)");
			                            if (data[name]) {
				                            data[name].motto     = motto;
				                            data[name].avatarBig = avatarBig.toString().replace("https://patchwiki.biligame.com/images/dongsen","");
				                            data[name].nameEN = jpen[0];
				                            data[name].nameJP = jpen[1].replace("(日)", '').replace(/\s*/g,"");
			                            }
			                            if (name === '阿研') fs.writeFileSync('data/pet.json', JSON.stringify(data));
		                            }
		                            done();
	                            }
                            });

Pet.queue('https://wiki.biligame.com/dongsen/%E5%B0%8F%E5%8A%A8%E7%89%A9%E5%9B%BE%E9%89%B4');
