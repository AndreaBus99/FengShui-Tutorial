/*
js for learning portion.
I wrote a quick demo on how the dragging and snapping works.

@TODOS:
    1. write a function that fetchs all information of eahc furniture object, i.e. location, direction, etc,
    use ajax to send the json object to the server, and the server should return information including which section should be highlighted, and what messages should be prompted.
    2. status bar should be implemented in the same way.
    3. server should maintain 1. location of eahc object, and over all status bar. server should also preserve pre-defined 
*/


/* disable scaling, enable rotation with 90 degrees */
function disable_scaling(obj){
  // disable scaling
  obj.setControlsVisibility({
    mt: false,
    mb: false,
    ml: false,
    mr: false,
    bl: false,
    br: false,
    tl: false,
    tr: false,
    mtr: true,
  });
  obj.snapAngle = 90;
}


// /**
//  * create and return a canvas object
//  */
// function create_item(img_id) {
//   let img = $("#" + img_id);
//   let imgInstance = new fabric.Image(img, {
//     top : 100,
//     left : 100,
//     angle : 0,

//   });
//   // scale to width
//   pug.scaleToWidth(250,false)
//   // disable scaling
//   disable_scaling(imgInstance);
//   canvas.add(imgInstance);
//   // return
//   return imgInstance;
// }

/* given a canvas, initialize the room, including window, door, and grid lines */
function init_room(canvas, grid) {
  // create grid
  for (let i = 0; i < 800 / grid; i++) {
    canvas.add(
      new fabric.Line([i * grid, 0, i * grid, 800], {
        stroke: "#ccc",
        selectable: false,
      })
    );
    canvas.add(
      new fabric.Line([0, i * grid, 800, i * grid], {
        stroke: "#ccc",
        selectable: false,
      })
    );
  }

  // add door
  fabric.Image.fromURL("{{ img_url[0] }}", function(oImg) {
    oImg.scaleToWidth(150,false)
    disable_scaling(oImg);
    oImg.id = 'door';
    oImg.set('top', 650);
    oImg.set('left', 650);
    oImg.selectable = false;
    canvas.add(oImg);
    canvas.sendToBack(oImg);
  });
  // add window
  fabric.Image.fromURL("{{ img_url[1] }}", function(oImg) {
    oImg.scaleToWidth(50,true);
    oImg.scaleToHeight(300,true);
    oImg.set('top', 250);
    oImg.set('left',0); 
    oImg.selectable = false;
    disable_scaling(oImg);
    oImg.id = 'window'
    canvas.add(oImg);
    canvas.sendToBack(oImg);
  });
  
    
  // snap to grid
  canvas.on("object:moving", function (options) {
    options.target.set({
      left: Math.round(options.target.left / grid) * grid,
      top: Math.round(options.target.top / grid) * grid,
    });
  });
    
  

}


/* add furnitures to canvas */
function add_furnitures(canvas) {
  // add bed
  fabric.Image.fromURL("{{ img_url[2] }}", function(oImg) {
    oImg.scaleToWidth(150,false)
    disable_scaling(oImg);
    oImg.id = 'bed';
    canvas.add(oImg);
  });
}

/**
 * when clicked, send ajax to server
 * if correct, re-render the buttons and can move to next question
 * if wrong, send feedback
 */
function handle_learn_submit(canvas) {
  $("#learn-test-submit-btn").click(()=>{
    console.log('here i show that we can access location of objects..');
    let coords = getCoordinates(canvas, 'bed');

    /*
      test on sending coordinates and angle of bed to server
    */

    // send new entry to server
		// $.ajax({
		// 	type        :   "POST",
		// 	url         :   "learn/" + 1,
		// 	dataType    :   "json",
		// 	contentType :   "application/json; charset=utf-8",
		// 	data        :   JSON.stringify(coords),
		// 	success     :   
		// 	function(result){
		// 		// display the feedback
		// 		newAddedID = result["newID"]
		// 		// createTopBar(newAddedID);
		// 		// clearWarnings();
		// 		// clearInputs();
		// 		// $('#name_input').focus();
				
	
		// 	},
		// 	error: 
		// 	function(request, status, error){
		// 		console.log("Error");
		// 		console.log(request)
		// 		console.log(status)
		// 		console.log(error)
		// 	}
		// });
  });
}


/* build the canvas for testing purpose ONLY */
function build() {
  let canvas = new fabric.Canvas("c", { selection: false });
  let grid = 50;

  // initialize the room layout
  init_room(canvas, grid);

  // add furnitures
  add_furnitures(canvas);

  // on click submit button
  handle_learn_submit(canvas);
}


/* get coordinates of object by id*/
function getCoordinates(canvas, id){
  var coords = [];
  canvas.forEachObject(function(obj){
    var prop = {
      left : obj.left,
      top : obj.top,
      // width : obj.width,
      // height : obj.height,
      angle : obj.angle
    };
    if (obj.id == id) {
      coords.push(prop);
    }
    
  });
  console.log(coords);
  return coords;
 }





// main
$(document).ready(() => {
  // retrieve lesson info, render it
  // render_lesson(learn_lesson);
  build();
 
  // canvas.add(SelectObject);

});
