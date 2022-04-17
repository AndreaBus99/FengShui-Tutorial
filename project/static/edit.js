/*
js for learning portion.
I wrote a quick demo on how the dragging and snapping works.

@TODOS:
    1. write a function that fetchs all information of each furniture object, i.e. location, direction, etc,
    use ajax to send the json object to the server, and the server should return information including which section should be highlighted, and what messages should be prompted.
    2. status bar should be implemented in the same way.
    3. server should maintain 1. location of eahc object, and over all status bar. server should also preserve pre-defined 
*/

function get_prop_of_item(furniture){
  // TODO: code this
 let obj = canvas.getActiveObject();
 alert(obj.left + "," + obj.top);
}

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
    left: canvasWidth/4,
    top: 50,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
});

var window = new fabric.Rect({
    width: 175,
    height: 6, 
    fill: 'lightBlue', 
    left: (canvasWidth/4)+53,//+3 to account for room outline strokeWidth
    top: 49,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
})

var door = new fabric.Rect({
    width: 100,
    height: 8, 
    fill: 'lightGrey', 
    left: (canvasWidth/4)+153,//+3 to account for room outline strokeWidth
    top: 499,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
})

var doorOpening = new fabric.Circle({
    radius: 100,
    left: (canvasWidth/4)+353,//+3 to account for room outline strokeWidth
    top: 602,
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
    left: (canvasWidth/4)+253,//+3 to account for room outline strokeWidth
    top: 399,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
    strokeDashArray: [5, 7],
    stroke: 'lightGrey',
    strokeWidth: 3,
})

var widthText = new fabric.Text("8'5\" ft", { 
    left: canvasWidth/3, 
    top: 35,
    fontSize: 24,
    originX: 'center',
    originY: 'center', 
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
});

var heightText = new fabric.Text("14'0\" ft", { 
    left: (canvasWidth/3)+150, 
    top: 275,
    fontSize: 24,
    originX: 'center',
    originY: 'center', 
    angle: 90,
    selectable: false, //user cannot move/select outline
    evented: false, //cursor does not change to move on hover
});

// "add" room outline onto canvas
canvas.add(widthText);
canvas.add(heightText);
canvas.add(room_outline);
canvas.add(window);
canvas.add(door);
canvas.add(doorOpening);
canvas.add(doorOpeningLine);
}


/* build the canvas for testing purpose ONLY */
function build() {
  // create a wrapper around native canvas element (with id="c")
  let canvas = new fabric.Canvas("c", { selection: false });
  let grid = 25;

  init_room(canvas, grid);
  

  // fetch furniture json from flask server and render on canvas
  $.each(furniture,function(index,ui){
    // get properties
    let url = ui.img_url;
    let width = ui.width;
    console.log(url)
    // create image
    let f_image = new Image();
    f_image.onload = function (img) {    
      let f_entity = new fabric.Image(f_image);
      // set width
      f_entity.scaleToWidth(width,false);
      // disable scaling and enalbe rotation by 90 degrees
      disable_scaling(f_entity);
      // add to canvas
      canvas.add(f_entity);
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
    console.log('here i show that we can access location of objects..');
    getCoordinates(canvas);
  });
}


/* get coordinates of object by id*/
function getCoordinates(canvas, id){
  var coords = [];
  canvas.forEachObject(function(obj){
    var prop = {
      left : obj.left,
      top : obj.top,
      width : obj.width,
      height : obj.height
    };
    if (obj.id == id) {
      coords.push(prop);
    }
    
  });
  console.log(coords)
 
}


// main
$(document).ready(() => {
  build();
});
