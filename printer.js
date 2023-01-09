import Canvas from './canvas.js'
// В файл подключаем класс Canvas

export default class Printer {
  constructor(setting) {    
  // В принтер передаем только настройки
    this.set = setting
    this.ball = setting.ball
    // Передаем общие настройки переменной set,
    // а переменной ball настройки мячика, для удобства
    
    this.canvas = new Map([        
    // Создаем новый Map с пятью классами Canvas под разные нужды,
    // порядок будущих слоев влияет на их видимость, первый будет 
    // перекрывать вторым и т.д.        
      ['background', new Canvas(this.set)],            
      // На слое background рисуется неподвижные и необновляемые
      // элементы игры. Игровое поле            
      ['score', new Canvas(this.set)],            
      // Слой для отрисовки счета игроков            
      ['support', new Canvas(this.set)],            
      // Слой для впомогательных функций,            
      // не нужен для игры            
      ['other', new Canvas(this.set)],            
      // Дополнительный слой для разных задач            
      ['text', new Canvas(this.set)],            
      // Слой для текста, появляющегося на экране            
      ['gamelayer', new Canvas(this.set)]            
      // Слой для игровых элементов с постоянной перерисовкой,       
      // таких как мячик и игроки            
      ])        
    this.bgCan = this.canvas.get('background')        
    this.scoreCan = this.canvas.get('score')        
    this.supCan = this.canvas.get('support')        
    this.othCan = this.canvas.get('other')        
    this.txtCan = this.canvas.get('text')        
    this.gameCan = this.canvas.get('gamelayer')        
    // Для сокращения ширины кода, помещаю пути обращения
    // к Canvas в переменные, можно этого не делать
    
    this.ballDirectionAngle = 0        
    // Переменная ballDirectionAngle нужна передачи значения угла,
    // под которым требуется рисовать белый бегунок, отображающий    
    // направление броска мячика    
  }
  drawBackground() {        
    const width = this.set.boxWidth        
    const height = this.set.boxHeight        
    // Высота и ширина игрового поля и всех слоев канваса
    const boxRound = this.set.boxRound        
    // Радиус закругления углов игрового поля        
    const boxColor = this.set.boxColor        
    // Цвет заливки игрового поля        
    const lineW = this.set.lineWidth        
    const lineColor = this.set.lineColor        
    // Толщина и цвет линий        
    const plSpace = this.set.playerSpace        
    // Пространство от центра платформы игрока до стенки за ним
    const plBorder = this.set.playerBorder        
    // Пространство от краев игрока до стенки сверху и снизу
  
    this.bgCan.drawRectangleRound(0, 0, width, height,
                                               boxRound, boxColor)
    // Рисуем основной прямоугольник игрового поля с закруглениями
    
    this.bgCan.drawLine((width / 2), 0, (width / 2),
                                           height, lineW, lineColor)
    // Рисуем вертикальную линию посередине
    
    this.bgCan.drawCircle((width / 2), (height / 2),
                                    (height / 4), boxColor)
    // Рисуем круг посередине, с радиусом в 1/4 высоты поля
    
    this.bgCan.drawLine(plSpace, plBorder, plSpace,
                             (height - plBorder), lineW, lineColor)
    this.bgCan.drawLine((width - plSpace), plBorder,
          (width - plSpace), (height - plBorder), lineW, lineColor)
    // Рисуем 2 линии под игроками с отступами от края
  }
   drawBriefing() {
    const plLColor = this.set.playerL.color
    const plRColor = this.set.playerR.color
    // Цвета левого и правого игроков
    const controlXL = (this.set.playerSpace * 2)
    const controlXR = this.set.boxWidth - (this.set.playerSpace * 2)
    const controlY = (this.set.boxHeight / 17)
    // Координаты x и y для текста с инструкцией
    // Немного сложно, но все координаты отталкиваются от статичных
    // значений и масштабируются с игровым полем

    this.gameCan.drawText('keys:', controlXL , (controlY * 8),
                                         '15px', plLColor, 'left')
    this.gameCan.drawText('W and S', controlXL, (controlY * 9),
                                         '20px', plLColor, 'left')
    this.gameCan.drawText('keys:', controlXR, (controlY * 8),
                                        '15px', plRColor, 'right')
    this.gameCan.drawText('Arrows', controlXR, (controlY * 9),
                                        '20px', plRColor, 'right')
    // Параметр 'left' рисует текст справа от точки координат,
    // а параметр 'right', наоборот, слева.
    // Таким образом цифры счета никогда не слипнутся (⊙_⊙)
  }
   drawScore() {
    const plLColor = this.set.playerL.color
    const plRColor = this.set.playerR.color
    // Цвета левого и правого игроков
    const plLScore = this.set.playerL.score
    const plRScore = this.set.playerR.score
    // Значение количества очков каждого игрока
    const scoreXL = (this.set.boxWidth / 9 * 4)
    const scoreXR = (this.set.boxWidth / 9 * 5)
    const scoreY = (this.set.boxHeight / 20)
    // Координаты x и y для отбражения очков игроков
    // отталкиваются от статичных значений ширины и высоты поля
    
    this.scoreCan.drawText(plLScore, scoreXL, scoreY, '40px',
                                         plLColor, 'right', 'top')
    this.scoreCan.drawText(plRScore, scoreXR, scoreY, '40px',
                                          plRColor, 'left', 'top')
    // Рисуем текст счета. Для каждого игрока свой цвет,
    // и свое выравнивание
  }
  drawBallDirection(int = 2) {   
  // В функцию передается переменная int, которая содержит
  // корректировщик коээфициента значения угла. Она может иметь
  // значение 2 для таймера после гола и 4 для начального таймера

    if (this.ball.dx > 0 && this.ball.dy > 0) {
    // Ось координат канваса начинается сверху слева, поэтому
    // если направление мячика по X больше 0, то он летит вправо,
    // если направление мячика по Y больше 0, то он летит вниз     
    // следовательно здесь мячик летит по диагонали вправо вниз
      this.ballDirectionAngle = 6.3    
      // Я подобрал необходимые коэффициенты для       
      // значений угла окружности, в котором бегунок 
      // должен будет остановиться
        
      // В зависимости от направления полета мячика
      // передаем нужное значение во внешнюю переменную
    }
    if (this.ball.dx < 0 && this.ball.dy > 0) {
        this.ballDirectionAngle = 6.8
    }        
    if (this.ball.dx < 0 && this.ball.dy < 0) {
        this.ballDirectionAngle = 7.3
    }
    if (this.ball.dx > 0 && this.ball.dy < 0) { 
        this.ballDirectionAngle = 7.8
    }
    this.loopBallDirection(this.ballDirectionAngle - int) 
    // Запускаем цикл рисования белого бегунка,        
    // передаем в него значение угла минус значение переменной int.
    // Я нарочно увеличил значения углов на 2 оборота окружности,
    // чтоб при вычитании значения оставались положительными.
    // В противном случае появляются погрешности¯\_(ツ)_/¯
  }
  
