var information = [];
getJsonData();

function getJsonData(){
	var pollution = [];
	//取環保署上的空污檢測資料
	var url = 'http://opendata.epa.gov.tw/webapi/api/rest/datastore/355000000I-000001?sort=SiteName&offset=0&limit=12&filters={%22County%22:%22%E9%AB%98%E9%9B%84%E5%B8%82%22}&callback=?'
	$.getJSON(url,function(result){
		var record = result.result.records

		for(var k in record){
			information.push({"SiteName": record[k].SiteName,"PM2.5": record[k]["PM2.5"], "Status": record[k].Status, "FPMI": record[k].FPMI, "WindSpeed": record[k].WindSpeed, "WindDirec": record[k].WindDirec, "FPMI": record[k].FPMI})
			pollution[k] = parseInt(record[k]["PM2.5"]);
		}

		pollution.sort(sortNumber)//排序污染數值
		var worstPollution = pollution[pollution.length-1]//取得最高污染數值
	
		//找出高污染的測量站
		var arrayIndex 
		$(information).each(function(index){
			
			if(this["PM2.5"] == worstPollution)
				arrayIndex = index;
		})
		var pollutionStation = information[arrayIndex].SiteName;
		var fpmi = information[arrayIndex].FPMI;
		worstAlert(worstPollution,pollutionStation,fpmi);
		getWeatherData();

	})
	
	//setTimeout(function(){getJsonData();}",3600000);
};

//動畫跑數字
function countAni(num,terminal){
	$(".alertPoint span:first").text(num);
	num++;
	if(num <= terminal)
		setTimeout(function(){countAni(num,terminal)}, 5);
}

//取openweathermap上的天氣資料
function getWeatherData(){
	var weather;
	var wind;
	var temp;
	
	var url = "http:/api.openweathermap.org/data/2.5/weather?q=Kaohsiung&units=metric&appid=9bd9cd77026d92f5c8c4b080d990223c&callback=?"
	$.getJSON(url,function(result){
		weather = result.weather;
		temp = result.main.temp;
		wind = result.wind;
		$("#temperature").text(temp);
		$("#weather i").addClass(weatherIcon(weather[0]["id"])).prop("title",weather[0]["main"]);
		$("#wind #winddir").addClass("wi-wind towards-"+wind.deg+"-deg").prop("title","deg-"+wind.deg);
		$("#wind #windspeed").addClass("wi-wind-beaufort-"+Math.round(wind.speed)).prop("title","speed-"+Math.round(wind.speed));		
	})
}

//weather code 對應 icon
function weatherIcon(code){
	var icon;
	var hour = new Date().getHours();
	var daynight;
	if(hour < 6 || hour > 18){
		daynight = "night";
	}else{
		daynight = "day";
	}

	if(code >= 200 && code <= 232){
		icon = "wi-"+daynight+"-thunderstorm";
	}else if(code >= 300 && code <= 321){
		icon = "wi-"+daynight+"-rain";
	}else if(code >= 500 && code <= 531){
		icon = "wi-"+daynight+"-rain";
	}else if(code >= 600 && code <= 622){
		icon = "wi-"+daynight+"-snow";
	}else if(code >= 701 && code <= 781){
		icon = "wi-"+daynight+"-fog";
	}else if(code >= 800 && code <= 804){
		if(code == 800){
			if(daynight == "day"){
				icon = "wi-day-sunny";
			}else{
				icon = "wi-night-clear";
			}
		}else{
			icon = "wi-"+daynight+"-cloudy";
		}
	}else if(code == 962 || code == 902){
		icon = "wi-hurricane";
	}

	return icon
}

function worstAlert(point,station,fpmi){
	$(".condition").removeClass("font-good font-safe font-warning font-danger")//消除顏色CSS
		
	//依據指標做出分類
	var alertScale;
	var notice;
	var colorType;
	var img;
	var rand;
	if(fpmi<4){
		rand = Math.floor(Math.random() * 4) + 1; 
		img= "g-"+rand+".jpg";
		alertScale = "良好";
		notice = "正常戶外活動。";
		colorType = "font-good";
		$(".notice").text(notice);
	}else if(fpmi < 7){
		rand = Math.floor(Math.random() * 4) + 1;
		img= "g-"+rand+".jpg";
		alertScale = "普通";
		notice = "正常戶外活動。";
		colorType = "font-safe";
	}else if(fpmi <10){
		rand = Math.floor(Math.random() * 3) + 1; 
		img= "b-"+rand+".jpg";
		alertScale = "不良";
		notice = "任何人如果有不適，如眼痛，咳嗽或喉嚨痛等，應該考慮減少戶外活動。";
		colorType = "font-warning";
	}else{
		rand = Math.floor(Math.random() * 3) + 1;
		img= "b-"+rand+".jpg";
		alertScale = "極度危險";
		notice = "任何人如果有不適，如眼痛，咳嗽或喉嚨痛等，應減少體力消耗，特別是減少戶外活動。";
		colorType = "font-danger";
		
	}
	$(".mask").hide()
	$("#head").css("background-image","url(image/"+img+")");
	$(".condition").text(alertScale);
	$(".condition, .alertPoint span:first").addClass(colorType);
	$(".alertPoint span").eq(1).html("<strong>μg/m3 ("+station+")</strong>");
	$(".notice").text(notice);
	countAni(0,point)
}


function sortNumber(a,b){//排序
	return a - b
}

