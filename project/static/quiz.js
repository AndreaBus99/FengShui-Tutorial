/**
 * this js renders question from server object to the quiz.html template. It records user's choice and sends it back to server.
 * the server judges the answer and rerenders the page with feedback and updated buttons. 
 * 
 * I list out some helper methods.
 * @TODO
 *  1. 
 */


// fetch json from server, render template
function render_question(){
    // Set score
    const url = $(location).attr('href');
    $(".quiz-score").text(`Score: ${score}/6`);

    //Set question and answers
    switch (quiz_question['type']) {
        case "MC":
            setMultipleChoiceContent();
            break 
        case "TF":
            setTrueFalseContent();
            break
    }
    // set submit button
    $('.quiz-buttons').append($("<button type='button' class='btn btn-primary' id='learn-test-submit-btn' style='float: right;'>Submit</button>"));
    $('.quiz-buttons').append($("<button type='button' class='btn btn-primary' id='learn-test-submit-btn' style='float: right;'>Review</button>"))
}

// set content if multiple choice
// todo -- make clickable and add onclock information
const setMultipleChoiceContent = () => {
    $(".quiz-prompt").text(quiz_question['mc_question']);
    $(".quiz-choices").append(`<div>${quiz_question['option_1']}</div>`);
    $(".quiz-choices").append(`<div>${quiz_question['option_2']}</div>`);
    $(".quiz-choices").append(`<div>${quiz_question['option_3']}</div>`);
}

const setTrueFalseContent = () => {
    $(".quiz-prompt").text(quiz_question['tf_question']);
    $(".quiz-choices").append(`<div>${quiz_question['option_1']}</div>`);
    $(".quiz-choices").append(`<div>${quiz_question['option_2']}</div>`);
    $(".quiz-choices").append(`<div>${quiz_question['option_3']}</div>`);
}

const setFeedbackContent = (response) => {
    //set content based on feedback
}

// handle submit button click
function handle_quiz_submit(){
   //Enable only if 
}

// handle next button click
function handle_quiz_next(){
    //...
}

// handle review button click
function handle_quiz_review(){
    //...
}
    
// ready
$(document).ready(()=>{
    render_question();
});