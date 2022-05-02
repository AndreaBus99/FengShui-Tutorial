/*
js for learning portion.
@TODOS:
    1. write a function that fetchs all information of each furniture object, i.e. location, direction, etc,
    use ajax to send the json object to the server, and the server should return information including which section should be highlighted, and what messages should be prompted.
    3. server should maintain 1. location of eahc object, and over all status bar. server should also preserve pre-defined 
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
/* return position properties of a furniture */
function get_prop_of_item(furniture){
     // TODO: code this
    let obj = canvas.getActiveObject();
    alert(obj.left + "," + obj.top);

}

// initialize grids, room layout
function init_room(canvas) {
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
    id: 'room_outline',
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

  var windowText = new fabric.Text("Window", { 
    left: 32 * grid, 
    top: 2.8*grid,
    fontSize: 18,
    originX: 'center',
    originY: 'center', 
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  });

  var door = new fabric.Rect({
    width: grid*6,
    height: grid*0.5, 
    fill: 'lightGrey', 
    left: 33 * grid,//+3 to account for room outline strokeWidth
    top: grid*Math.round(16*1.6)+(1.95*grid),
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  })

  var doorText = new fabric.Text("Door", { 
    left: 36 * grid, 
    top: grid*Math.round(16*1.6)+(1.95*grid),
    fontSize: 18,
    originX: 'center',
    originY: 'center', 
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  });

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

  var roomOutlineExtra = new fabric.Group([ widthText, heightText, window, door, windowText, doorText ], {
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
  });

  canvas.add(room_outline)
  canvas.add(roomOutlineExtra);

  return grid;
}




// handle submit button
function handle_learn_submit() {
}




/* build the canvas for testing purpose ONLY */
function build() {
  // create a wrapper around native canvas element (with id="c")
  let canvas = new fabric.Canvas("c", { selection: false });
  
  // initialzie room, get the grid size
  let grid = init_room(canvas);

  // fetch furniture json from flask server and render on canvas
  $.each(furniture,function(index,ui){
    // get properties
    let url   = ui.img_url;
    let width = ui.width * grid;
    let height = ui.height * grid;
    let id    = ui.furniture;

    // create image
    let f_image = new Image();
    f_image.onload = function (img) {  
      let f_entity = new fabric.Image(f_image, {
        left: ui.left * grid,//position image on loading
        top: ui.top * grid,
        borderColor: "red",//TO DO: change to accent color
        cornerColor: "red", //TO DO: change to accent color
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
    let allData = {
      'grid' : grid,
      'bed_coords' : getCoordinates(canvas, 'bed', grid),
      'desk_coords' : getCoordinates(canvas, 'desk', grid),
      'drawers_coords' : getCoordinates(canvas, 'drawers', grid),
      'wardrobe_coords' : getCoordinates(canvas, 'wardrobe', grid)
    };
    // send coords of furniture to server
		$.ajax({
			type        :   "POST",
			url         :   "learn",
			dataType    :   "json",
			contentType :   "application/json; charset=utf-8",
			data        :   JSON.stringify(allData),
			success     :   
			function(result){
        // result is a json with two fields 1. status 2. feedback 3. complete 4. progress
        console.log("result: "+JSON.stringify(result));

        //get general info first
        let green_progress  = result[0]['progress'][0];
        let red_progress = result[0]['progress'][1];
        let good_l = result[0]['good_lessons'];
        let bad_l = result[0]['bad_lessons'];
        let complete  = result[0]['complete'];

        // for each rule/check found
        for(let i=1; i<Object.keys(result).length; i++){
          let status    = result[i]['status'];
          let feedback  = result[i]['feedback'];
          let obj_to_mark = result[i]['mark'];

          // highlight the relevant furniture
          mark_furniture(canvas, obj_to_mark, feedback, status, good_l, bad_l)
        }

        // set progress bar
        $("#green-progress-bar").text(green_progress);
        $("#green-progress-bar").attr('style', "width:" + green_progress + "%");
        $("#red-progress-bar").text(red_progress);
        $("#red-progress-bar").attr('style', "width:" + red_progress + "%");

        // if complete, display the message, disable submit button
        if (complete == 'True') {
          $("#complete-msg").text("Congrats! You've learned all rules! Click on the quiz button on top right to test your learning!");
          $('#learn-test-submit-btn').prop({"disabled" : true})
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


// set filter to object by id
function mark_furniture(canvas, id, feedback, status, good_l, bad_l) {
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
        // console.log('moused clicked!');
        // $("#learn-lesson-learned").append($('<div>').append($('<h3>',{text: feedback})));
        $("#lesson").text(feedback);
        canvas.remove(rect);
        $('#modal').modal('show');
        $("#lesson-close-btn").click(()=>{
          $('#modal').modal('hide'); 
        });

        // render lesson list
        $('#good-lesson-list').empty();
        $('#bad-lesson-list').empty();
        good_l.forEach(l => {
          if(l['complete']) {
            $('#good-lesson-list').append($('<li>', {text : l['summary']}))
          }
        });
        bad_l.forEach(l => {
          if(l['complete']) {
            $('#bad-lesson-list').append($('<li>', {text : l['summary']}))
          }
        });
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
      coords.push(prop);
    }
    
  });
  console.log(grid);
  console.log(coords);
  return coords[0];
}

// main
$(document).ready(() => {
  build();
});