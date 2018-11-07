let topics = ["Fred Armisen", "Kate McKinnon", "Paul Rudd", "Andy Samberg"];
let loadMoreCount = 1;

function renderButtons() {
    // Deleting the actors prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#actors-view").empty();
    for (var i = 0; i < topics.length; i++) {

        var a = $("<button>");
        // Adding a class of movie-btn to our button
        a.addClass("actor-btn");
        // Adding a data-attribute
        a.attr("data-name", topics[i]);
        // Providing the initial button text
        a.text(topics[i]);
        // Adding the button to the buttons-view div
        $("#actors-view").append(a);

    };
}

// adds new topic button 
$("#add-gif").on("click", function (event) {
    event.preventDefault();
    // grabs the input from the textbox
    let topic = $("#gif-input").val().trim();

    if (topic !== ''){
        // clears input field 
        $("#gif-input").val('');
        // adds an actor from the textbox to our array
        topics.push(topic);
        // calls renderButtons which handles the processing of our movie array
        renderButtons();
    }else if(topic === ''){
        $('#gif-input').addClass('alertUser');
    }
});

function displayGifs() {
    // clears out gifs
    $("#actor-gifs").empty();
    // gets data-name of button clicked
    let actor = $(this).attr("data-name");
    let queryURL = "http://api.giphy.com/v1/gifs/search?q=" + actor + "&api_key=7LNAVyd8OAIppT6QjyyPVOQd54A1M8Tj"

    // jquery ajax call
    $.ajax({
            url: queryURL,
            method: "GET",
            beforeSend: function () {
                // shows loading spinner
                $("#loading").css('display', 'block');
            },
        })

        // promise
        .then(function (response) {
            console.log(response);
            for (var i = 0; i < response.data.length; i++) {
                // imageUrl variable response data image gif url is set to
                let imageUrl = response.data[i].images.fixed_height_still.url;

                // dynamically creates img div
                let actorImage = $("<img>");

                // sets attributes
                actorImage.attr("src", imageUrl);
                actorImage.attr('data-state', 'still');
                actorImage.attr('data-still', response.data[i].images.fixed_height_still.url);
                actorImage.attr('data-animate', response.data[i].images.fixed_height.url);
                actorImage.attr("alt", "actor image");
                actorImage.addClass('actor-GIF');

                $("#loading").css('display', 'none');
                // prepends to div with ID of images
                $("#actor-gifs").prepend(actorImage);
                
            }
            showMoreButton(actor);
        });
}

function showMoreButton(actor) {

    $(window).on('scroll', function () {
        console.log('scroll ran');
    
        // checks if button is active, to avoid making repeated 'more' buttons
        if ($('#more').hasClass('inactive')) {
            $('#more').removeClass('inactive').addClass('active');
            let loadMore = $('<button>').addClass('load-more').text('Load More');
            // adds attribute name of actor to loadMore button
            loadMore.attr("actor", actor);
            $('#more').append(loadMore);
        }else {
            $('.load-more').attr("actor", actor);
        }

    });
}

// makes api call when loadMore button is clicked
function loadMoreGifs() {
    // gets data-name of button clicked
    let actor = $(this).attr('actor');

    let queryURL = "http://api.giphy.com/v1/gifs/search?q=" + actor + "&offset=" + loadMoreCount + "&api_key=7LNAVyd8OAIppT6QjyyPVOQd54A1M8Tj"
    // iterate up for next use of loadMoreGifs
    loadMoreCount++;
    // jquery ajax call
    $.ajax({
            url: queryURL,
            method: "GET"
        })

        // promise
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                // imageUrl variable response data image gif url is set to
                let imageUrl = response.data[i].images.fixed_height_still.url;

                // dynamically creates img div
                let actorImage = $("<img>");

                // sets attributes
                actorImage.attr("src", imageUrl);
                actorImage.attr('data-state', 'still');
                actorImage.attr('data-still', response.data[i].images.fixed_height_still.url);
                actorImage.attr('data-animate', response.data[i].images.fixed_height.url);
                actorImage.attr("alt", "actor image");
                actorImage.addClass('actor-GIF');

                // appends to div with ID of images
                $("#actor-gifs").append(actorImage);
                // $("#loading").();
            }
        });
}

function toggleGif() {
    let state = $(this).attr('data-state');

    if (state === 'still') {
        $(this).attr('src', $(this).attr('data-animate'));
        $(this).attr('data-state', 'animate');
    }
    if (state === 'animate') {
        $(this).attr('src', $(this).attr('data-still'));
        $(this).attr('data-state', 'still');
    }
}

$("#gif-input").keypress(function () {
    $('#gif-input').removeClass('alertUser');
});

$(document).on("click", ".actor-btn", displayGifs);
$(document).on("click", ".actor-GIF", toggleGif);
$(document).on("click", ".load-more", loadMoreGifs);

renderButtons();
