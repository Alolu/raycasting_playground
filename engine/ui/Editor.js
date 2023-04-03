class ViewPort {
    constructor(canvas) {
      this.canvas = canvas

      /**
        * Point used to calculate the change of every point's position on
        * canvas after view port is zoomed and panned
        */
      this.center = this.basicCenter

      this.zoom = 1

      this.shouldPan = false
      this.prevZoomingPoint = null
    }

    get canvasWidth() {
      return this.canvas.getBoundingClientRect().width
    }

    get canvasHeight() {
      return this.canvas.getBoundingClientRect().height
    }

    get canvasLeft() {
      return this.canvas.getBoundingClientRect().left
    }

    get canvasTop() {
      return this.canvas.getBoundingClientRect().top
    }

    get context() {
      return this.canvas.getContext('2d')
    }

    get basicCenter() {
      const { canvasWidth, canvasHeight } = this

      const point = {
        x: canvasWidth / 2,
        y: canvasHeight / 2
      }
      return point
    }

    get basicWidth() {
      const width = this.canvasWidth
      return width
    }

    get basicHeight() {
      const height = this.canvasHeight
      return height
    }

    get width() {
      const { basicWidth, zoom } = this
      const width = basicWidth * zoom
      return width
    }

    get height() {
      const { basicHeight, zoom } = this
      const height = basicHeight * zoom
      return height
    }

    get movement() {
      const { width, height, basicWidth, basicHeight } = this
      const { x: cx, y: cy } = this.center
      const { x: basicCX, y: basicCY } = this.basicCenter

      const deltaX = cx - basicCX - ((width - basicWidth) / 2)
      const deltaY = cy - basicCY - ((height - basicHeight) / 2)
      const res = {
        x: deltaX,
        y: deltaY
      }

      return res
    }

    get pan() {
      const { center, zoom, basicCenter } = this
      const res = {
        x: center.x - basicCenter.x,
        y: center.y - basicCenter.y
      }
      return res
    }

    zoomBy(center, deltaZoom) {
      const prevZoom = this.zoom

      this.zoom = this.zoom + deltaZoom

      this.center = this.zoomPoint(center, this.zoom / prevZoom, this.center)
    }

    zoomIn(point) {
      this.zoomBy(point, 0.1)
    }

    zoomOut(point) {
      this.zoom > 0.25 && this.zoomBy(point, -0.1)
    }

    zoomPoint(center, rate, point) {
      const { x: cx, y: cy } = center
      const { x, y } = point

      const deltaX = (x - cx) * rate
      const deltaY = (y - cy) * rate

      const newPoint = {
        x: cx + deltaX,
        y: cy + deltaY
      }
      return newPoint
    }

    panBy(deltaX, deltaY) {
      const { x: centerX, y: centerY } = this.center
      this.center = {
        x: centerX + deltaX,
        y: centerY + deltaY
      }
    }

    getDeltaPointToPrevPanningPoint(point) {
      const { x, y } = point
      const { x: prevX, y: prevY } = this.prevZoomingPoint

      const deltaPoint = {
        x: x - prevX,
        y: y - prevY
      }
      return deltaPoint
    }


    startPan(event) {
      const point = {
        x: event.x - this.canvasLeft,
        y: event.y - this.canvasTop,
      }

      this.shouldPan = true

      this.prevZoomingPoint = point
    }

    panning(event) {
      const point = {
        x: event.x - this.canvasLeft,
        y: event.y - this.canvasTop,
      }

      const deltaX = this.getDeltaPointToPrevPanningPoint(point).x
      const deltaY = this.getDeltaPointToPrevPanningPoint(point).y

      this.prevZoomingPoint = point

      this.panBy(deltaX, deltaY)
    }

    stopPan() {
      this.shouldPan = false
    }

    transformToInitial(point) {
      const { x, y } = point
      const { movement, zoom } = this
      const res = {
        x: (x - movement.x) / zoom,
        y: (y - movement.y) / zoom
      }
      return res
    }

    transform(point) {
      const { x, y } = point
      const { movement, zoom } = this
      const res = {
        x: x * zoom + movement.x,
        y: y * zoom + movement.y
      }
      return res
    }

    clearCanvas() {
      this.context.setTransform(1, 0, 0, 1, 0, 0)
      this.context.clearRect(
        0,
        0,
        this.canvasWidth,
        this.canvasHeight
      )
    }
}

