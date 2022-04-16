/*
js for learning portion.
I wrote a quick demo on how the dragging and snapping works.

@TODOS:
    1. write a function that fetchs all information of eahc furniture object, i.e. location, direction, etc,
    use ajax to send the json object to the server, and the server should return information including which section should be highlighted, and what messages should be prompted.
    2. status bar should be implemented in the same way.
    3. server should maintain 1. location of eahc object, and over all status bar. server should also preserve pre-defined 
*/



/* return position properties of a furniture */
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


/**
 * create and return a canvas object
 */
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




/* build the canvas for testing purpose ONLY */
function build() {
  var canvas = new fabric.Canvas("c", { selection: false });
  var grid = 50;

  // create grid

  for (var i = 0; i < 800 / grid; i++) {
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

  // add objects
  let rec = new fabric.Rect({
    left: 100,
    top: 100,
    width: 50,
    height: 50,
    fill: "#faa",
    originX: "left",
    originY: "top",
    centeredRotation: true,
  });
  
  disable_scaling(rec);
  canvas.add(rec);

  canvas.add(
    new fabric.Circle({
      left: 300,
      top: 300,
      radius: 50,
      fill: "#9f9",
      originX: "left",
      originY: "top",
      centeredRotation: true,
    })
  );
  
  let bed_url = "https://media.istockphoto.com/vectors/cat-lying-on-the-bed-cute-funny-scene-top-view-cartoon-style-image-vector-id1084804806?k=20&m=1084804806&s=612x612&w=0&h=t_8yAXc40RKVHjQXflR6oDzkwIgQ7fVsEr7proyJHo8=";
  let sofa_url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmGXMYZDrAz0Hgzp28d-e6YiCXAfCfafVajw&usqp=CAU";


var imgURL = 'https://i.imgur.com/8rmMZI3.jpg';


var pugImg = new Image();
pugImg.onload = function (img) {    
  var pug = new fabric.Image(pugImg);
  pug.scaleToWidth(250,false);
  disable_scaling(pug);
  canvas.add(pug);
};
pugImg.src = bed_url;


  fabric.Image.fromURL(sofa_url, function(oImg) {
    oImg.scaleToWidth(250,false)
    disable_scaling(oImg);
    oImg.id = 'sofa'
    canvas.add(oImg);
    sofa = oImg;
  });

  console.log(pugImg);
  // canvas.add(bed);

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
  // $( function() {
  //   $( "#draggable" ).draggable({ snap: true });
  //   $( "#draggable2" ).draggable({ snap: ".ui-widget-header" });
  //   $( "#draggable3" ).draggable({ snap: ".ui-widget-header", snapMode: "outer" });
  //   $( "#draggable4" ).draggable({ grid: [ 20, 20 ] });
  //   $( "#draggable5" ).draggable({ grid: [ 80, 80 ] });
  // } );

 
  // canvas.add(SelectObject);

});
