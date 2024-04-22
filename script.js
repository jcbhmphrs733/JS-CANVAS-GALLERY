let canvas;
let ctx;
let flowField;
let flowFieldAnimation;

window.onload = function(){
    canvas = document.getElementById('canvas1');
    ctx = canvas.getContext('2d');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    flowField = new FlowFieldEffect(ctx, canvas.height, canvas.width)
    flowField.animate(0);
}

window.addEventListener('resize', function(){
    if (flowFieldAnimation) {
        this.cancelAnimationFrame(flowFieldAnimation);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(ctx, canvas.height, canvas.width);
    flowField.animate(0);
});

const mouse = {
    x: 0,
    y: 0,
}

window.addEventListener('mousemove', function(e){
    mouse.x = e.x;
    mouse.y = e.y;
});

class FlowFieldEffect {
    #ctx;
    #height;
    #width;
    constructor(ctx, height, width){
        this.#ctx = ctx;
        this.#height = height;
        this.#width = width;
        //
        this.lastTime = 0;
        this.interval = 1000/60;
        this.timer = 0;
        this.gradient;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient;
        
        this.#ctx.lineWidth = 2  // line thickness   
        this.lineLengthX = 80;    // line x length
        this.lineLengthY = 80;    //line y length
        this.xScale = .008;          //x scale
        this.yScale = .008;          //y scale
        this.cellSize = 17;        //  (line population)
        this.radius = -4;         //ring density  (time on timeline)
        this.vr = 0.02       //(rate of time passing)
        this.duration = 8;    //loop duration (time window)
    }
    #createGradient(){
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop("0.1","#75DBCD");
        this.gradient.addColorStop("0.3","#C9DBBA");
        this.gradient.addColorStop("0.5","#DCDBA8");
        this.gradient.addColorStop("0.7","#F5CDA7");
        this.gradient.addColorStop("0.9","#FAA381");
    }
    
    #drawLine(angle, x, y){
        this.#ctx.beginPath();
        this.#ctx.moveTo(x,y);
        
        this.#ctx.lineTo(x + Math.sin(angle) * this.lineLengthX, y + Math.cos(angle) * this.lineLengthY);
        
        this.#ctx.stroke();
    }
    
    animate(timeStamp){
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));

        if (this.timer > this.interval) {

            this.#ctx.clearRect(0,0,this.#width, this.#height)
            this.radius += this.vr;

            // this.radius -= ((mouse.x - this.#width/2) * (mouse.y - this.#height/2))*.000005;

            if(this.radius > this.duration || this.radius < -this.duration) this.vr *= -1;

            for(let y = this.cellSize * 10; y < this.#height - this.cellSize*10; y += this.cellSize) {
                for(let x = this.cellSize * 10; x < this.#width-this.cellSize*10; x += this.cellSize) {
                    const angle = (Math.cos(x * this.xScale) + Math.sin(y * this.yScale)) * this.radius;
                    this.#drawLine(angle, x, y);
                }
            }
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }
    }
}