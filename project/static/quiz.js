/**
 * this js renders question from server object to the quiz.html template. It records user's choice and sends it back to server.
 * the server judges the answer and rerenders the page with feedback and updated buttons. 
 * 
 * I list out some helper methods.
 * @TODO
 *  1. 
 */


// fetch json from server, render template
const renderQuestion = () => {
    // Set score
    const url = $(location).attr('href');
    $("#score-display").text(score);

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
    $('.quiz-buttons').append($("<button type='button' class='btn btn-primary' id='submit-btn' style='float: right; margin: 10vh;'>Submit</button>"))
    $("#submit-btn").click(handleQuizSubmit);
}

// set content if multiple choice
// todo -- make clickable and add onclock information
const setMultipleChoiceContent = () => {
    $(".quiz-prompt").text(quiz_question['mc_question']);
    $(".quiz-image").attr("src", quiz_question['mc_image'])
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
    $(".quiz-prompt").text(quiz_question['tf_question']);
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
    const feedback = correct ? 'correct' : 'incorrect';
    const nextScore = correct ? score+1 : score;

    const nextUrl = quiz_question['next_question'];
    console.log("quiz q  is : " + JSON.stringify(quiz_question));
    // console.log("next url is : " + nextUrl);
    const data = { 
        'status': correct ? 'correct' : 'incorrect',
        'score' : score,
    };
    alert(`Your answer is ${feedback}`);
    //POST request on the current field
    sendRequest(data, nextUrl);

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
    console.log("in send req");
    console.log("data : " + data)
    console.log('next url : ' + nextUrl); 
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
            console.log("score recvd is : " + new_score)
            $("#score-display").text(new_score);


            // console.log(nextUrl);
            window.location.href = '/quiz_yourself/' + nextUrl;
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