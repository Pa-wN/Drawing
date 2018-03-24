var canvas = document.getElementById('canvas');
initCanvas(canvas);
listenerUser(canvas);

// 初始化
function initCanvas(canvas) {
  function setCanvasSize() {
    var pageWidth = document.documentElement.clientWidth;
    var pageHeight = document.documentElement.clientHeight;
    canvas.width = pageWidth;
    canvas.height = pageHeight;
  }
  setCanvasSize();
  window.onresize = setCanvasSize;
}
/********/
// 监听事件
function listenerUser(canvas) {
  var ctx = canvas.getContext('2d');
  var eraser = document.getElementById('eraser');
  var isMousedown = false;
  var usingEraser = false;
  var startPath = { x: undefined, y: undefined };

  var start, move, end;
  if (document.body.ontouchstart !== undefined) {
    // 触屏设备
    start = 'ontouchstart';
    move = 'ontouchmove';
    end = 'ontouchend';
  } else {
    start = 'onmousedown';
    move = 'onmousemove';
    end = 'onmouseup';
  }

  canvas[start] = function (e) {
    startPath.x = e.x ||  e.touches[0].clientX;
    startPath.y = e.y || e.touches[0].clientY;
    if (usingEraser) {
      clear(e.x - 10, e.y - 10);
      isMousedown = true;
    } else {
      isMousedown = true;
    }
  }

  canvas[move] = function (e) {
    var x = e.x ||  e.touches[0].clientX;
    var y = e.y || e.touches[0].clientY;
    if (!isMousedown) { return; }
    if (usingEraser) {
      clear(x - 10, y - 10);
    } else {
      drawline(startPath.x, startPath.y, x, y);
      drawCircle(x, y);
      startPath.x = x;
      startPath.y = y;
    }
  }

  canvas[end] = canvas.onmouseout = function () {
    isMousedown = false;
  }



  eraser.onclick = function () {
    usingEraser = !usingEraser;
  }

  // 画线
  function drawline(x, y, endx, endy) {
    ctx.beginPath();
    ctx.moveTo(x, y)
    ctx.lineWidth = 5;
    ctx.lineTo(endx, endy);
    ctx.stroke();
  }
  // 画园
  function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2)
    ctx.fill()
  }
  // 橡皮擦
  function clear(x, y) {
    ctx.clearRect(x, y, 20, 20);
  }
}



