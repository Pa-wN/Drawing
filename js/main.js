var canvas = document.getElementById('canvas');
initCanvas(canvas);
listenerUser(canvas);

/***初始化***/
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
/***监听事件***/
function listenerUser(canvas) {
  var ctx = canvas.getContext('2d');
  ctx.lineWidth = 5;  // 默认画笔大小
  var defaultradius = 2;
  var eraser = document.getElementById('eraser');
  var isMousedown = false;
  var usingEraser = false;
  var startPath = { x: undefined, y: undefined };
  var oldActiveColor = $('defaultColor');
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

  /***画画***/
  canvas[start] = function (e) {
    startPath.x = e.x ||  e.touches[0].clientX;
    startPath.y = e.y || e.touches[0].clientY;
    if (usingEraser) {
      clearpainting(e.x - 10, e.y - 10);
      isMousedown = true;
    } else {
      isMousedown = true;
    }
  }

  canvas[move] = function (e) {
    e.preventDefault();
    var x = e.x ||  e.touches[0].clientX;
    var y = e.y || e.touches[0].clientY;
    if (!isMousedown) { return; }
    if (usingEraser) {
      clearpainting(x - 10, y - 10);
    } else {
      drawline(startPath.x, startPath.y, x, y);
      drawCircle(x, y, defaultradius);
      startPath.x = x;
      startPath.y = y;
    }
  }

  canvas[end] = canvas.onmouseout = function () {
    isMousedown = false;
  }



 /***工具***/
  $('eraser').onclick = function () {
    usingEraser = true;
    this.classList.add('active');
    $('pencil').classList.remove('active');
  }
  $('pencil').onclick = function () {
    usingEraser = false;
    this.classList.add('active');
    $('eraser').classList.remove('active');    
  }
  $('delete').onclick = function () {
    $('confirmBox').classList.add('show');
  }
  $("confirm").onclick = function () {
    clearpainting(0, 0, canvas.width, canvas.height);
    $('confirmBox').classList.remove('show');
  }
  $("clear").onclick = function () {
    $('confirmBox').classList.remove('show');
  }
  $('downpct').onclick = function () {
    var Ea = document.createElement('a');
    Ea.download = 'demo.png';
    Ea.href=canvas.toDataURL('image/png');
    document.body.appendChild(Ea);
    Ea.click();
    Ea = null;
  }
  $('pencilSize').onclick = function () {
    ctx.lineWidth = ctx.lineWidth == 10 ? 5 : 10;
    defaultradius = defaultradius == 2 ? 5 : 2;
    if (this.classList.contains('strong')) {
      this.classList.remove('strong');
    } else {
      this.classList.add('strong');
    }
  }
  $('colorBox').onclick = function e(e) {
    if (this == e.target) {
      return;
    }
    oldActiveColor.classList.remove('active');
    oldActiveColor = e.target;
    e.target.classList.add('active');
    changColor(e.target["dataset"].color);
  }

  /***通用函数***/
  // 画线
  function drawline(x, y, endx, endy) {
    ctx.beginPath();
    ctx.moveTo(x, y)
    ctx.lineTo(endx, endy);
    ctx.stroke();
  }
  // 画园
  function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  // 橡皮擦
  function clearpainting(x, y, w, h) {
    ctx.clearRect(x, y, w || 20, h || 20);
  }

  // 改变画笔颜色
  function changColor (color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
  }
  function $(id) {
    return document.getElementById(id);
  }
}



