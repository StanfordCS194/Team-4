import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import {text, layer} from 'konva';

var epiphany_canvas = () => {
  var stageWidth = window.innerWidth;
  var stageHeight = window.innerHeight;

  function writeMessage(message) {
      text.setText(message);
      layer.draw();
  }

  var stage = new Konva.Stage({
      container: 'container',
      width: stageWidth,
      height: stageHeight,
      draggable: true,
      listening: true
  });

  var layer = new Konva.Layer();
  stage.add(layer);

  stage.on('dblclick', createStickyGroup);

//  var textarea = document.getElementById("textarea");


  function createStickyGroup (e) {
  /* Double clicking the stage creates a sticky (stickySquare + stickyText)
     Immediately put in edit text mode */

      // So that we don't create a sticky when we're trying to edit a sticky
      if (e.target.nodeType === "Shape") {
        return;
      }

      var stickyGroup = new Konva.Group({
          draggable: true,
          name: "stickyGroup",
      });
      layer.add(stickyGroup);

      // add cursor styling
      stickyGroup.on('mouseover', function() {
          document.body.style.cursor = 'pointer';
      });
      stickyGroup.on('mouseout', function() {
          document.body.style.cursor = 'default';
      });

      // UNCOMMENT THIS BLOCK to try sticky 'lifting' and 'dropping' animation
      // TODO is buggy (only works on first sticky, doesn't raise text too,
      // animation not smooth)
      // ------------------------------------------------------
      // Sticky 'raises' when dragged
      stickyGroup.on('dragstart', function(e) {
          e.target.to({
            shadowColor: 'black',
            shadowOffset: {
                X: 15,
                Y: 15,
            },
            scaleX: 1.1,
            scaleY: 1.1,
            easing: Konva.Easings.ElasticEaseOut,

          });
          console.log("drag start");
//          stickyGroup.draw();

//          stickyGroup.tweenGrab.play();
//          console.log("drag start");
//          stickyGroup.moveToTop();
      });

      // Sticky comes back down when dropped
      stickyGroup.on('dragend', function(e) {
        e.target.to({
            scaleX: 1,
            scaleY: 1,
            easing: Konva.Easings.ElasticEaseOut,
        });
        console.log("drag end");
        layer.draw();


//          stickyGroup.tweenDrop.play();

      });
      // ------------------------------------------------------

      let rotation = Math.floor(Math.random() * (10) - 5); // Random rotation in range [-5, 5]

      // Create the sticky - stickySquare + stickyText
      var stickySquare = new Konva.Rect({
          x: stage.getPointerPosition().x - 125,
          y: stage.getPointerPosition().y - 10,
          width: 250,
          height: 250,
          fill: '#fffdd0',
          shadowColor: 'black',
          rotation: rotation,
      });
      stickyGroup.add(stickySquare);

      var stickyText = new Konva.Text({
          x: stage.getPointerPosition().x - 125,
          y: stage.getPointerPosition().y,
          text: '',
          fontSize: 35,
          fontFamily: 'Klee',
          fill: '#555',
          width: 250,
          padding: 20,
          align: 'center',
          listening: true,
          rotation: rotation,
      });
      stickyGroup.add(stickyText);

      // Immediately edit text, then dblclick to edit
      editText(stickyText, stickyGroup);
      stickyGroup.on('dblclick', () => editText(stickyText, stickyGroup));

      stickyGroup.on('click', () => selectSticky(stickyGroup));

      // Tween for drag and drop
      stickyGroup.tweenGrab = new Konva.Tween({
        node: stickySquare,
        shadowOffsetX: 15,
        shadowOffsetY: 15,
        duration: 0.5,
        scaleX: 1.1,
        scaleY: 1.1,
        easing: Konva.Easings.ElasticEaseOut,
      });

      stickyGroup.tweenDrop = new Konva.Tween({
        node: stickySquare,
        duration: 1,
        easing: Konva.Easings.ElasticEaseOut,
        scaleX: 1,
        scaleY: 1,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      });

      var tr2 = new Konva.Transformer({
        node: stickyGroup,
        keepRatio: true,
        anchorSize: 10,
        borderStroke: 'gray',
        rotationSnaps: [0, 90, 180, 270],
//        rotation: 5,
      });
      layer.add(tr2);
      layer.draw();
  }

  function selectSticky(stickyGroup) {
  // Given a stickyGroup, put a transformer around it
      stage.find('Transformer').destroy();

      // create new transformer
      var tr = new Konva.Transformer();
      tr.attachTo(stickyGroup);
      layer.add(tr);
      layer.draw();
}

  function editText (stickyText, stickyGroup) {
  // Given a stickyGroup and its stickyText, edit the text using a textarea
      stage.draggable(false);
      stage.off('wheel');
      stickyGroup.draggable(false);
      stage.off('dblclick');

      var textPosition = stickyText.getAbsolutePosition();
      var stageBox = stage.getContainer().getBoundingClientRect();


      var areaPosition = {
          x: textPosition.x + stageBox.left,
          y: textPosition.y + stageBox.top
      };

      // create textarea and style it
      var textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      textarea.value = stickyText.text();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y - 10 + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = stickyText.width();
      textarea.id = 'textarea_id';
      textarea.style.fontFamily = 'Klee';

      textarea.focus();

      stickyText.text("");
      layer.draw();

      stage.on('click', () => exitEditText(stickyText, stickyGroup, textarea));
      textarea.onkeypress = (() => {
        let key = window.event.keyCode;
        if (key == 13) {
            exitEditText(stickyText, stickyGroup, textarea);
        }
      });
  }

  function exitEditText(stickyText, stickyGroup, textarea) {
  // Given a stickyGroup, its stickyText, and textarea, close the textarea and update stickyText
      if (textarea.parentElement) {
          // Reallow current sticky movement
          stickyGroup.draggable(true);

          // Update stickyText text
          stickyText.text(textarea.value);

          layer.draw();
          document.body.removeChild(textarea);

          // Reallow stage movement
          stage.draggable(true);
          stage.on('wheel', onWheel);
          stage.on('dblclick', createStickyGroup)

      }
  }

    // Remove transformers and exit edit text
    stage.on('click', clearTransformers);

    function clearTransformers (e) {
    // if click on empty area remove all open transformers
        if (e.target === stage) {
            stage.find('Transformer').destroy();
        }
       layer.draw();
       return;
    }


// WINDOW RESIZING TO MATCH WIDTH
  function fitStageIntoParentContainer() {
      var container = document.querySelector('#stage-parent');

      // now we need to fit stage into parent
      var containerWidth = container.offsetWidth;
      // to do this we need to scale the stage
      var scale = containerWidth / stageWidth;

      stage.width(stageWidth * scale);
      stage.height(stageHeight * scale);
      stage.scale({ x: scale, y: scale });
      stage.draw();
  }
  fitStageIntoParentContainer();
  window.addEventListener('resize', fitStageIntoParentContainer);


// ZOOMING
  var scaleBy = 1.05;
  stage.on('wheel', onWheel);

  function onWheel(e) {
      e.evt.preventDefault();
      var oldScale = stage.scaleX();

      var mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
      };

      var stageDimensions = {
        x: window.innerWidth * stage.scaleX(),
        y: window.innerHeight * stage.scaleX()
      }

      var newScale =
        e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });

      var newPos = {
        x:
          -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
          newScale,
        y:
          -(mousePointTo.y - stage.getPointerPosition().y / newScale) *
          newScale
      };
      stage.position(newPos);
      stage.batchDraw();
  }
}

export default epiphany_canvas;