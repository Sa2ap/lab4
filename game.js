import Setting from './setting.js'
import Player from './player.js'
import Ball from './ball.js'
import Printer from './printer.js'
// В файл подключаем Настройки, Игрока, Мячик и Принтер

class Game {
  constructor() {        
    this.set = new Setting()        
    // Передаем переменной set общие настройки  
          
    this.print = new Printer(this.set)        
    // В Printer передаем настройки       
     
    this.ball = new Ball(this)        
    // В Ball передаем весь класс Game     
       
    this.playerL = new Player(this, this.set.playerL)        
    this.playerR = new Player(this, this.set.playerR)        
    // Создаем два класса Player и передаем туда весь класс Game, 
    // а также отдельно настройки каждого игрока   
         
    this.reqId = true        
    // Переменная "requestId" служит для запуска и остановки анимации.
    // Меняя значение на false, мы сможем останавливать анимацию 
    
    this.firstLaunch()        
    // Инициируем первый запуск игры
  }
   firstLaunch() { 
    this.print.drawBackground()        
    // Рисуем игровое поле    
  
    this.support()        
    // Вспомогательные функции. Вызвав ее здесь, мы увидим
    // 4 возможных направления для полета мячика
  
    this.playerL.draw()        
    this.playerR.draw()        
    // Рисуем игроков
  
    this.print.drawScore()        
    // Рисуем цифры счета, они пока равны 0        
  
    this.print.drawBriefing()        
    // Функция drawBriefing() рисует инструкцию по управлению        
  
    this.ball.dropBall()        
    // dropBall() выбирает рандомное направление для мячика        
  
    this.print.drawBallDirection(4)        
    // drawBallDirection(4) проверяет какое направление для мяча 
    // выбрано и запускает цикл рисования белой полосочки, 
    // бегающей по кругу
  
    this.print.centerText('3')        
    // Рисуем цифру 3. Передаем значение в метод класса Print        
  
    setTimeout(() => {
      this.print.clear('text'),
      this.print.centerText('2') }, '800')
      // Отчищаем слой с цифрой 3 и рисуем цифру 2
      // с помощью встроенной в JS функции setTimeout(),
      // делаем задержку выполнений блока {} кода в 0.8 секунд, 
      // или '800' милисекунд
  
    setTimeout(() => {            
      this.print.clear('text'),            
      this.print.centerText('1') }, '1600')            
      // Каждое следующее действие происходит еще на '800' милисекунд
      // позднее предыдущего        
  
    setTimeout(() => {
      this.print.clear('text'),
      this.print.centerText('Go')}, '2400')
      // Стираем цифру и пишем "Go"
  
    setTimeout(() => {
      this.print.clear('text'),
      this.print.clear('other')
      this.start(this.reqId) }, '3200')
      // На последней функции отчищаем слои и запускаем игру.
      // В функцию start() передаем переменную this.reqId, 
      // значение которой изначально стоит true
    }
     start(reqId) {    
  // Функция запускает анимацию, при условии что переданная
  // переменная равна true        
    if (reqId) {            
      this.reqId = requestAnimationFrame((t) => this.timeLoop(t))
      // Если reqId была true, то метод requestAnimationFrame()
      // вызвает указанную функцию для обновления данных перед
      // следующим перерисовыванием 
    }
  }
  
  timeLoop(t) { 
    this.print.clear('gamelayer')        
    // Отчищаем игровой слой, это нужно чтоб игроки и мяч
    // не оставляли за собой след из предыдущих отрисовок
           
    this.ball.update()        
    this.playerL.update()        
    this.playerR.update()        
    // Функции обновления мячика и игроков, они, в свою очередь, 
    // вызывают все нужные функции внутри своих классов
    
    this.support()        
    // Вспомогательные функции. Вызвав ее здесь, мы увидим
    // границы желтых зон, от которых зависит направление
    // в котором отбивается мячик от платформы
    
    this.start(this.reqId)        
    // Снова вызываем start() вызывая зацикленность анимации.
    // В качестве значения передаем requestId, он содержит
    // метод requestAnimationFrame() и выдаст true
  }
   reStart(align) {
    this.reqId = false        
    // присваиваем reqId значение false, это останавливает анимацию  
        
    setTimeout(() => {        
    // Делаем задержку в 0.8 секунд, и выполняем следующее:
      this.print.clear('gamelayer')            
      // Отчищаем игровой слой            

      this.playerL.defaultSet()            
      this.playerR.defaultSet()            
      this.ball.defaultSet()            
      // Возвращаем игрокам и мячику значения позиций по умолчанию   

      this.playerL.draw()
      this.playerR.draw()
      this.ball.draw()
      // Снова рисуем игроков и мячик, уже в стартовых позициях   

      this.support()            
      // Вспомогательные функции. Вызвав ее здесь, мы увидим
      // 4 возможных направления для полета мячика

      this.ball.dropBall(align)            
      // dropBall() выбирает рандомное направление для мячика 
      // Значение align укажет направление броска в забившего
      // предыдущий гол. Рандомость будет заключатся только в 
      // напрвлении вверх или вниз

      this.print.drawBallDirection()            
      // Функция запускает белый бегунок по направлению,
      // определенному выше в dropBall()

    }, '800')
    setTimeout(() => {
    // Следующие действия произойдут уже через 1.6 секунды
      this.print.clear('other')
      // Отчищаем слой other, это удалит белый бегунок с экрана
      this.reqId = true
      this.start(this.reqId)
      // Снова присваиваем reqId значение true
      // и перезапускаем игровой цикл
      // Эти действия произойдут уже через 1.6 секунды,
      // после предыдущего setTimeout()
    }, '2400')
  }
    support() {  
  // Функция вызывается в firstLaunch(), timeLoop() и reStart() 
  // и запускает отрисовку всех вспомогательных функций
    this.print.clear('support')
    // Отчищает свой слой канваса
    this.playerL.support()
    this.playerR.support()
    // Рисует желтые зоны игроков
    this.print.drawAngleZone()
    // Рисует 4 направления для мяча
  }
}
window.onload = () => {
// Функция создает объект Game после того как все файлы
// будут подгружены браузером  
  const game = new Game()
}