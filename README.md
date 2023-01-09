# lab4
pin pong game

Разработка приложения реального времени 
------

## Задача
Разработать и реализовать игру пин-понг. Хранение и обработка модели происходит на сервере . Общение сервера и клиента происходит по websocket. Для отрисовки вида используеться canvas. игра завершаеться по достижении нужного счета одним из игроков 
#### Реализовать возможности системы:
 -  Автоматическое удаление старых сообщений 
 -  Автоматическое удаление каналов 
 
## Ход работы

### 1. Разработка пользовательского интерфейса

Вид игрового окна  :

<p align = "center"><img src="https://github.com/Sa2ap/lab4/blob/main/pongOG.png"/width = 100%></p>



### 2. Описание пользовательских сценариев работы
На сайте доступны следующие возможности:

- Игра в пин-понг 


1) После захода пользователем на сайт начитаеться анимированный отсчет с 3 до 1 и игра начинаеться  .

2) Пользователь 1 управляет с помощью клавиш W и S пользователь 2 управляет стрелочками .

3) Сверху счетчик забитых мячей . 

4) При игре мяч случайно выбирает 1 из 4 направлений полета . 



# Значимые Фрагменты кода 
 _______________________
  Код CSS
 ```sh 
  body {
  margin: 0px;    
  height: 100vh;    
  width: 100vw;    
  display: flex;    
  justify-content: center;    
  align-items: center;    
  background-color: #232323;    
}

#game canvas {  
  display: block;    
  position: absolute;
}
```
Код game.ls
```sh
import Setting from './setting.js'
import Player from './player.js'
import Ball from './ball.js'
import Printer from './printer.js'
class Game {
  constructor() {        
    this.set = new Setting()             
    this.print = new Printer(this.set)             
    this.ball = new Ball(this)        
    this.playerL = new Player(this, this.set.playerL)        
    this.playerR = new Player(this, this.set.playerR)                
    this.reqId = true        
    this.firstLaunch()        
  }
   firstLaunch() { 
    this.print.drawBackground()            
    this.support()        
    this.playerL.draw()        
    this.playerR.draw()        
    this.print.drawScore()            
    this.print.drawBriefing()        
    this.ball.dropBall()        
    this.print.drawBallDirection(4)        
    this.print.centerText('3')        
      
```

Код index.php
```sh
this.print = Game.print

    this.player = playerSet

    this.keyMap = new Map(playerSet.keys)

    document.addEventListener('keydown',
                             (e) => this.keyController(e, true))
    document.addEventListener('keyup',
                             (e) => this.keyController(e, false))
    this.shadowUp = 0
    this.shadowDown = 0

    this.yellowZone = true

    this.ballReversStatus = true

  }
  keyController(e, state) {
    if(this.keyMap.has(e.keyCode)) {

      this[this.keyMap.get(e.keyCode)] = state

    }
  }
  
  move() {
    const plHeight = this.set.playerHeight
    const plSpeed = this.set.playerSpeed
    const plBorder = this.set.playerBorder
    const boxHeight = this.set.boxHeight

    if (this.up) {
      if (this.player.y > plBorder) {

        this.player.y -= plSpeed

      } else {

        this.player.y = plBorder
 
      }
      this.shadowUp = (plSpeed * 2)

    }
```
