/*
js for learning portion.
I wrote a quick demo on how the dragging and snapping works.

@TODOS:
    1. write a function that fetchs all information of eahc furniture object, i.e. location, direction, etc,
    use ajax to send the json object to the server, and the server should return information including which section should be highlighted, and what messages should be prompted.
    2. status bar should be implemented in the same way.
    3. server should maintain 1. location of eahc object, and over all status bar. server should also preserve pre-defined 
*/


/* return a fabric object that can be added to canvas */
function create_item(name, image_url) {
    // TODO: code this
}

/* return position properties of a furniture */
function get_prop_of_item(furniture){
     // TODO: code this
    let obj = canvas.getActiveObject();
    alert(obj.left + "," + obj.top);

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
  // disable scaling
  rec.setControlsVisibility({
    mt: false,
    mb: false,
    ml: false,
    mr: false,
    bl: false,
    br: false,
    tl: false,
    tr: false,
    mtr: false,
  });
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

  // snap to grid

  canvas.on("object:moving", function (options) {
    options.target.set({
      left: Math.round(options.target.left / grid) * grid,
      top: Math.round(options.target.top / grid) * grid,
    });
  });
}





// main
$(document).ready(() => {
  build();
});
