const WIDTH = 800
const HEIGHT = 600
const spriteWidth = 25
const spriteHeight = 25
const img = new Image()
const world = document.getElementById('world')
const sprite = document.createElement('div')
const sprites = []
const gravitySpeed = 1
const numberOfPaticles = 40
prevTimestamp = Date.now()
let delta = 0
img.src = './sprite.svg'
world.style.width = `${WIDTH}px`
world.style.height = `${HEIGHT}px`
world.style.background = '#eee'



/*
TODO: make this more dry

TODO: make it look more like a firework

TODO: Make sprites fade with time

? Maybe make it so that the curser sprite does not leave world example: (if e.pageX > WIDTH ){sprite.style.left = e.pageX - (e.pageX - WIDTH)}
*/


img.onload = () => {
  sprite.style.height = `${spriteHeight}px`
  sprite.style.width = `${spriteWidth}px`
  sprite.style.border = '1px solid #000'
  sprite.style.backgroundImage = `url(${img.src})`
  // sprite.style.backgroundPosition = '18px 20px'
  sprite.style.backgroundSize = `${spriteWidth}px ${spriteHeight}px`
  sprite.style.position = 'absolute'
  world.appendChild(sprite)
}

function handleMouseMove(e) {
  sprite.style.left = e.pageX - (spriteWidth / 2) + 'px'
  sprite.style.top = e.pageY - (spriteHeight / 2) + 'px'
}
function createParticle(x, y) {
  // create particle
  let particle = document.createElement('div')
  const newSpriteWidth = 10
  const newSpriteHeight = 10

  particle.style.border = '1px solid #000'
  particle.style.backgroundImage = `url(${img.src})`
  particle.style.height = `${newSpriteHeight}px`
  particle.style.width = `${newSpriteWidth}px`
  particle.style.backgroundSize = `${newSpriteWidth}px ${newSpriteHeight}px`
  particle.style.position = 'absolute'

  particle.style.left = x - (newSpriteWidth / 2) + 'px'
  particle.style.top = y - (newSpriteHeight / 2) + 'px'
  particle.dataset.velocity = 500 + (Math.random() * 500)
  particle.dataset.angle = Math.random() * 360 // make random, and change over time
  sprites.push(particle)
  world.appendChild(particle)
}
async function handleMouseDown(e) {
  for (let i = 0; i < numberOfPaticles; i++) {
    createParticle(e.pageX, e.pageY)
  }
}

function applyGravity(el) {
  const top = Number(el.style.top.slice(0, el.style.top.length - 2)) // get just the numbers
  const left = Number(el.style.left.slice(0, el.style.left.length - 2)) // get just the numbers
  const straightDown = 90
  let an = Number(el.dataset.angle)
  const deltaTime = delta / 4
  if (an < 270 && an > 90) {
    an - (gravitySpeed * deltaTime) > 90
      ? el.dataset.angle = an - (gravitySpeed * deltaTime)
      : el.dataset.angle = straightDown
  }
  else if (an > 270 || (an >= 0 && an < 90)) {
    let newNum = Number(el.dataset.angle) + (gravitySpeed * deltaTime)
    if (newNum > 360) {
      newNum -= 360
    }
    an + (gravitySpeed * deltaTime)
      ? el.dataset.angle = newNum
      : el.dataset.angle = straightDown
  }
  else {
    el.dataset.angle = straightDown
  }
  
  el.style.top = `${top + Number(el.dataset.velocity) * (delta / 1000) * Math.sin(toRadians(Number(el.dataset.angle)))}px`
  el.style.left = `${left + Number(el.dataset.velocity) * (delta / 1000) * Math.cos(toRadians(Number(el.dataset.angle)))}px`
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180; // radians
}

function removeOutOfBounds(el) {
  // do this looping through sprites[]
  const top = el.style.top.slice(0, el.style.top.length - 2)
  const left = el.style.left.slice(0, el.style.left.length - 2)
  if (Number(top) > HEIGHT || Number(left) > WIDTH) {
    world.removeChild(el)
    return -1
  }
  return 0
}

document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mousedown', handleMouseDown)

function animateParticles() {
  sprites.forEach((el, i) => {
    if (removeOutOfBounds(el) === 0) {
      const vel = Number(el.dataset.velocity) 
      if (vel > gravitySpeed) {
        el.dataset.velocity = Number(el.dataset.velocity) - (gravitySpeed * (delta / 100))
      }
      else if (vel < gravitySpeed) {
        el.dataset.velocity = Number(el.dataset.velocity) + (gravitySpeed * (delta / 100))
      }
      else {
        el.dataset.velocity = gravitySpeed
      }
      applyGravity(el)
    }
    else {
      // remove the element from the array
      sprites.splice(i, 1)
    }
  })
}

function loop() {
  // animate particles
  delta = (Date.now() - prevTimestamp)
  prevTimestamp = Date.now()
  animateParticles()
  requestAnimationFrame(loop)
}
loop()