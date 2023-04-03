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
        viewPort.canvasWidth,
        viewPort.canvasHeight
      )
    }
}

class Interaction {
constructor({
    canvas,
    viewPort,
    dragger
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

  const canvas = document.getElementById("myCanvas")
  const viewPort = new ViewPort(canvas)
  const interaction = new Interaction({ viewPort, canvas })

  function render() {
    const { abs, max } = Math
    const { zoom, movement, context: ctx, pan, center, basicCenter } = viewPort

    viewPort.clearCanvas()
    ctx.setTransform(zoom, 0, 0, zoom, movement.x, movement.y)


    // Original codes are rewrote
    const { canvasWidth, canvasHeight } = viewPort

    const interval = 20
    const basicWidth = canvasWidth
    const basicHeight = canvasHeight

    const potentialWidth = 2 * max(abs(viewPort.transformToInitial({ x: 0, y: 0 }).x - basicCenter.x), abs(viewPort.transformToInitial({ x: basicWidth, y: 0 }).x - basicCenter.x))
    const width = potentialWidth > basicWidth ? potentialWidth : basicWidth

    const potentialHeight = 2 * max(abs(viewPort.transformToInitial({ x: 0, y: 0 }).y - basicCenter.y), abs(viewPort.transformToInitial({ x: 0, y: basicHeight }).y - basicCenter.y))
    const height = potentialHeight > basicHeight ? potentialHeight : basicHeight

    drawXAxis()
    drawYAxis()
    drawOriginCoordinate()
    drawXCoordinates()
    drawYCoordinates()

    function drawXAxis() {
      const path = new Path2D

      path.moveTo(basicCenter.x - width / 2, basicHeight / 2)
      path.lineTo(basicCenter.x + width / 2, basicHeight / 2)

      ctx.stroke(path)
    }

    function drawYAxis() {
      const path = new Path2D
      path.moveTo(basicWidth / 2, basicCenter.y - height / 2)
      path.lineTo(basicWidth / 2, basicCenter.y + height / 2)

      ctx.stroke(path)
    }

    function drawOriginCoordinate() {
      ctx.fillText(`O`, basicCenter.x + 5, basicCenter.y - 5)
    }

    function drawXCoordinates() {
      for (let i = 1; i <= width / 2 / interval; i++) {
        total = i * interval
        ctx.fillText(` ${i} `, basicCenter.x + total, basicHeight / 2)
      }

      for (let i = 1; i <= width / 2 / interval; i++) {
        total = i * interval
        ctx.fillText(` -${i} `, basicCenter.x - total, basicHeight / 2)
      }
    }

    function drawYCoordinates() {
      for (let i = 1; i <= height / 2 / interval; i++) {
        total = i * interval
        ctx.fillText(` ${i} `, basicWidth / 2, basicCenter.y + total)
      }

      for (let i = 1; i <= height / 2 / interval; i++) {
        total = i * interval
        ctx.fillText(` -${i} `, basicWidth / 2, basicCenter.y - total)
      }
    }
  }

  render()