/*
js for learning portion.
@TODOS:
    1. write a function that fetchs all information of each furniture object, i.e. location, direction, etc,
    use ajax to send the json object to the server, and the server should return information including which section should be highlighted, and what messages should be prompted.
    3. server should maintain 1. location of eahc object, and over all status bar. server should also preserve pre-defined 
*/

// function get_prop_of_item(furniture){
//   // TODO: code this
//  let obj = canvas.getActiveObject();
//  alert(obj.left + "," + obj.top);
// }

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

/* return a fabric object that can be added to canvas */
function create_item(img_id) {
  let img = $("#" + img_id);
  let imgInstance = new fabric.Image(img, {
    top : 100,
    left : 100,
    angle : 0,

  });
  // scale to width
  pug.scaleToWidth(250,false)
  // disable scaling
  disable_scaling(imgInstance);
  canvas.add(imgInstance);
  // return
  return imgInstance;
}



/* return position properties of a furniture */
function get_prop_of_item(furniture){
     // TODO: code this
    let obj = canvas.getActiveObject();
    alert(obj.left + "," + obj.top);

}

// initialize grids, room layout
function init_room(canvas, grid) {
  
  let canvasWidth =  document.getElementById('c').width;
  let canvasHeight = document.getElementById('c').height;

  // create grid
  for (let i = 0; i < (canvasWidth / grid); i++) {
    canvas.add(new fabric.Line([ i * grid, 0, i * grid, canvasHeight], { type:'line', stroke: '#ccc', selectable: false }));
    canvas.add(new fabric.Line([ 0, i * grid, canvasWidth, i * grid], { type: 'line', stroke: '#ccc', selectable: false }))
  }

  // create room outline
  var room_outline = new fabric.Rect({
    width: 275, //8.5 ft
    height: 450, //14 ft
    fill: '', 
    stroke: 'black',
    strokeWidth: 3,
    left: 18 * grid,
    top: 2 * grid,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  });

  var window = new fabric.Rect({
    width: 175,
    height: 6, 
    fill: 'lightBlue', 
    left: 20 * grid,//+3 to account for room outline strokeWidth
    top: 1.95 * grid,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  })

  var door = new fabric.Rect({
    width: 100,
    height: 8, 
    fill: 'lightGrey', 
    left: 24 * grid,//+3 to account for room outline strokeWidth
    top: 499,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  })

  var doorOpening = new fabric.Circle({
    radius: 100,
    left: 32 * grid,//+3 to account for room outline strokeWidth
    top: 24 * grid,
    angle: 180,
    startAngle: 0,
    endAngle: 90,
    stroke: 'lightGrey',
    strokeWidth: 3,
    fill: '',
    strokeDashArray: [5, 5],
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  });

  var doorOpeningLine = new fabric.Rect({
    width: 0,
    height: 100, 
    fill: '', 
    left: 28 * grid,//+3 to account for room outline strokeWidth
    top: 16 * grid,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
    strokeDashArray: [5, 7],
    stroke: 'lightGrey',
    strokeWidth: 3,
  })

  var widthText = new fabric.Text("8'5\" ft", { 
    left: 24 * grid, 
    top: 1.5*grid,
    fontSize: 24,
    originX: 'center',
    originY: 'center', 
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  });

  var heightText = new fabric.Text("14'0\" ft", { 
    left: 30*grid, 
    top: 11 * grid,
    fontSize: 24,
    originX: 'center',
    originY: 'center', 
    angle: 90,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  });

  var roomOutlineGroup = new fabric.Group([ widthText, heightText, room_outline, window, door, doorOpening, doorOpeningLine ], {
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  });

  canvas.add(roomOutlineGroup);
}




// handle submit button
function handle_learn_submit() {
}




