export default class Player {
  constructor(Game, playerSet) {
  // В Player мы передали весь класс Game и отдельно свойства игрока
    this.set = Game.set
    // Передаем переменной set общие настройки        

    this.ball = Game.set.ball
    this.classBall = Game.ball
    // Для удобства, выделим в отдельную переменную ball
    // все изменяемые настройки мячика, а через classBall,
    // мы будем получать доступ к классу Ball и его методам

    this.print = Game.print
    // Для доступа к модулю Printer

    this.player = playerSet
    // Переменной player присваиваем свойсва игрока переданные
    // в класс Player, уникальные для каждого экземпляра Player 

    this.keyMap = new Map(playerSet.keys)
    // Создаем новый Map (это коллекция ключ/значение) из keys.
    // В данном случаем ключ - это номер клавиши, 
    // а значение - это строка с направлением движения
    // Пример => keys: [[87,'up'], [83,'down']],

    document.addEventListener('keydown',
                             (e) => this.keyController(e, true))
    document.addEventListener('keyup',
                             (e) => this.keyController(e, false))
    // Создаем два слушателя событий. В них передаем событие
    // (нажатие или отжатие клавиши) и слушателя

    this.shadowUp = 0
    this.shadowDown = 0
    // Две переменные, которые нужны для виртуального
    // расширения платформ во время движения, чтоб был шанс
    // отбить мяч "в последний момент" ╰(*°▽°*)╯
    // то как это работает, покажет функция support()

    this.yellowZone = true
    // Переменная служит индикатором нахождения мяча в желтой зоне.
    // Это зона перед платформой.
    // Желтую зону также покажет функция support()
    
    this.ballReversStatus = true
    // Переменная служит для запрета разворота мячика, чтоб он
    // не мог менять направления чаще чем каждые полсекунды
    // используется в функции checkCollisionWithBall()
  }
  keyController(e, state) {
    if(this.keyMap.has(e.keyCode)) {
    // Метод has() показывает существует ли элемент
    // с указанным значением в объекте
    // И если нажата клавиша, которая есть в keyMap,
    // то он выдает true
      this[this.keyMap.get(e.keyCode)] = state
      // get() возвращает связанный с ключем элемент, он
      // вернет 'up' или 'down' в зависимости от нажатой клавиши.
      // Создаем переменную с именем результата метода get()
      // и присваиваем ей статус true или false
    }
  }
  
  move() {
  // Двигает платформу игрока, прибавляя 1 к его координатам,
  // умножая на коэффециент скорости
    const plHeight = this.set.playerHeight
    const plSpeed = this.set.playerSpeed
    const plBorder = this.set.playerBorder
    const boxHeight = this.set.boxHeight
    // Переменные выше созданы только для уменьшения ширины кода,
    // чтоб он влез в статью без горизонтальной прокрутки¯\_(ツ)_/¯
   
    if (this.up) {
    // Если this.up = true, т.е. клавиша 'вверх' нажата, то
      if (this.player.y > plBorder) {
      // Бордер это растояние от задней стены, до центра игрока.
      // На такое же растояние платформы 'недоезжают' до краев поля.
      // Если растояние от Y игрока (это верхний край платформы)
      // больше чем бордер, то
        this.player.y -= plSpeed
        // Мы уменьшаем текущую координату Y на скорость 
        // платформы игрока из настроек (по умолчанию это 10).
        // Т.е. двигаем игрока вверх на 10 пикселей
      } else {
      // Если платформа достигла ограничения или перескочила его
      // (это возможно т.к. платформы движуться по 8 пикселей), то
        this.player.y = plBorder
        // Мы возвращаем платформу в последнее возможное положение,
        // на растояние бордера от края поля 
      }
      this.shadowUp = (plSpeed * 2)
      // Если this.up = true, т.е. клавиша 'вверх' нажата, то
      // присваиваем переменной shadowUp двойное значение скорости
      // это 16 пикселей
    }
    else if (this.down) {
    // Если this.down = true, т.е. клавиша 'вниз' нажата, то
      if ((this.player.y + plHeight + plBorder) < boxHeight) {
      // Т.к. игрок это верхняя точка платформы, надо прибавить
      // длину игрока, для получения координаты нижней его точки
        this.player.y += plSpeed
        // Мы увеличиваем текущую координату Y на скорость 
        // платформы игрока из настроек (по умолчанию это 10).
        // Т.е. двигаем игрока вниз на 10 пикселей
      } else {
        this.player.y = (boxHeight - plHeight - plBorder)
        // Возвращаем платформу в последнее возможное положение,
        // на растояние бордера от нижнего края поля
      }
      this.shadowDown = (plSpeed * 2)
      // Если this.down = true, т.е. клавиша 'вниз' нажата, то
      // присваиваем переменной shadowDown двойное значение скорости
      // это 16 пикселей
    } else {
      this.shadowUp = 0
      this.shadowDown = 0
      // Если клавиши не нажаты, возвращаем нашу "тень" в ноль
    }
  }
  checkYellowZone() { 
    const plHeight = this.set.playerHeight
    // Длина игрока, растояние от его верхней до нижней точки 
    
    if (this.ball.y > (this.player.y - this.shadowUp)
    // Если Y мячика больше (мячик ниже) верхней точки игрока
    && this.ball.y < (this.player.y + plHeight + this.shadowDown)) {
    // и Y мячика меньше (мячик выше) нижней точки игрока
      this.yellowZone = true
      // Значит мячик находится перед игроком, в желтой зоне
    } else {
      this.yellowZone = false
      // Если не так, то не в желтой ¯\_(ツ)_/¯
    }
  }
    checkCollisionWithBall() {
    const plHeight = this.set.playerHeight
    // Длина игрока, растояние от его верхней до нижней точки
    
    let dx = this.ball.x - this.player.x
    // Вычисляем разницу между координатами X мячика и Y игрока
    let dy = this.ball.y - (this.player.y - this.shadowUp)
    // Разница между Y мячика и Y игрока (верхним краем игрока),
    // также учитываем тень, если она есть
    let dyF =this.ball.y -(this.player.y + plHeight + this.shadowDown)
    // Разница координаты Y мячика и нижнего края игрока,
    // с учетом его тени, если она есть
    let radSum = this.set.ballRadius + this.set.playerRadius
    // Сумма радиусов мячика и платформы
    
    let dY = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    // Растояние от центра мячика, до края платформы.
    // Math.sqrt() вычисляет квадратный корень, а
    // Math.pow() возводит значение dx в степень 2 (в квадрат)
    let dYF = Math.sqrt(Math.pow(dx, 2) + Math.pow(dyF, 2))
    // Растояние от центра мячика, до нижнего края платформы.
    let dX = Math.sqrt(Math.pow(dx, 2))
    // Убрал из расчета кординату Y, чтобы видеть столкновение
    // координат Х независимо от положения мячика по Y.
    // Это надо для расчета удара о плоскость платформы
    
    if (dX <= radSum) {
    // Если растояние между центрами объектов меньше суммы их
    // радиусов (в данном случае это Х мячика и Х платформы), то
      if (this.yellowZone && this.ballReversStatus) {
      // Если мячик находится в желтой зоне
      // и он не менял направление последние полсекунды, то
        this.hitBall(this.ball.dx)
        // Вызываем функцию hitBall() для разворота мяча
        // и передаем в нее только значение dx, т.к в желой зоне
        // мячик отбивается от плоскости платформы только по оси Х
      }
    }
    if (this.ball.dy > 0) {
    // Если ускорение мячика положительное, т.е. мячик летит вниз, то
      if (dY <= radSum) {
      // Если есть столкновение с верхним краем платформы, то
        if (!this.yellowZone) {
        // Если мячик не в желтой зоне, то
          this.hitBall(this.ball.dx, this.ball.dy)
          // Вызываем функцию hitBall() для разворота мяча по обои
          // осям, мячик развернутся на 180°
        }
      }
    }
    if (this.ball.dy < 0) {
    // Если ускорение мячика отрицательное, т.е. мячик летит вверх, то
      if (dYF <= radSum) {
      // Если есть столкновение с нижним краем платформы, то
        if (!this.yellowZone) {
        // Если мячик не в желтой зоне, то
          this.hitBall(this.ball.dx, this.ball.dy)
          // Вызываем функцию hitBall() для разворота мяча по обои
          // осям, мячик также развернутся на 180°
        }
      }
    }
  }
  
