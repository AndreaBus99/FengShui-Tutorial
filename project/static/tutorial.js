/*
js for tutorial portion.

On the tutorial there are 4 steps:
1. Welcome and introduction: this is just a pop up box that will give a quick intro to FengShui and the tutorial
----Actual steps inside tutorial----
2. Dragging and dropping: this will tell the user to drag and drop the furniture to the inside of the room, the modal
box appear the first time any of the furniture is found inside the room
3. Rotating: after dropiing an item inside the room, the user will be given instructions on how to rotate the furniture.
As step 2, the modal box will fire the first time the user rotates any of the furniture
4. Free arrange: lastly, the user will be given a chance to arrange the furniture. Then, once they fell comfortable with 
the commands, click submit and start the learning portion


REMARK: I decided to do 4 functions for the steps:
1. start_of_tutorial(): The first one is simply the introduction of the tutorial, with a redirection to the next rule
2. welcome_to_drag(): The second one is a transition between the welcome (step1) and dragging(step2)
3. drag_to_rotate(): The third one is a transition between the drag (step2) and rotate(step3)
4. rotate_to_free(): The fourth one is a transition between the rotate(step3) and the free arrange(step4)
*/

/* disable scaling and rotation */
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

// initialize grids, room layout
function init_room(canvas) {
  let obj = canvas.getActiveObject();

  let canvasWidth =  $('#canvasSpace').width();
  let canvasHeight = $('#canvasSpace').height();

  let grid = canvasWidth/50;

  canvas.setDimensions({width:canvasWidth, height:canvasHeight});

  // create grid
  for (let i = 0; i < (canvasWidth / grid); i++) {
    canvas.add(new fabric.Line([ i * grid, 0, i * grid, canvasHeight], { type:'line', stroke: '#ccc', selectable: false }));
    canvas.add(new fabric.Line([ 0, i * grid, canvasWidth, i * grid], { type: 'line', stroke: '#ccc', selectable: false }))
  }

  // create room outline
  var room_outline = new fabric.Rect({
    width: grid*16, //8.5 ft - 275
    height: grid*Math.round(16*1.6), //14 ft - 4503.0*Math.ceil(n/3.0)
    fill: '', 
    stroke: 'black',
    strokeWidth: 3,
    left: 24 * grid,
    top: 2 * grid,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  });

  var window = new fabric.Rect({
    width: grid*12,
    height: grid*0.5, 
    fill: 'lightBlue', 
    left: 26 * grid,//+3 to account for room outline strokeWidth
    top: 1.95 * grid,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  })

  var door = new fabric.Rect({
    width: grid*6,
    height: grid*0.5, 
    fill: 'lightGrey', 
    left: 33 * grid,//+3 to account for room outline strokeWidth
    top: grid*Math.round(16*1.6)+(1.95*grid),
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  })

  var widthText = new fabric.Text("8'5\" ft", { 
    left: 32 * grid, 
    top: 1.5*grid,
    fontSize: 24,
    originX: 'center',
    originY: 'center', 
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  });

  var heightText = new fabric.Text("14'0\" ft", { 
    left: 41*grid, 
    top: 2*grid+(grid*Math.round(16*1.6)/2),
    fontSize: 24,
    originX: 'center',
    originY: 'center', 
    angle: 90,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  });

  var roomOutlineGroup = new fabric.Group([ widthText, heightText, room_outline, window, door ], {
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  });

  canvas.add(roomOutlineGroup);

  return grid;
}

