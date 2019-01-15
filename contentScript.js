var link = document.createElement("link")
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL('css/fontawesome.min.css');
    document.head.appendChild(link);

var fa = document.createElement('style');
    fa.type = 'text/css';
    fa.textContent = '@font-face { font-family: Font Awesome\ 5 Brands; font-style: normal; font-weight: 400; src: url('
        + chrome.extension.getURL('webfonts/fa-brands-400.woff2')
        + ')}';
    document.head.appendChild(fa);

getYelpBusinesses();

var iframe = "<li id='yelp-review-link'><a class='af75dbc5 _40f1eb59' href='#yelp-review'><span>Yelp Reviews</span></a></li>";
$('[id=reviews-link]').after(iframe);

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    if($('[id=yelp-review-link]').length === 0) {
    	$('[id=reviews-link]').after(iframe);
    }
});

observer.observe(document, {
  subtree: true,
  attributes: true
});

let yelpData;
function getYelpBusinesses() {
	const http = new XMLHttpRequest();
	const url = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?name=Miku&location=toronto';
	http.open('GET', url, true);
	http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	http.setRequestHeader('Authorization', 'Bearer 2KeDzCByqhkD8XrwPfhOnzFaslZ3h6uDpw8XTUDUu9IO6PJAVRqRIOPFlF24Xuyz1vtV2W0RX3DOu8B9KmRJA9_jn3NXV3y_8L8biBUgI_3T510xIPywz-ktfnY2XHYx');
	http.send();
	http.onreadystatechange=(e)=>{
		if (http.readyState == 4 && http.status == 200 && http.responseText != null) {	
			const data = JSON.parse(http.responseText);
			yelpData = data.businesses[0];
			getYelpReviews();
		}
	}
}

let reviews;
function getYelpReviews() {
	const http = new XMLHttpRequest();
	const url = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/' + yelpData.id + '/reviews';
	http.open('GET', url, true);
	http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	http.setRequestHeader('Authorization', 'Bearer 2KeDzCByqhkD8XrwPfhOnzFaslZ3h6uDpw8XTUDUu9IO6PJAVRqRIOPFlF24Xuyz1vtV2W0RX3DOu8B9KmRJA9_jn3NXV3y_8L8biBUgI_3T510xIPywz-ktfnY2XHYx');
	http.send();
	http.onreadystatechange=(e)=>{
		if (http.readyState == 4 && http.status == 200 && http.responseText != null) {	
			console.log(http, "http");
			reviews = JSON.parse(http.responseText).reviews;
			renderReviews();
		}
	}
}

function renderReviews() {
	let reviewList = '<div id="yelp-review"><div id="review-title">What 3 people are saying on Yelp</div>';
	$.each(reviews, function(index, value) {
		reviewList += '<div class="collection-item avatar"><div id="name-container"><span class="name">'+ value.user.name + '</span>';
		
		for(i = 0; i < value.rating; i++) {
			reviewList += '<i class="fas fa-star" style="color: #f4d142"></i>';
		}
		reviewList += '</div><p class="review-comment">'+ value.text +'</p></div>';
	});
	reviewList += '</div>';
	$('[id=reviews]').after(reviewList);

}



