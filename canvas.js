export default class Canvas {
  constructor(setting) {
    this.set = setting
    // Передаем переменной set общие настройки
    this.canvas = document.createElement('canvas')
    // Создаем элемент canvas и переменную для доступа к нему
    this.ctx = this.canvas.getContext('2d')
    // Создаем в канвасе 2d-контекст, нужен для рисования фигур
    this.canvas.width = this.set.boxWidth
    this.canvas.height = this.set.boxHeight
    // Задаем канвасу высоту и ширину
    document.querySelector('#game').appendChild(this.canvas)
    // Находим в html тег game (id="game") и как дочерний эллемент
    // создаем в нем наш canvas
  }
  drawText(text, x, y, fontSize, color = this.set.textColor, 
                            align = "center", baseline = 'middle') {
    this.ctx.fillStyle = color
    // Указываем цвет заливки
    this.ctx.font = `bold ${fontSize} 'Fira Mono', monospace`
    // Указываем шрифт и атрибуты
    this.ctx.textAlign = align
    // Указываем выравнивание по краю
    this.ctx.textBaseline = baseline
    // Указываем выравнивание по базовой линии
    this.ctx.fillText(text, x, y)
    // Пишем текст, передаем туда строку с текстом
    // и ккординаты начальной точки
  }
  drawLine(xS, yS, xF, yF, lineWidth, color) {
    this.ctx.lineCap = 'round'
    // Указываем, что линия будет с закруглениями на концах
    this.ctx.beginPath() 
    // beginPath() начинает вектор
    this.ctx.moveTo(xS, yS)
    // Аргументами указываем координаты начальной точки линии
    this.ctx.lineTo(xF, yF)
    // Аргументами  указываем координаты конечной точки линии
    this.ctx.lineWidth = lineWidth
    // Указываем толщину линии, ее мы также передаем аргументом
    this.ctx.strokeStyle = color
    // Указываем цвет обводки
    this.ctx.stroke()
    // Рисуем обводку (линию)
    this.ctx.closePath()
    // Завершем создание вектора
  }
  
  drawRectangleRound(x, y, width, height, radius, color) {
    this.ctx.beginPath()
    // beginPath() начинает вектор
    this.ctx.moveTo(x + radius, y)
    // Указываем координаты начальной точки линии
    this.ctx.lineTo(x + width - radius, y)
    // Указываем координаты следующей точки линии
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    // Указываем координаты точки, до куда будет идти закругление
    this.ctx.lineTo(x + width, y + height - radius)
    // Указываем координаты следующей точки линии и т.д
    this.ctx.quadraticCurveTo(x + width, y + height,
                                     x + width - radius, y + height)
    this.ctx.lineTo(x + radius, y + height)
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    this.ctx.lineTo(x, y + radius)
    this.ctx.quadraticCurveTo(x, y, x + radius, y)
    this.ctx.closePath()
    // Завершем создание вектора
    this.ctx.fillStyle = color
    // Указываем цвет заливки
    this.ctx.fill()
    // Создаем заливку
  }
  
  drawCircle(x, y, radius, fillColor, stroke = true) {
    this.ctx.beginPath()
    // beginPath() начинает вектор
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    // Создаем арку. Агругументами выступают координаты
    // центра окружности, радиус, начальный угол в радианах
    // и конечный угол в радианах.
    // Math.PI*2 это число Пи умноженное на 2, дает замкнутый круг. 
    this.ctx.fillStyle = fillColor
    // Указываем цвет заливки
    this.ctx.fill()
    // Создаем заливку
    if (stroke) {
    // Если нам не нужна обводка, то аргументам мы передаем false,
    // а по умолчанию обводка есть
      this.ctx.lineWidth = 6
      // Указываем толщину линии
      this.ctx.strokeStyle = this.set.lineColor
      // Указываем цвет обводки
      this.ctx.stroke()
      // Рисуем обводку
    }
    this.ctx.closePath()
    // Завершем создание вектора
  }
   drawArc(radius, sAngle, eAngle, color = this.set.textColor) {
    const centerW = (this.set.boxWidth / 2)
    const centerH = (this.set.boxHeight / 2)
    
    this.ctx.lineCap = 'round'
    this.ctx.beginPath()
    this.ctx.arc(centerW, centerH, radius, sAngle, eAngle)
    this.ctx.lineWidth = 6
    this.ctx.strokeStyle = color
    this.ctx.stroke()
    this.ctx.closePath()
  }
   clear() {        
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