  loopBallDirection(someAngle) {    
  // Функция представляет собой цикл, перерисовывающий бегунок,
  // пока он не достигнет нужного угла на окружности        
    const rad = (this.set.boxHeight / 4)        
    // Радиус окружности такой же, как радиус круга на игровом поле
    let angle = someAngle        
    // При первом вызове функции переменной angle присваивается   
    // значение угла, полученного из drawBallDirection(),
    // но в последствии оно берется из цикла
          
    this.othCan.drawArc(rad, Math.PI * angle - 0.3, Math.PI * angle)
    // Рисуем часть окружности через функцию канвасе        
    setTimeout(() => {
      angle += 0.1 
      if(angle <= this.ballDirectionAngle) {                
      this.clear('other')                
      this.loopBallDirection(angle)            
      }        
    }, '60')         
    // С помощью встроенной в JS функции setTimeout(),        
    // делаем задержку в 0.06 секунд, или '60' милисекунд    
  }
  centerText(text, fontSize = '90px', color = this.set.textColor) {
  // Функция рисует текст в центре экрана, по умолчанию использует    
  // белый цвет и '90px' размер шрифта, это счетчик стартового таймера
    const centerW = (this.set.boxWidth / 2)        
    const centerH = (this.set.boxHeight / 2)        
    // Координаты центра игрового поля
    
    this.txtCan.drawText(text, centerW, centerH, fontSize, color)    
  }    
  
