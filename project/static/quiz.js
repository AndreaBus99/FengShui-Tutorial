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
    console.log(tf_quiz_questions);
    console.log(mc_quiz_questions);
}

// handle submit button click
function handle_quiz_submit(){
    //...
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
    render_questions();
});