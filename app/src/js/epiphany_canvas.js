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

  stage.on('dblclick', onDoubleClick);


  function onDoubleClick () {
      var group = new Konva.Group({
          draggable: true,
          name: "stickyGroup"
      });
      layer.add(group);

      // add cursor styling
      group.on('mouseover', function() {
          document.body.style.cursor = 'pointer';
      });
      group.on('mouseout', function() {
          document.body.style.cursor = 'default';
      });

      // UNCOMMENT THIS BLOCK to try sticky 'lifting' and 'dropping' animation
      // TODO is buggy (only works on first sticky, doesn't raise text too,
      // animation not smooth)
      // ------------------------------------------------------
      // Sticky 'raises' when dragged
      group.on('dragstart', function() {
          group.tweenGrab.play();
      });

      // Sticky comes back down when dropped
      group.on('dragend', function() {
          group.tweenDrop.play();
      });
      // ------------------------------------------------------


      // group.add( new Konva.Rect({
        var rect = new Konva.Rect({
          x: stage.getPointerPosition().x - 125,
          y: stage.getPointerPosition().y - 10,
          width: 250,
          height: 250,
          fill: '#fffdd0',
          shadowColor: 'black'
      });
      group.add(rect);


      var textNode = new Konva.Text({
          x: stage.getPointerPosition().x - 125,
          y: stage.getPointerPosition().y,
          text: '',
          fontSize: 35,
          fontFamily: 'Calibri',
          fill: '#555',
          width: 250,
          padding: 20,
          align: 'center',
          listening: true
      });
      group.add(textNode);

      function editText() {
          // Disallow stage and current sticky movement when editing text
          stage.draggable(false);
          stage.off('wheel');
          group.draggable(false);

          var textPosition = textNode.getAbsolutePosition();
          var stageBox = stage.getContainer().getBoundingClientRect();


          var areaPosition = {
              x: textPosition.x + stageBox.left,
              y: textPosition.y + stageBox.top
          };

          // create textarea and style it
          var textarea = document.createElement('textarea');
          document.body.appendChild(textarea);

          textarea.value = textNode.text();
          textarea.style.position = 'absolute';
          textarea.style.top = areaPosition.y - 10 + 'px';
          textarea.style.left = areaPosition.x + 'px';
          textarea.style.width = textNode.width();

          textarea.focus();


          textarea.addEventListener('keydown', function (e) {
              // hide on enter
              if (e.keyCode === 13) {
                  // Reallow stage and current sticky movement after editing text
                  stage.draggable(true);
                  stage.on('wheel', onWheel);
                  group.draggable(true);

                  textNode.text(textarea.value);
                  layer.draw();
                  document.body.removeChild(textarea);
              }
          });
      }
      editText();

      group.on('click', () => {
          editText();
      });

      // Tween for drag and drop
      group.tweenGrab = new Konva.Tween({
        node: rect,
        shadowOffsetX: 15,
        shadowOffsetY: 15,
        duration: 0.5,
        scaleX: 1.1,
        scaleY: 1.1,
        easing: Konva.Easings.ElasticEaseOut,

      });

      group.tweenDrop = new Konva.Tween({
        node: rect,
        duration: 1,
        easing: Konva.Easings.ElasticEaseOut,
        scaleX: 1,
        scaleY: 1,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      });

      var tr2 = new Konva.Transformer({
        node: group,
        keepRatio: true,
        anchorSize: 10,
        borderStroke: 'gray',
        rotationSnaps: [0, 90, 180, 270],

      });
      layer.add(tr2);
      layer.draw();

      stage.on('click tap', function (e) {
       // if click on empty area - remove all transformers
         if (e.target === stage) {
           stage.find('Transformer').destroy();
           layer.draw();
           return;
         }
         // do nothing if clicked NOT on our rectangles
         if (!e.target.parent.hasName("stickyGroup")) {
           return;
         }

         // remove old transformers
         // TODO: we can skip it if current rect is already selected
         stage.find('Transformer').destroy();

         // create new transformer
         var tr = new Konva.Transformer();
         tr.attachTo(e.target.parent);
         layer.add(tr);
         layer.draw();
       });
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
      console.log(stage.getPointerPosition().x);
      console.log(stage.getPointerPosition().y);

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

//      console.log(stage.width());
//      console.log(stage.height());

  }
}

export default epiphany_canvas;