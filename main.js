console.log(gsap)

const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

const scoreDisplay = document.querySelector("#score");

const startButton = document.querySelector("#startGame");

const endDisplay = document.querySelector(".container");

const endScore = document.querySelector(".scoreNum")

canvas.width = innerWidth

canvas.height = innerHeight


//player class
class Player{
    constructor(x,y,radius,color){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    Draw(){
        c.beginPath()
        c.arc(this.x,this.y, this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
    }
}

//projectile class
class Projectile{
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    Draw(){
        c.beginPath()
        c.arc(this.x,this.y, this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
    }

    //adds velocity onto a projectile 
    Update(){
        this.Draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}


class Enemy{
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    Draw(){
        c.beginPath()
        c.arc(this.x,this.y, this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
    }

    //adds velocity onto a projectile 
    Update(){
        this.Draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}
let projectiles = []

let enemies = []

let x = canvas.width/2

let y = canvas.height/2

let player = new Player(x, y , 10, "white")

function init(){

    player = new Player(x, y , 10, "white")

    projectiles = []

    enemies = []

    score = 0

    scoreDisplay.innerHTML = score

}


function SpawnEnemies(){
    setInterval(() => {

        const radius =Math.random() * (30-4) + 7

        const color = "#00fff2";

        let x

        let y

        //code for random enemy x and y variables 
        // uses the ? operator for random decisions 
        if(Math.random() < 0.5){

            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;

            y = Math.random() * canvas.height;

        }else{

            x = Math.random() * canvas.width
            
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;

        }

        const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x)

        const velocity = {

            x: Math.cos(angle),

            y: Math.sin(angle)
        }


        enemies.push(new Enemy(x,y,radius,color,velocity))
    },1000)
}

let animationId;

let score = 0;

function Animate(){
    //draws background
    animationId = requestAnimationFrame(Animate)

    c.fillStyle = "rgba(0,0,0,0.2)"

    c.fillRect(0,0, canvas.width,canvas.height)

    player.Draw()

    //loops through projectile array
    projectiles.forEach((p,index) => {
        p.Update()

        //gets rid off projectiles off screen
        if(p.x + p.radius < 0 ||

             p.x - p.radius > canvas.width ||

             p.y + p.radius < 0 ||

             p.y - p.radius > canvas.height ){

            setTimeout(() => {

                projectiles.splice(index,1)

            },0)
        }
    })

    enemies.forEach((e,eindex) => {
        e.Update()

        //checks if player has been hit 
        const dist = Math.hypot(player.x - e.x, player.y - e.y)

        if(dist - e.radius - player.radius < 1){
            cancelAnimationFrame(animationId)
            startButton.innerHTML = "Retry"
            endDisplay.style.display = "flex"
            endScore.innerHTML = score
        }

        projectiles.forEach((p,pindex) => {
            const dist = Math.hypot(p.x - e.x, p.y - e.y)

            //projectiles touch enemy
            if(dist - e.radius - p.radius < 1){

                

                //shrinks enemy
                if(e.radius - 10 > 5){

                    //increase score
                    score += 100;
                    scoreDisplay.innerHTML = score

                    gsap.to(e, {
                        radius: e.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(pindex,1)
                    },0)

                //removes enemy
                }else{

                    score += 200;

                    scoreDisplay.innerHTML = score

                    setTimeout(() => {

                        enemies.splice(eindex,1)

                        projectiles.splice(pindex,1)
                    },0)
                }
            }
        })
    })
}



//On click assing a projectile to a projectile array
//Instanstiates a new projectil object 
addEventListener("click", (e) =>{
    //Getting angle
    const angle = Math.atan2(e.clientY - y,e.clientX - x)

    const velocity = {

        x: Math.cos(angle)*5,

        y: Math.sin(angle)*5
    }

    projectiles.push(new Projectile(x,y,5,"white",{

        x: velocity.x,

        y: velocity.y

    }))
} )

//button startgame
startButton.addEventListener("click", () => {

    init()

    SpawnEnemies()

    Animate()

    endDisplay.style.display = "none"

})

