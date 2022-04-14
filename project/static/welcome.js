/*
randomly select 3 elements from server and display them
*/


function getThree()
{
/*
fetch 3 entries from server
RETURN:
    array of json objects(entries)
*/
    $.ajax(
        {
          type: "GET",
          url: 'get3',
          success: function (data) {
            // forEach handles [].
            /*
                $("<a>", {"class": "welcome-item", "href": "view/"+id}).text(name)

            */
            data.forEach(ele => {
                let name = ele["name"];
                let id = ele["id"];
                let url = ele['image_url']
                let alt = ele['alt_txt']
                // prepares the layout
                let row =   $("<div>", {"class": "col-md-12"}).append(
                $('<div>', {'class':'row'}).append(
                    [$('<div>', {'class':'col-md-4'}).append($("<h4>", {"class": "welcome-item align-items-center", "href": "view/"+id}).append($('<a>', {"href": "view/"+id}).text(name))),
                    
                        $('<div>', {'class': 'col-md-2'}).append($('<a>', {'href':"view/"+id}).append($('<img>', {'class': 'img-fluid', 'src':url, 'alt':alt})))
                    ]
                )
                );
                $(".welcome-content").append(row);
            });
            // return data
          },
          error: function (xhr, statusText, err) {
            alert("error"+xhr.status);
          }
        });
}


function displayList(items)
{
/*
render lists of names on the page.
------------------------------------------------------------------
INPUT:
    array of json objects, representing entries
RETURN:
    None
*/
    items.forEach(ele => {
        let name = ele["name"];
        let id = ele["id"];
        let row =   $("<div>", {"class": "col-md-12"}).append(
            $("<h1>", {"class": "welcome-item", "href": "view/"+id}).text(name));
        $(".welcome-content").append(row);
    });
}



$(document).ready(()=>{
    let entries = getThree();
    
});