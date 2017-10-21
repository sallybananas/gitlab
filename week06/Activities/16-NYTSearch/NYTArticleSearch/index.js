$( function() {
  $( ".datepicker" ).datepicker();
} );

$(document).ready(() => {
  
  const queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
  const authKey = "d8966fd97abd46028557596c31b5fd0e";
  
  const articleBox = $("#articles");
  const searchTerm = $("#search");
  const numberOfRecords = $("#number");
  const startYear = $("#start-year");
  const endYear = $("#end-year");
  const searchLabel = $("#search-label");
  const notFountMsg = $("#not-found");
  const requiredSearchTermMsg = $("#required-search-term");
  const searchFormGroup = $("#search-group");
  const searchTermAppend = $("#search-term-append");

  /**
   * Ajax
   */
  // function for ajax request with query
  const ajax = (queryObj) => {
    return $.ajax({
      type: "GET",
      url: queryURLBase,
      data: queryObj
    });
  }

  // function for articles request
  const fetchArticles = (q, startDate, endDate, num) => {
    const query = {
      "api-key": authKey,
      q: q,
      begin_date: startDate,
      end_date: endDate
    };

    // inner function to fetch 10 articles
    const fetchTenArticles = (query, page) => {
      let articleCounter = page * 10; //initial article counter for each fetchTenArticles call
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
        if (articleCounter < num && articles.length === 10) {
          setTimeout(fetchTenArticles.bind(null, query, ++page), 1000);
        }

      });
    };

    //call fetch 10 articles function
    fetchTenArticles(query, 0); //start from page 0;
  };


  
  /**
   * functions for rendering view
   */
  function showRequiredMsg() {
    requiredSearchTermMsg.show("slow");
    searchFormGroup.addClass("has-error");
  }

  function clearView() {
    $("#articles").empty();
    searchTerm.val(""); //clear input field
    searchTermAppend.text(""); //clear title;
    notFountMsg.hide();
    requiredSearchTermMsg.hide();
    searchFormGroup.removeClass("has-error");
  }

  // function for rendering articles
  function renderArticles(article, articleNumber) {
    const temp = $("<div>")
      .append($("<h3>").text(" " + article.headline.main).prepend($("<i class=\"label label-info\">").text(articleNumber))) //title
      .append($("<p>").text(article.byline ? article.byline.original : "")) //by
      .append($("<p>").text("section: " + article.section_name)) // section
      .append($("<p>").text(new Date(article.pub_date).toString().split(" ").slice(1, 4).join("/"))) //date
      .append($("<a target=\"_blank\">").attr("href", article.web_url).text(article.web_url)); //url link
    articleBox.append(temp);
  }


  /**
   * Event Listen
   */
  $("#search-btn").on("click", () => {
    const sTerm = searchTerm.val().trim();
    clearView();
    console.log(sTerm);
    if(!sTerm) {
      showRequiredMsg();
      return;
    }
    searchTermAppend.text("for \"" + sTerm + "\"");
    //call fetchArticles function
    fetchArticles(
      sTerm,
      startYear.val().trim() ? startYear.val().trim() + "0101" : "20160101",
      endYear.val().trim() ? endYear.val().trim() + "0101" : "20170228",
      +numberOfRecords.val().trim() || 10);
  });

  $("#clear-btn").on("click", () => {
    clearView();
  });
});