class Interaction {
constructor({
    canvas,
    viewPort,
    dragger,
    render 
}) {

    canvas.removeEventListener("mousewheel", mousewheelListener)
    canvas.addEventListener("mousewheel", mousewheelListener)

    canvas.removeEventListener("mousedown", mousedownListener)
    canvas.addEventListener("mousedown", mousedownListener)

    canvas.removeEventListener("mousemove", mousemoveListener)
    canvas.addEventListener("mousemove", mousemoveListener)

    canvas.removeEventListener("mouseup", mouseupListener)
    canvas.addEventListener("mouseup", mouseupListener)


    function mousewheelListener(event) {
    event.preventDefault()

    const point = {
        x: event.x - canvas.getBoundingClientRect().left,
        y: event.y - canvas.getBoundingClientRect().top,
    }

    const { deltaX, deltaY } = event

    if (isDecreasing()) {
        viewPort.zoomIn(point)
    }

    if (isIncreasing()) {
        viewPort.zoomOut(point)
    }

    function isIncreasing() {
        const res = deltaX > 0 || deltaY > 0
        return res
    }
    function isDecreasing() {
        const res = deltaX < 0 || deltaY < 0
        return res
    }

    render()

    }


    function mousedownListener(event) {
    viewPort.startPan(event)
    }

    function mousemoveListener(event) {
    viewPort.shouldPan && viewPort.panning(event)
    viewPort.shouldPan && render()
    }

    function mouseupListener(event) {
    viewPort.stopPan(event)
    }
}

}

class Editor {
    constructor(){
        this.vp = new ViewPort(SCREEN)
        this.interact = new Interaction({
            canvas: SCREEN,
            viewPort: this.vp,
            render: this.render.bind(this)
        })

        this.render();
    }

    origin;
    end;

    render(){
        const { abs, max } = Math
        const { zoom, movement, context: ctx, pan, center, basicCenter } = this.vp
    
        this.vp.clearCanvas()
        ctx.setTransform(zoom, 0, 0, zoom, movement.x, movement.y)
    
    
        // Original codes are rewrote
        const { canvasWidth, canvasHeight } = this.vp
    
        const interval = 20
        const basicWidth = canvasWidth
        const basicHeight = canvasHeight
    
        const potentialWidth = 2 * max(abs(this.vp.transformToInitial({ x: 0, y: 0 }).x - basicCenter.x), abs(this.vp.transformToInitial({ x: basicWidth, y: 0 }).x - basicCenter.x))
        const width = potentialWidth > basicWidth ? potentialWidth : basicWidth
    
        const potentialHeight = 2 * max(abs(this.vp.transformToInitial({ x: 0, y: 0 }).y - basicCenter.y), abs(this.vp.transformToInitial({ x: 0, y: basicHeight }).y - basicCenter.y))
        const height = potentialHeight > basicHeight ? potentialHeight : basicHeight
        
        //ctx.fillStyle = '#eaeae9'
        //ctx.fillRect(0,0,width,height)

        this.origin = basicCenter.x - width / 2;
        this.end = basicCenter.x + width / 2;
        drawXAxis()

        function drawXAxis() {
            const path = new Path2D;
            path.moveTo(basicCenter.x - width / 2, basicHeight / 2)
            path.lineTo(basicCenter.x + width / 2, basicHeight / 2)
      
            ctx.stroke(path)
        }
        
    }
}

