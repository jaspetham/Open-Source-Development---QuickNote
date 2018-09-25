
function test(data){
	data = $("textarea").val();
	url = 'https://www.googleapis.com/language/translate/v2/?key=AIzaSyBaCbw811-33ALxpaOuBTiLononQL9i9Oo&target=zh&source=en&q='+data;
	return $.ajax({
    url: url,
    type: 'GET',
    data: data ? JSON.stringify(data) : "",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
	 success: function(response) {
			data = response.data.translations[0].translatedText;
			if(data === ''){
				alert("Content is empty");
				console.log("Translate Failed: Content is empty");
			}else{
				console.log("Translate Success: " + data);
				alert("Content Translation to Chinese: "+ data);
			}
        }
  });
	}


