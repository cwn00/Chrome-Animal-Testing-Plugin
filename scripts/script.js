var companiesThatTest;

var xhr = new XMLHttpRequest();
xhr.open( 'GET', 'http://features.peta.org/cruelty-free-company-search/cruelty_free_companies_search.aspx?Dotest=8', true );
xhr.responseType = 'document';
xhr.onload = function( e ) {
	var response = xhr.response;

	// Get #jsonArray from the xhr response, filter out some useless stuff that was making the string invalid json
	var petaJsonArray = $(response).find("#jsonArray script")
		.text()
		.replace( "var companyJson = ", "" )
		.replace( ";jQuery(function(){renderGridFromJSON(companyJson, document.getElementById('ddlResultCount').value, 0);});", "" );
	
	// Parse #jsonArray in to a JSON object
	var companiesThatTestJsonArray = JSON.parse( petaJsonArray );

	// Build an array of company names that test on animals
	var companyNameArray = [];
	for (var i = companiesThatTestJsonArray.length - 1; i >= 0; i--) {
		var companyName = companiesThatTestJsonArray[i].com_ComName.split(" (")[0];
		companyNameArray.push(companyName);

		console.log(companyName);
	}

	// Split the product titles in to arrays to they can be compared to the company list
	var productName = $(".desc span[data-title='true']").text().split(" ");

	$(".desc span[data-title='true']").each(function( key, value ) {
		var nameArray = $(value).text().split(" ");

		if( compareArrays( companyNameArray, nameArray ) ) {
			$(this).css("color", "red");
		}
	});
}

xhr.send();

// Compare two arrays and return boolean depending on if they contain a matching value
var compareArrays = function ( haystack, arr ) {
    return arr.some(function ( v ) {
        return haystack.indexOf( v ) >= 0;
    });
};