  drawBallHit() {    
  // Функция рисует счетчик ударов по цетру экрана.    
  // Можно было обойтись одной фунцией centerText(), но так понятнее
    this.centerText(this.set.ballHitScore, '70px', this.set.lineColor)
    // Используем цвет линий, чтоб счетсчик не отвлекал внимание    
  }    
  
  drawGoal(x, color, align) {    
  // Функция вызывается из экземпляра Player и принимает координату Х,
  // цвет игрока и выравнивание        
    this.txtCan.drawText('+1', x, this.ball.y, '20px', color, align)
    // рисуем "+1" на поле проигравшего. Цветом забившего игрока  
    this.centerText('Goal!', '50px', color)        
    // Рисуем надпись "Goal" в центре. Цветом забившего игрока        
    setTimeout(() => {            
      this.clear('text') }, '800')            
      // Через 0.8 сукунд отчищаем слой 'text'    
  }
    drawBall() {    
  // Рисует мячик используя его текущее местоположение
    let ballX = this.ball.x        
    let ballY = this.ball.y        
    let radius = this.set.ballRadius        
    let color = this.set.ballColor
    
    this.gameCan.drawCircle(ballX, ballY, radius, color, false)
  } 
  
  drawPlayer(xS, yS, yF, lineWidth, color) {    
  // Рисует игрока используя его текущее местоположение.    
  // Принимает координату Х и две координаты Y, верхнюю и нижнюю    
  // Рисует между ними линию. Также принимает толщину линии
  // и цвет игрока
    this.gameCan.drawLine(xS, yS, xS, yF, lineWidth, color)    
  }
   clear(canvas) {
    // Функция отчищает нужный канвас    
    // Передаем в нее имя нужного слоя в виде 'строки' текста
    this.canvas.get(canvas).clear()    
  }
    drawShadowPlayer(xS, yS, yF) {    
  // Функция рисует фактический размер игрока.
  // В движении зона отбития платформы увеличивается
    const color = this.set.supportColorYellow
    const plWidth = (this.set.playerRadius * 2)
  
    this.supCan.drawLine(xS, yS, xS, yF, plWidth, color)
  }
  
  drawYellowZone(x, yS, yF) {    
  // Если мячик находится в желтой зоне (перед игроком),
  // то он отскакивает от координаты X игрока. Тут мы подсвечиваем
  // эту желтую зону
    const color = this.set.supportColorYellow
    const center = (this.set.boxWidth / 2)

    this.supCan.drawLine(x, yS, center, yS, 1, color)
    this.supCan.drawLine(x, yF, center, yF, 1, color)
  }
  
  drawAngleZone() {    
  // Функция подсвечивает все направления вылета мяча,
  //нужны были для расчета угла остановки белого бегунка
    const color = this.set.supportColorRed
    const radius = (this.set.boxHeight / 4)
    
    this.supCan.drawArc(radius, Math.PI * 0.2, Math.PI * 0.3, color)
    this.supCan.drawArc(radius, Math.PI * 0.7, Math.PI * 0.8, color)
    this.supCan.drawArc(radius, Math.PI * 1.2, Math.PI * 1.3, color)
    this.supCan.drawArc(radius, Math.PI * 1.7, Math.PI * 1.8, color)
  }
}