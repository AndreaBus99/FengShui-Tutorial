/*
rl3250
HW 6
------------------------------
on search button click, send request to server and retrieve results
------------------------------
*/



function handleSubmit()
{
/*
 * fires submission keyword to server and corresponding events
 * ------------------------------------------------------------------------------------------
 * @input
 *      None
 * @return
 *      None
 */
    $("#search_bar").submit((e)=>
    {   
        e.preventDefault();
        if (canSubmit()) {
            submitSearch();
        }
        else{
            $("#search_input").val("");
            $("#search_input").focus();
        }
    });
}


function submitSearch()
{
/*
 * combine keywords into an URL and redirect to corresponding path..
 * @input
 *      None
 * @returns
 *      None
 */
    let keywords = $("#search_input").val()
    // console.log("submitted!");
    window.location = "/search/" + keywords
}



function canSubmit()
{
/*
 * @input
 *      None
 * @returns 
 *      Boolean: true -> can submit the search; false -> otherwise
 */
    let keywords = $("#search_input").val().trim();
    return keywords.length != 0;
}


$(document).ready(()=>{
    // handle submit by both hitting button or pressing Enter key
    handleSubmit();

    $("#search_bar").keyup(function(event) {
        if (event.keyCode === 13) {
            // enter key pressed
            handleSubmit();
        }
    });
});