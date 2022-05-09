const setContent = () => {
    const score = getScore();
    const isPerfect = (score == 6);
    const isZero = (score == 0);
    //Set the necesary content
    $('#brief-result').text(`You got ${score}/6 questions correct.`)
    $('#quiz-end-score').text(score)
    for (let idx = 0; idx < overall.length; ++idx) {
        const text = overall[idx] ? `Question ${idx+1}: Correct! You were being tested on <b>${quiz_questions[idx]['category'].toLowerCase()}.<b>` : 
        `Question ${idx+1}: Incorrect. For your next attempt, try to review <b>${quiz_questions[idx]['category'].toLowerCase()}.<b>`;
        const alertClass = overall[idx] ? 'list-group-item-success' : 'list-group-item-danger' 
        $('#list-group-answers').append(`<li class="list-group-item ${alertClass}">${text}</li>`);
    }  
    const pText = isPerfect ? `Nice job! You've demonstrated Fengshui mastery` : `Good job. Try to review the concepts in red and try again!`;
    const modifiedZero = isZero ? `Let's go through the learning section again.` : pText
    if (isZero) {
        $("a[href='/quiz_yourself/0']").attr('href', '/learn');
        $("#nav-quiz-yourself").remove();
        $("#btnRestart").html('Learn');
    }
    $("#improvement").html(modifiedZero);
}

const getScore = () => {
    let count = 0;
    for (let idx = 0; idx < overall.length; ++idx) {
        (overall[idx] ? count++ : count)
    }
    return count;
}
$(document).ready(() =>{
    setContent();
})
