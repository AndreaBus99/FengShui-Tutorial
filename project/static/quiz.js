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
    $(".quiz-score").text(`Score: ${score}/6`);

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
    console.log(quiz_question);
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

    alert(`Your answer is ${feedback}`);

    //POST request on the current field
    sendRequest()

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
const sendRequest = (data) => { 
    $.ajax({
        type        :   "POST",
        url         :   "quiz_yourself" + 1,
        dataType    :   "json",
        contentType :   "application/json; charset=utf-8",
        data        :   JSON.stringify(data),
        success     :   
        function(result){
    // result is a json with two fields 1. status 2. feedback 3. complete 4. progress
    // console.log(result);
    
    //get general info first
    let learned_progress  = result[0]['progress'][0];
    let all_progress = result[0]['progress'][1];
    let progress = Math.round(learned_progress / all_progress * 100)
    let good_l = result[0]['good_lessons'];
    let bad_l = result[0]['bad_lessons'];
    let complete  = result[0]['complete'];
    let guide_new = result[0]['guidance']['text'];

    // for each rule/check found        
    for(let i=1; i<Object.keys(result).length; i++){
      let status    = result[i]['status'];
      let feedback  = result[i]['feedback'];
      let obj_to_mark = result[i]['mark'];

      // highlight the relevant furniture
      mark_furniture(canvas, obj_to_mark, feedback, status, good_l, bad_l)
    }
    // clicked_colored = false;
    // $('#learn-test-submit-btn').prop({"disabled" : true });

    // update guidance 
    $("#guidance").text(guide_new);
    // console.log(green_progress);
    // set progress bar
    $("#progress-bar").text(progress + " %");
    $("#progress-bar").attr('style', "width:" + progress + "%");
    

    // if complete, display the message, disable submit button
    if (complete == 'True') {
      $('#submit-btn').prop({"disabled" : true});
    }
        },
        error: 
        function(request, status, error){
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