/* build the canvas for testing purpose ONLY */
function build() {
  // create a wrapper around native canvas element (with id="c")
  let canvas = new fabric.Canvas("c", { selection: false });
  let grid = 25;
  
  // initialzie room
  init_room(canvas, grid);
  

  // fetch furniture json from flask server and render on canvas
  $.each(furniture,function(index,ui){
    // get properties
    let url   = ui.img_url;
    let width = ui.width;
    let height = ui.height;
    let id    = ui.furniture;
    // create image
    let f_image = new Image();
    f_image.onload = function (img) {  
      let f_entity = new fabric.Image(f_image, {
        left: ui.left,//position image on loading
        top: ui.top
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
    options.target.set({
      left: Math.round(options.target.left / grid) * grid,
      top: Math.round(options.target.top / grid) * grid,
    });
  });

  // on click submit button
  $("#learn-test-submit-btn").click(()=>{
    // deselect all objects
    canvas.discardActiveObject().renderAll();
    // clear all alert boxes
    canvas.forEachObject((obj)=> {
      if (obj.class == 'alert-box') {
        canvas.remove(obj);
        canvas.renderAll();
      }
    });
    // get coords of bed
    let coordsBed = getCoordinates(canvas, 'bed');
    //TODO - get and send desk coords
    // send coords of bed to server
		$.ajax({
			type        :   "POST",
			url         :   "learn",
			dataType    :   "json",
			contentType :   "application/json; charset=utf-8",
			data        :   JSON.stringify(coordsBed),
			success     :   
			function(result){
        // result is a json with two fields 1. status 2. feedback 3. complete 4. progress
        console.log(result);
        let status    = result['status'];
        let feedback  = result['feedback'];
        let complete  = result['complete'];
        let green_progress  = result['progress'][0];
        let red_progress = result['progress'][1];
        console.log(green_progress);
        // set progress bar
        $("#green-progress-bar").text(green_progress);
        $("#green-progress-bar").attr('style', "width:" + green_progress + "%");
        $("#red-progress-bar").text(red_progress);
        $("#red-progress-bar").attr('style', "width:" + red_progress + "%");
        // get bed obj
        mark_furniture(canvas, 'bed', feedback, status)
        

        // if complete, display the message
        if (complete == 'True') {
          $("#learn-complete-msg").text("You've learned all lessons!");
        }
			},
			error: 
			function(request, status, error){
				console.log("Error");
				console.log(request)
				console.log(status)
				console.log(error)
			}
		});
  });
}


// set filter to object by id
function mark_furniture(canvas, id, feedback, status) {
  canvas.forEachObject(function(obj){
    if (obj !== undefined && obj.id == id) {

      alert_color = status == 'no' ? 'red' : 'green';
      // create a red rectangle
      let rect = new fabric.Rect({
        // originX: 'center',
        // originY: 'center',
        left:obj.left,
        top:obj.top,
        fill: alert_color,
        width: obj.getScaledWidth(),
        height: obj.getScaledHeight(),
        opacity: 0.6,
        angle: obj.angle,
        class: 'alert-box',
        selectable : true
      });
      // console.log(rect);
      var text = new fabric.Text(feedback, {
        fontSize: 14,
        left: obj.left,
        top: obj.top,
        class: 'alert-box'
        // originX: 'center',
        // originY: 'center'
      });

      // on click, add lesson text to the lesson learned below progress bard
      rect.on('mousedown', ()=> {
        console.log('moused clicked!');
        // $("#learn-lesson-learned").append($('<div>').append($('<h3>',{text: feedback})));
        $("#learn-feedback").text(feedback);
        canvas.remove(rect);
      });

      // add to canvas
      // canvas.add(rect).renderAll().bringToFront(rect).setActiveObject();
      canvas.add(rect).bringToFront(rect).renderAll();
      canvas.bringToFront(rect);
      // canvas.bringToFront(text);
      canvas.renderAll();
    }
  });  
}

/* get coordinates of object by id*/
function getCoordinates(canvas, id){
  var coords = [];
  canvas.forEachObject(function(obj){
    
    
    if (obj.id == id) {
      // console.log(obj.getBoundingRect());
      let bb =obj.getBoundingRect(); 
      var prop = {
        left : bb.left,
        top : bb.top,
        angle : obj.angle,
        // width : obj.getScaledWidth(),
        // height : obj.getScaledHeight()
        width : bb.width,
        height : bb.height
      };
      coords.push(prop);
    }
    
  });
  console.log(coords);
  return coords;
}

// main
$(document).ready(() => {
  build();
});