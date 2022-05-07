/**
 * this js renders question from server object to the quiz.html template. It records user's choice and sends it back to server.
 * the server judges the answer and rerenders the page with feedback and updated buttons. 
 * 
 * I list out some helper methods.
 * @TODO
 *  1. 
 */


// fetch json from server, render template

const GOOD_SENTIMENTS=["Awesome!", "Nice Job!", "Nailed It", "Woo Hoo!", "Way to Go!", "Well Done!"];
const BAD_SENTIMENTS=["Not Quite!", "Close!", "Think a bit more...", "Not Exactly."];
const getRandomSentiment = (arr) => {
    return arr[Math.floor(Math.random()*arr.length)];
}
const renderQuestion = () => {
    // Set score
    const url = $(location).attr('href');
    $("#score-display").text(score);

    //show modal on first display
    if (quiz_question['next_question'] == 1) {
        $("#quiz-modal").modal('show');
        $(".modal-title").html("Welcome to the quiz!");
        $(".modal-header").addClass('alert alert-primary')
        $("#modal-btn").text('Start quiz!');
        $('#quiz-modal-text').html("Now, you'll test all the Fengshui knowledge you've obtained!<br> The quiz consists of 4 multiple choice and 2 true/false questions.");
        $("#quiz-modal").click(() => {
            $('#quiz-modal').modal('hide'); 
        })
    }

    //Set question and answers based on question type
    switch (quiz_question['type']) {
        case "MC":
            setMultipleChoiceContent();
            break 
        case "TF":
            setTrueFalseContent();
            break
    }
    // set submit button
    $('.submit').append($("<button type='button' class='btn btn-primary' id='submit-btn' style='float: right;'>Submit Answer</button>"))
    $("#submit-btn").click(handleQuizSubmit);
}

// set content if multiple choice
// todo -- make clickable and add onclock information
const setMultipleChoiceContent = () => {
    $(".quiz-prompt").text(quiz_question['question']);
    $(".quiz-image").attr("src", quiz_question['image'])
    // console.log(quiz_question);
    $(".quiz-choices").append(`<div class="form-check">
    <input type="radio" class="form-check-input" id="radio1" name="optradio" value=${quiz_question['option_1'].split(" ").join('-')} checked>${quiz_question['option_1']}
    <label class="form-check-label" for="radio1"></label></div>`);
    $(".quiz-choices").append(`<div class="form-check">
    <input type="radio" class="form-check-input" id="radio2" name="optradio" value=${quiz_question['option_2'].split(" ").join('-')}>${quiz_question['option_2']}
    <label class="form-check-label" for="radio1"></label></div>`);
    $(".quiz-choices").append(`<div class="form-check">
    <input type="radio" class="form-check-input" id="radio3" name="optradio" value=${quiz_question['option_3'].split(" ").join('-')}>${quiz_question['option_3']}
    <label class="form-check-label" for="radio1"></label></div>`);
}

const setTrueFalseContent = () => {
    $(".quiz-prompt").text(quiz_question['question']);
    $(".quiz-image").attr("src", quiz_question['image'])
    $(".quiz-choices").append(`<div class="form-check">
    <input type="radio" class="form-check-input" id="radio1" name="optradio" value=${quiz_question['option_1']} checked>${quiz_question['option_1']}
    <label class="form-check-label" for="radio1"></label>`);
    $(".quiz-choices").append(`<div class="form-check">
    <input type="radio" class="form-check-input" id="radio2" name="optradio" value=${quiz_question['option_2']}>${quiz_question['option_2']}
    <label class="form-check-label" for="radio1"></label>`);
}

const setFeedbackContent = (response) => {
    
}

const onSucessModal = (response) => {

}

// handle submit button click
const handleQuizSubmit = () => {
    // process whether or not it's correct
    const answer = $("input[name='optradio']:checked").val();
    const correct = (answer === quiz_question['answer']);
    const modalTitle = correct ? 'Correct! Great Job' : 'Incorrect Answer';
    const modalHeader = correct ? 'alert alert-success' : 'alert alert-danger'
    const modalText = correct ? `${getRandomSentiment(GOOD_SENTIMENTS)} ${quiz_question['good_support']}` : `${getRandomSentiment(BAD_SENTIMENTS)} ${quiz_question['bad_support']}`;
    const nextUrl = quiz_question['next_question'];
    const data = { 
        'status': correct ? 'correct' : 'incorrect',
        'score' : score,
    };
    const end = quiz_question['next_question'] == 'end';
    const buttonText = end ? 'View Results' : 'Next Question';
    $('#quiz-modal').modal('show');
    $(".modal-title").html(modalTitle);
    $('#quiz-modal-text').html(modalText);
    $('.modal-header').addClass(modalHeader)
    $("#modal-btn").text(buttonText);
    $("#quiz-modal").click(()=>{
        $('#quiz-modal').modal('hide'); 
        //POST request on the current field
        if (end) {
            sendRequestEnd(data);
        }
        else {
            sendRequest(data, nextUrl);
        }
    })
}

// handle next button click
function handle_quiz_next(){
    const answer = $("input[name='optradio']:checked").val();

}

// handle review button click
function handle_quiz_review(){
    //...
}

// AJAX for request
const sendRequest = (data, nextUrl) => {
    $.ajax({
        type        :   "POST",
        url         :   "/quiz_yourself/" + nextUrl,
        dataType    :   "json",
        contentType :   "application/json; charset=utf-8",
        data        :   JSON.stringify(data),
        success     :   function(result){
            // console.log("res : " + result);
            quiz_question = result['next_q']
            let new_score = result['score'];
            // console.log("score recvd is : " + new_score)
            $("#score-display").text(new_score);

            console.log("quiz q : " + JSON.stringify(quiz_question));
            // console.log("")
            // end page
            // if (quiz_question['next_question'] == 'end'){
                // window.location.href = '/quiz_end/'
            // } else { 
            window.location.href = '/quiz_yourself/' + nextUrl;
            // }
            
        },
        error       :   function(request, status, error){
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        }
    });
}

// ajax request to end page
const sendRequestEnd = (data) => {
    $.ajax({
        type        :   "POST",
        url         :   "/quiz_end",
        dataType    :   "json",
        contentType :   "application/json; charset=utf-8",
        data        :   JSON.stringify(data),
        success     :   function(result){
            window.location.href = '/quiz_end';
        },
        error       :   function(request, status, error){
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        }
    }); 
}
// ready
$(document).ready(()=>{
    renderQuestion();
});