/* build the canvas and AJAX call*/
function build() {
  // create a wrapper around native canvas element (with id="c")
  let canvas = new fabric.Canvas("c", { selection: false });

  // initialzie room, get the grid size
  let grid = init_room(canvas);
  // console.log("grid size: "+ grid);

  // fetch furniture json from flask server and render on canvas
  $.each(furniture,function(index,ui){
    // get properties
    let url   = ui.img_url;
    let width = ui.width * grid;
    let height = ui.height * grid;
    let id    = ui.furniture;

    // console.log("width: "+width);
    // create image
    let f_image = new Image();
    f_image.onload = function (img) {  
      let f_entity = new fabric.Image(f_image, {
        left: ui.left * grid,//position image on loading
        top: ui.top * grid
      });
      // set width
      f_entity.scaleToWidth(width,false);
      f_entity.scaleToHeight(height,false);
      // disable scaling and enalbe rotation by 90 degrees
      disable_scaling(f_entity);
      // add to canvas
      canvas.add(f_entity);
      // set id
      f_entity.set('id', id);
    };
    f_image.src = url;
  });

  // snap to grid
  canvas.on("object:moving", function (options) {
    // console.log(selectedObject)
    options.target.set({
      left: Math.round(options.target.left / grid) * grid,
      top: Math.round(options.target.top / grid) * grid,
    });
  });
  
  //When a furniture is dragged and dropped, check location
  canvas.on("mouse:up", function(event){
    
    // deselect all objects
    // canvas.discardActiveObject().renderAll();

    // // clear all alert boxes
    canvas.forEachObject((obj)=> {
      if (obj.class == 'alert-box') {
        canvas.remove(obj);
        canvas.renderAll();
      }
    });
    
    // Get coordinates of all data
    let allData = {
      'grid' : grid,
      'bed_coords' : getCoordinates(canvas, 'bed', grid),
      'desk_coords' : getCoordinates(canvas, 'desk', grid),
      'drawers_coords' : getCoordinates(canvas, 'drawers', grid),
      'wardrobe_coords' : getCoordinates(canvas, 'wardrobe', grid),
    };

    // Receive from server if dragged and dropped furniture is inside room
		$.ajax({
			type        :   "POST",
			url         :   "/tutorial/<id>",
			dataType    :   "json",
			contentType :   "application/json; charset=utf-8",
			data        :   JSON.stringify(allData),

			success: function(result){    
        let all_data = result["furniture"]
        furniture = all_data 

        // If the furniture is inside the room
        if(result.status == 'yes'){
  
          // Move to the next step of tutorial (rotating)
          drag_to_rotate()
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
  });
}

/* get coordinates of object by id*/
function getCoordinates(canvas, id, grid){
  var coords = [];
  canvas.forEachObject(function(obj){
 
    if (obj.id == id) {
      // console.log(obj.getBoundingRect());
      let bb =obj.getBoundingRect(); 
      var prop = {
        left : Math.round(bb.left / grid),
        top : Math.round(bb.top/grid),
        angle : obj.angle,
        // width : obj.getScaledWidth(),
        // height : obj.getScaledHeight()
        width : Math.round(bb.width/grid),
        height : Math.round(bb.height/grid)
      };
      
      rotate_to_free(prop['angle'])
      coords.push(prop);
    }
    
  });
  // console.log(grid);
  // console.log(coords);
  return coords[0];
}

/* function for the intro of tutorial*/
function start_of_tutorial(){
  let current_url=$(location).attr('href')

  // Check if the url is in the firts step of tutorial (intro)
  if(current_url == "http://127.0.0.1:5000/tutorial/1"){

    // Get the text of introduction and display it in a modal
    let tutorial_start = welcome['instruction']
    $("#lesson").text(tutorial_start);
    $('#modal').modal('show');

    // Change the name of the modal box
    $(".modal-title").append("Tutorial")

    // Append a button for skipping the tutorial
    $("#skip-tutorial-btn").append($("<button type='button' class='btn btn-secondary' data-dismiss='modal'>Skip tutorial</button>"))

    // When this button is clicked redirect to the learning portion
    $("#skip-tutorial-btn").click(()=>{
      window.location.href= "/learn";
    })

    // When the let me try btn is clicked, move to next step (dragging)
    $("#let-me-try-btn").click(()=>{
      $('#modal').modal('hide'); 
      window.location.href= "/tutorial/"+2;
    })
  }

  // Add the welcome introduction text to the right side of screen so that user can read it again if needed
  if(current_url == "http://127.0.0.1:5000/tutorial/2"){
    $('#tutorial-start').append($('<div>', {text : welcome['instruction']}))
  }
}

/* function for step 2: clicking, dragging and dropping */
function welcome_to_drag(){

  let current_url=$(location).attr('href')
  if(current_url == "http://127.0.0.1:5000/tutorial/2"){

    // Get the instruction for this step 
    let click_and_drag = tutorial[0]['instruction']
    $("#lesson").text(click_and_drag);
    $('#modal').modal('show');

    // Change title of modal box
    $(".modal-title").html("Step 1: Drag and drop")

    $("#let-me-try-btn").click(()=>{
      $('#modal').modal('hide'); 
    })

    // Add step to the right of screen so user has it 
    $('.step-list').append($('<li>', {text : tutorial[0]['instruction']}))
  }
}

/* function for step 2: clicking, dragging and dropping and step 3: rotation*/
function drag_to_rotate(){

  let current_url=$(location).attr('href')
  
  if(current_url == "http://127.0.0.1:5000/tutorial/2"){
    // Get the instruction for this step
    let rotate = tutorial[1]['instruction']
    $("#lesson").text(rotate);
    $('#modal').modal('show');

    // Change title of modal
    $(".modal-title").html("Step 2: Rotate")


    $("#let-me-try-btn").click(()=>{
      $('#modal').modal('hide'); 
      // .pushState is used for changing the url without refreshing the page
      window.history.pushState({},'', "/tutorial/"+3);
    })

    // Add step to the list on the right
    // to remember: puedo cambiar esto despues porque ya no hay el problema que hay mucho events fired
    let searchWord= tutorial[1]['instruction']
    let exists=$('.step-list li:contains('+searchWord+')').length
    if(exists){
    } 
    else{
      $('.step-list').append($('<li>', {text : tutorial[1]['instruction']}))
    }
  }

}

/* function for step 3: rotating and step 4: do whatever you want */
// angle parameter is the angle of the objects
function rotate_to_free(angle){
  
  let current_url=$(location).attr('href')

  // If the angle is changed (i.e rotation occurs) show the instruction
  if(angle!= 0 && current_url == "http://127.0.0.1:5000/tutorial/3"){

    // Get the correct instruction
    let click_and_drag = tutorial[0]['instruction']
    let rotate = tutorial[2]['instruction']

    // Change the title of the modal
    $(".modal-title").html("Step 3: Arrange the room")

    $("#lesson").text(rotate);
    $('#modal').modal('show');

    $("#let-me-try-btn").click(()=>{
      $('#modal').modal('hide'); 
      // .pushState is used for changing the url without refreshing the page
      window.history.pushState({},'', "/tutorial/"+4);
    })

    // Add step to the list
    // to remember: puedo cambiar esto despues porque ya no hay el problema que hay mucho events fired
    let searchWord= tutorial[2]['instruction']
    let exists=$('.step-list li:contains('+searchWord+')').length
    if(exists){
    } 
    else{
      $('.step-list').append($('<li>', {text : tutorial[2]['instruction']}))
      $('.submit-button').append($("<button type='button' class='btn btn-primary' id='learn-test-submit-btn' style='float: right;'>Submit</button>"))
    }
  }

  // Once the submit button is clicked, go to the learning portion
  if(current_url == "http://127.0.0.1:5000/tutorial/4")
    $('.submit-button').click(function(){
      window.location.href= "/learn"
    })
}
  
  // main
$(document).ready(() => { 

  build();

  // Start of tutorial will give an introduction to the tutorial
  start_of_tutorial()

  // This will actually begin to go over the steps
  welcome_to_drag()

});