  hitBall(dx, dy) {
  // Аргументом мы передаем только dx или dx и dy мячика
    this.ball.dx = this.classBall.reverseBall(dx)
    // Разворачиваем мячик по оси Х с помощью метода reverseBall().
    // Он всегда разворачивается по оси Х при ударе о платформу
    if (dy) {
    // Если мы передали в функцию значение dy, то
      this.ball.dy = this.classBall.reverseBall(dy)
      // Разворачиваем мячик по оси Y. Это удар о ребро платформы
    }
    this.classBall.speedМagnifier()
    // Т.к. мячик отбит платформой, запускаем функцию,
    // которая увеличит его скорость
    this.ballReversStatus = false
    // Запрещаем мячику разворачиваться
    setTimeout(() => {
      this.ballReversStatus = true
    }, '500')
    // А через 500 милисекунд разрешаем мячику разворачиваться.
    // Такое поведение нужно, чтоб он не мог застрять в платформе
    // постоянно разворачиваясь
  }  
  defaultSet() {
  // Функция обнуляет положение игрока,
  // так как X в процессе игры не меняется, а вторая координата Y
  // вычисляется из первой, достаточно обнулить только Y
    this.player.y = this.set.playerYDefault
  }
  
  draw() {
    let x = this.player.x
    let yStart = this.player.y
    // Кордината верхней точки игрока
    let yFinish = (this.player.y + this.set.playerHeight)
    // Кордината нижней точки игрока
    const plColor = this.player.color
    const plWidth = (this.set.playerRadius * 2)
    
    this.print.drawPlayer(x, yStart, yFinish, plWidth, plColor)
    // Т.к. игрок это векторная линия с закругленными краями,
    // передаем в принтер кординаты верхней и нижней точки,
    // а также толщину линии (2 радиуса) и цвет
  }
  
  update() {
  // Функция вызывает функции проверки желтой зоны, столкновений,
  // движения игрока и отрисовки. Создана для удобства.
  // Вызывается из метода timeLoop() в классе Game
    this.checkYellowZone()
    this.checkCollisionWithBall()
    this.move()
    this.draw()
  }
  support() {
    const plHeight = this.set.playerHeight
    let x = this.player.x        
    let yS = this.player.y - this.shadowUp
    let yF = this.player.y + this.set.playerHeight + this.shadowDown
    
    this.print.drawShadowPlayer(x, yS, yF)
    //if (this.yellowZone) {
      this.print.drawYellowZone(x, yS, yF)
    //}
  }
}