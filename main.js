var site = [];
var polltion = []

$( document ).ready(function() {
	
	getJsonData();

});


function getJsonData(){
	var url = 'http://opendata.epa.gov.tw/webapi/api/rest/datastore/355000000I-000001?sort=SiteName&offset=0&limit=12&filters={%22County%22:%22%E9%AB%98%E9%9B%84%E5%B8%82%22}&callback=?'
	$.getJSON(url,function(result){
		var record = result.result.records

		for(var k in record){
			site[k] = record[k].SiteName;
			pollution[k] = record[k]["PM2.5"]
		}
	})


};

