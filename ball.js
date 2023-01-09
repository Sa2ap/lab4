export default class Ball {
  constructor(Game) {  
  // При создании в Ball мы передали в него весь класс Game        
    this.game = Game
    // Через game мы будем получать доступ в методу reStart()
    
    this.set = Game.set
    // Передаем переменной set общие настройки
    
    this.ball = Game.set.ball
    // Для удобства, сразу выделим в отдельную переменную ball,
    // настройки мячика которые изменяюся по ходу игры
    
    this.print = Game.print        
    // Для доступа к модулю Printer    
  }
    getRandom() {       
    return Math.random() * (1 - 0.8) + 0.8        
    // Метод Math.random() генерирует случайное положительное        
    // значение в диапазоне от 0 до <1,       
    // а формула Math.random() * (max - min) + min позволяет         
    // получить рандомное число в нужном диапазоне от min до max    
  }
  
  getRandomDirection() {          
    if (Boolean(Math.round(Math.random()))) {        
    // Math.random() генерирует случайное значение        
    // Math.round() округляет это значение до целого 0 или 1        
    // Boolean() возвращает 0 как false, а 1 как true            
      return this.getRandom()            
      // Если Boolean() вернул true, возвращаем случайное число   
      // в нужном нам диапазоне функцией getRandom()        
    } else { return -this.getRandom() }        
    // Если Boolean() вернул false, то возвращаем тоже самое,   
    // но со знаком "минус"    
  }
   dropBall(player) {        
  // Функция принимаем значение align от игрока,
  // это дает нам понять какой игрок забил гол в прошлом матче
    this.ball.dx = this.getRandomDirection()  
    this.ball.dy = this.getRandomDirection()        
    // С помощью getRandomDirection() мы генерируем        
    // рандомное ускорение с рандомным знаком + или -            
    switch (player) {        
    // Если значение left, то подает левый игрок,        
    // значит мячик должен лететь вправо.        
    // Но так как мы не знаем какое значение нагенерировано,        
    // приминяем следующее:            
      case 'left':                
        this.ball.dx = Math.abs(this.ball.dx)                
        // Чтоб исключить возможность полета влево                
        // Используем метод Math.abs(), который возвращает    
        // положительно значение
        // Присваеваем dx его же, но точно положительный       
        break            
      case 'right':                
        this.ball.dx = -Math.abs(this.ball.dx)                
        // Для полета влево мы также применяем Math.abs(),  
        // но после превращения значения в положительное,       
        // делаем его отрицательным с помощью -                
        break        
    }        
    // Если значение player не было передано, т.е оно undefined, 
    // то ничего не меняется и все значения останутся            
    // полностью случайны, такое случается на первом старте игры    
  }
  
  move() {
  // Двигает мяч в пространсте прибавляя сгенерированные ранее
  // значения к его координатам, умножая на коэффециент скорости
  // который мы задали в настройках мячика как speed
    this.ball.x += (this.ball.dx * this.ball.speed)        
    this.ball.y += (this.ball.dy * this.ball.speed)        
    // Оператор += сначала складывает исходное значение (это х)
    // и расчетное значение (результат умножения),
    // а потом присваивает полученное значение переменной х
  }
   checkCollisionWithWalls() {  
    let ballX = (this.ball.x + this.ball.dx)   
    let ballY = (this.ball.y + this.ball.dy)    
    // В данном случае ballX и ballY это координаты мяча в будующем,
    // которые будут на следующем кадре, но без учета скорости
    const rightWall = (this.set.boxWidth - this.set.ballRadius)    
    // Координата Х правой стены (ширина поля) минус размер 
    // радиуса мяча, чтоб при столкновении мяч не утопал в стену   
    const leftWall = this.set.ballRadius
    // Координата Х левой стены (это 0) плюс размер радиуса мяча.    
    // Просто отступ от края размером с половинку мячика    
    const TopWall = this.set.ballRadius    
    // Координата Y верхней стены (также 0),
    // Просто берем радиус мячика
    const BottomWall = (this.set.boxHeight - this.set.ballRadius)    
    // Координата Y нижней стены (высота поля) минус радиус
      
      if (ballX >= rightWall) {        
      // Если координаты мячика стали больше координат правой стены,
      // то:            
        this.ball.dx = this.reverseBall(this.ball.dx)            
        // Меняем направление по оси Х с помощью функции reverseBall()
        this.goalProcess(this.set.playerL)            
        // Вызываем функцию goalProcess() которая завершает матч
        }        
      if (ballX <= leftWall) {        
      // Если координаты мячика стали меньше координат левой стены,
      // то:           
        this.ball.dx = this.reverseBall(this.ball.dx)            
        this.goalProcess(this.set.playerR)        
      }        
      if (ballY >= BottomWall || ballY <= TopWall) {        
      // Если мячик коснулся верхней или нижней стенки, то:      
        this.ball.dy = this.reverseBall(this.ball.dy)            
        // Разворачиваем мяч по оси Y        
      }
    }
      reverseBall(dir) {    
  // В функцию передается значение ускорения dx или dy
    if (dir > 0) {        
    // Если значение ускорения положительное, то
      return -this.getRandom()           
      // Возвращаем новое рандомное значение для ускорения
      // со знаком минус, т.е. отрицательное
    } else {
    // Если значение ускорения отрицательное, то
      return this.getRandom()            
      // Также возвращаем новое рандомное значение,
      // но уже положительное       
    }
  }
   goalProcess(winner) {
  // Запускает процесс завершения матча после гола.
  // Сюда передается align игрока, который забил мяч
    winner.score++
    this.print.clear('score')
    this.print.drawScore()
    // Прибавляем к счету забившего +1 очко,
    // отчищаем старый счет со слоя 'score' и рисуем новый счет
    this.print.clear('text')
    // Отчищаем слой 'text', чтоб удалить с центра поля
    // счетчик количества отбитий мяча в матче
    this.set.ballHitScore = 0
    // Обнуляем счетчик отбитий, чтоб в следующем матче
    // он пошел с нуля
    this.print.drawGoal(winner.goalPointX, winner.color, winner.align)
    // Вызываем функцию рисования Гола, она просто пишет
    // в центре надпись "Goal!" и рисует "+1" на поле соперника
    this.game.reStart(winner.align)
    // Вызываем метод reStart() класса Game, он остановит анимацию,
    // обнулит положение всех элементов и нарисует их заного
  }
   speedМagnifier() {  
  // Увеличивает скорость мяча на 0.1    
  // и прибавляет 1 к счетчику ударов мяча о платформу.    
  // Отчищает слой 'text' и рисует заного        
    this.ball.speed += 0.1        
    // Оператор += сначало прибавляет 0.1,        
    //а потом присваивает полученное значение        
    this.set.ballHitScore++        
    // Оператор ++ прибавляет к значению 1 к счетчику ударов
    this.print.clear('text')        
    this.print.drawBallHit()        
    // Отчищает слой 'text' и рисует новое значение счетчика
    // на игровом поле
  }
   defaultSet() {
    this.ball.x = this.set.ballXDefault
    this.ball.y = this.set.ballYDefault
    // Ставит мячик на центр поля обнуляя координаты
    this.ball.speed = this.set.ballSpeed
    // Возвращает исходную скорость
  }
  
  draw() {
  // Функция отправляет запрос на отрисовку мячика.
  // Создана для удобства
    this.print.drawBall()    
  }
  
  update() {    
  // Функция вызывает функции проверки столкновений,
  // движения мячика и отрисовки. Создана для удобства,
  // вызывается из метода timeLoop() в классе Game
  this.checkCollisionWithWalls()
  this.move()
  this.draw()
  }
}