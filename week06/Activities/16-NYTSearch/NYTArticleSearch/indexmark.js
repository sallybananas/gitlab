
$(document).ready(() => {

	// API and Key
	const apiBaseURL	= "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
	const apiKey			= "b6ec86a0452f432099e1531a148b3894";

	// Aliases
	const srchTerm		= $("#articles");
	const articlesDiv	= $("#search");
	const numArticles	= $("#number");
	const dateStart		= $("#start-year");
	const dateEnd			= $("#end-year");
	const searchLabel = $("#search-label");
	const notFountMsg	= $("#not-found");
	const reqSrchTerm	= $("#required-search-term");
	const srchGroup		= $("#search-group");
	const srchAppend	= $("#search-term-append");
	// var today = new Date().format('y-m-d');
	// Function for ajax request with query
	const ajax = (queryObj) => {
		return $.ajax({
			type: "GET",
			url: apiBaseURL,
			data: queryObj
		});
	}

	// function for articles request
	const fetchArticles = (q, start, end, num) => {
		const query = {
			"api-key": apiKey,
			q: q,
			begin_date: start,
			end_date: end
		};

		// inner function to fetch 10 articles
		const fetchArticles = (query, page, numPages) => {
			let articleCounter = page * numPages; //initial article counter for each fetchTenArticles call
			const queryObj = Object.assign({}, query, { page });
			ajax(queryObj).done(data => {
				const articles = data.response.docs; // articles array

				if(!articles.length) {
					notFountMsg.show("slow");
					return; //no more ajax call even if number of requested articles is bigger than 10.
				}

				articles.forEach((article) => {
					if (articleCounter < num) {
						renderArticles(article, ++articleCounter);
					}
				});

				// repeat fetchTenArticles until articleCounter is less than "Number of Records to Retrieve"
				// request rate limit is 1 per sec. so we use setTimeout function for 1 sec delay.
				if (articleCounter < num && articles.length === numPages) {
					setTimeout(fetchTenArticles.bind(null, query, ++page), 1000);
				}

			});
		};

		// Call fetch 10 articles function
		fetchArticles(query, 0, numArticles); //start from page 0;
	};

	// Functions for rendering view
	function showRequiredMsg() {
		reqSrchTerm.show("slow");
		srchGroup.addClass("has-error");
	}

	// Function to clear search boxes
	function clearView() {
		$("#articles").empty();
		srchTerm.val(""); //clear input field
		srchAppend.text(""); //clear title;
		notFountMsg.hide();
		reqSrchTerm.hide();
		srchGroup.removeClass("has-error");
	}

	// Function for rendering articles
	function renderArticles(article, articleNumber) {
		const temp = $("<div>")
			.append($("<h3>").text(" " + article.headline.main).prepend($("<i class=\"label label-info\">").text(articleNumber))) //title
			.append($("<p>").text(article.byline ? article.byline.original : "")) //by
			.append($("<p>").text("section: " + article.section_name)) // section
			.append($("<p>").text(new Date(article.pub_date).toString().split(" ").slice(1, 4).join("/"))) //date
			.append($("<a target=\"_blank\">").attr("href", article.web_url).text(article.web_url)); //url link
		articlesDiv.append(temp);
	}

	// Datepicker function
	$( function() {
    $( ".datepicker" ).datepicker();
  } );

	// Event Listeners
	$("#search-btn").on("click", () => {
		const sTerm = srchTerm.val().trim();
		clearView();
		console.log(sTerm);
		if(!sTerm) {
			showRequiredMsg();
			return;
		}
		srchAppend.text("for \"" + sTerm + "\"");
		//call fetchArticles function
		fetchArticles(
			sTerm.toLowerCase(),
			dateStart.val().trim() ? dateStart.val().trim() : "20160101",
			dateEnd.val().trim() ? dateEnd.val().trim() : today.toString(),
			+numArticles.val().trim() || 10);
	});

	$("#clear-btn").on("click", () => {
		clearView();
	});

});