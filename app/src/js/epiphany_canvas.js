import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

const KEY_CODE_ENTER = 13;
const KEY_CODE_DELETE_1 = 46;
const KEY_CODE_DELETE_2 = 8;
const ID_CONST = '#'

var epiphany_canvas = () => {
  var justOpenedApp = true;
  var creatingSticky = false;
  var stageWidth = window.innerWidth;
  var stageHeight = window.innerHeight;
  var id = 0;

  var stage = new Konva.Stage({
      container: 'container',
      width: stageWidth,
      height: stageHeight,
      draggable: true,
      listening: true
  });

  var layer = new Konva.Layer();
  stage.add(layer);

  var encouragingStartText = new Konva.Text( {
      x: stageWidth / 2 - 250,
      y: stageHeight / 2 - 50,
      text: 'Double click anywhere to start!',
      fontSize: 30,
      fontFamily: 'Klee',
      fill: '#555',
      width: 500,
      padding: 20,
      align: 'center',
  })
  layer.add(encouragingStartText);

  stage.on('dblclick', addToBoard);

  function addToBoard (e) {
  /* Double clicking the stage creates a sticky (stickySquare + stickyText)
     Immediately put in edit text mode */
      if (justOpenedApp) {
      // Hide the encouraging start message
        stage.find('Text').destroy();
        layer.draw();
        justOpenedApp = false;
      }

      // So that we don't create a sticky when we're trying to edit a sticky
      if (e.target.nodeType === "Shape") {
        return;
      }

      // Add plain text
      if (window.event.metaKey) {
            createPlainText(e);
            return;
      }

      // 
      id += 1;

      // Add sticky
      var stickyGroup = new Konva.Group({
          draggable: true,
          name: "stickyGroup",
          scaleX: 1.1,
          scaleY: 1.1,
          id: ID_CONST.concat(id.toString()) 
      });
      layer.add(stickyGroup);
      creatingSticky = true;
      animatedAdd(stickyGroup);

      // add cursor styling
      stickyGroup.on('mouseover', function() {
          document.body.style.cursor = 'pointer';
      });
      stickyGroup.on('mouseout', function() {
          document.body.style.cursor = 'default';
      });

      // Sticky 'raises' when dragged
      stickyGroup.on('dragstart', function(e) {
          e.target.to({
            scaleX: 1.1,
            scaleY: 1.1,
            easing: Konva.Easings.ElasticEaseOut,
          });

          // make rect have shadow
          let rect = e.target.find('Rect')[0];
          rect.setAttrs({
            shadowOffsetX: 15,
            shadowOffsetY: 15,
          });

          stickyGroup.moveToTop();
      });

      // Sticky comes back down when dropped
      stickyGroup.on('dragend', function(e) {
        e.target.to({
            scaleX: 1,
            scaleY: 1,
            easing: Konva.Easings.ElasticEaseOut,
        });

        // remove shadow
        let rect = e.target.find('Rect')[0];
          rect.setAttrs({
            shadowOffsetX: 0,
            shadowOffsetY: 0,
        });
        layer.draw();
      });
      // ------------------------------------------------------

      let rotation = Math.floor(Math.random() * (11) - 5); // Random rotation in range [-5, 5]
      let colors = ['#fffdd0', '#2ec4b6', '#e71d36', '#ff9f1c', '#BD509E', '#A1C865']
      let color = colors[Math.floor(Math.random() * colors.length)] // Random index between 0 and 3
      console.log("color is " + color);

      var stageScaleX = stage.scaleX();

      // Create the sticky - stickySquare + stickyText
      var stickySquare = new Konva.Rect({
          x: stage.getPointerPosition().x / stageScaleX - stage.x() / stageScaleX - 125,
          y: stage.getPointerPosition().y / stageScaleX - stage.y() / stageScaleX - 10,
          width: 250,
          height: 250,
          fill: color,
          shadowColor: 'black',
          rotation: rotation,
      });
      stickyGroup.add(stickySquare);

      var stickyText = new Konva.Text({
          x: stage.getPointerPosition().x / stageScaleX - stage.x() / stageScaleX - 125,
          y: stage.getPointerPosition().y / stageScaleX - stage.y() / stageScaleX,
          text: '',
          fontSize: 35,
          fontFamily: 'Klee',
          fill: '#555',
          width: 250,
          padding: 20,
          align: 'center',
          listening: true,
          rotation: rotation,
          scaleX: 1,
          scaleY: 1
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
      });
      layer.add(tr2);
      layer.draw();
  }

  function createPlainText(e) {
  // Create plain text on the board. Immediately edit.
        var stageScaleX = stage.scaleX();

        var plainText = new Konva.Text({
          x: stage.getPointerPosition().x / stageScaleX - stage.x() / stageScaleX - 200,
          y: stage.getPointerPosition().y / stageScaleX - stage.y() / stageScaleX - 60,
          text: '',
          fontSize: 95,
          fontFamily: 'Klee',
          fill: '#555',
          width: 400,
          padding: 20,
          align: 'center',
          listening: true,
          draggable: true,

      });
      layer.add(plainText);
      layer.draw();

      editText(plainText, null);
      plainText.on('dblclick', () => editText(plainText, null));

      plainText.on('dragstart', function(e) {
          e.target.to({
            scaleX: 1.1,
            scaleY: 1.1,
            easing: Konva.Easings.ElasticEaseOut,
          });

          plainText.moveToTop();
      });

      plainText.on('dragend', function(e) {
        e.target.to({
            scaleX: 1,
            scaleY: 1,
            easing: Konva.Easings.ElasticEaseOut,
        });

        layer.draw();
      });
  }

  function animatedAdd(stickyGroup) {
    stickyGroup.to({
        scaleX: 1,
        scaleY: 1,
        easing: Konva.Easings.ElasticEaseOut,
    });
    layer.draw();
  }

  function hasId(element) {
    console.log('element: ', element)
    return true;
    //return element.attrs.id === '#1'
  }

  function selectSticky(stickyGroup) {
  // Given a stickyGroup, put a transformer around it
      stage.find('Transformer').destroy();

      // create new transformer
      var tr = new Konva.Transformer();
      tr.attachTo(stickyGroup);
      layer.add(tr);
      layer.draw();
      
      if (window.addEventListener('keydown', (e) => {
        if (e.keyCode === KEY_CODE_DELETE_1 || e.keyCode === KEY_CODE_DELETE_2) {
          stage.find('Transformer').destroy();
          stickyGroup.destroy();
          layer.draw();
        }
      }));
      //console.log(stickyGroup.attrs.id)
}

  function editText (stickyText, stickyGroup) {
  // Given a stickyGroup and its stickyText, edit the text using a textarea
  // If stickyGroup is null, just edit plainText
      stage.draggable(false);
      stage.off('wheel');

      // Defaults for plainText
      var textareaHeight = 175 + 'px';
      var textareaWidth = 400 + 'px';
      var textareaFontSize = 95 + 'px';

      if (stickyGroup) {
          stickyGroup.draggable(false);
          textareaHeight = stickyText.height();
          textareaWidth = stickyText.width();
          textareaFontSize = 35 + 'px';

          if (creatingSticky) {
              var textPosition = {
                x: stage.getPointerPosition().x - 125,
                y: stage.getPointerPosition().y,
              }
              creatingSticky = false;
          } else {
              //editing existing sticky
              var textPosition = stickyText.getAbsolutePosition();
          }
      } else {
          // creating or editing plain text
          var textPosition = {
                 x: stage.getPointerPosition().x  - 200,
                 y: stage.getPointerPosition().y  - 60,
          }
      }

      stage.off('dblclick');


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
      textarea.style.width = textareaWidth;
      textarea.style.height = textareaHeight;
      textarea.id = 'textarea_id';
      textarea.style.fontFamily = 'Klee';
      textarea.style.fontSize = textareaFontSize;

      textarea.focus();

      stickyText.text("");
      layer.draw();

      stage.on('click', () => exitEditText(stickyText, textarea, stickyGroup));
      textarea.onkeypress = (() => {
        let key = window.event.keyCode;
        if (key === KEY_CODE_DELETE_1 || key === KEY_CODE_DELETE_2) {
          window.event.stopImmediatePropagation();
        }
        if (key == KEY_CODE_ENTER) {
            exitEditText(stickyText, textarea, stickyGroup,);
        }
      });
  }

  function exitEditText(stickyText, textarea, stickyGroup) {
  // Given a stickyGroup, its stickyText, and textarea, close the textarea and update stickyText
      if (textarea.parentElement) {
          // Reallow current sticky movement
          if (stickyGroup) {
          stickyGroup.draggable(true);
          }

          // Update stickyText text
          stickyText.text(textarea.value);

          layer.draw();
          document.body.removeChild(textarea);

          // Reallow stage movement
          stage.draggable(true);
          stage.on('wheel', onWheel);
          stage.on('dblclick', addToBoard)

          clearTransformers();
      }
  }

    // Remove transformers and exit edit text
    stage.on('click', clearView);

    function clearView (e) {
    // if click on empty area remove all open transformers
        if (e.target === stage) {
            clearTransformers();
        }
       return;
    }

    function clearTransformers() {
        stage.find('Transformer').destroy();
        layer.draw();
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