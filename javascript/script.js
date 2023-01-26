const elType = document.getElementById('type');
const elCount = document.getElementById('count');
const elRadius = document.getElementById('radius');
const elRotate = document.getElementById('rotate'); 
const elCanvas = document.getElementById('canvas');


const ctx = elCanvas.getContext('2d');



// Vector2D class
class Vector2D{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    // add
    add(v){
        this.x += v.x;
        this.y += v.y;
    }
    // sub
    sub(v){
        this.x -= v.x;
        this.y -= v.y;
    }
    // mul
    mul(v){
        this.x *= v.x;
        this.y *= v.y;
    }
    // div
    div(v){
        this.x /= v.x;
        this.y /= v.y;
    }
    // mag
    mag(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    // normalize
    normalize(){
        const m = this.mag();
        if(m !== 0){
            this.div(new Vector2D(m, m));
        }
    }
}



class Formation{
    constructor(type, count, radius, rotate){
        this.type = type;
        this.count = count;
        this.radius = radius; 
        this.rotate = rotate;

        this.location = new Array(count);

        this.minRadius = 20;
    }
    // set Type
    setType(type){
        this.type = type;
    }
    // set Count
    setCount(count){
        this.count = count;
    }
    // set Radius
    setRadius(radius){
        this.radius = radius;
    }
    // get Radius
    getRadius(){
        return Math.max(this.radius, this.minRadius);
    }
    // set Rotate
    setRotate(rotate){
        this.rotate = rotate;
    }
    
    // Calculate
    calculate(){
        this.location = new Array(count);
        switch(this.type){
            case 'line':
                this.calculateLine();
                break;
            case 'square':
                this.calculateSquare();
                break;
            case 'deka':
                this.calculateDeka();
                break;
            case 'circle':
                this.calculateCircle();
                break;
            case 'circle_auto':
                this.calculateCircleAuto();
                break;
            case 'triangle':
                this.calculateTriangle();
                break;
        }
    }

    // Calculate Line
    calculateLine(){ 
        let radius = this.getRadius() * 2;
        let totalWidth = radius * this.count; 
        for(let i = 0; i < this.count; i++){
            let location = new Vector2D(
                i * radius - totalWidth / 2 + radius / 2,
                0
            );

            // rotate
            let angle = this.rotate * Math.PI / 180;
            let x = location.x * Math.cos(angle) - location.y * Math.sin(angle);
            let y = location.x * Math.sin(angle) + location.y * Math.cos(angle);
            location.x = x;
            location.y = y;

            this.location[i] = location;
        } 
    }

    // Calculate Square
    calculateSquare(){ 
        let radius = this.getRadius() * 2;
        let maxColumn = Math.floor(Math.sqrt(this.count));
        let maxRow = Math.ceil(this.count / maxColumn);
        let totalWidth = radius * maxColumn;
        let totalHeight = radius * maxRow;
        for(let i = 0; i < this.count; i++){
            let column = i % maxColumn;
            let row = Math.floor(i / maxColumn);
            let location = new Vector2D(
                column * radius - totalWidth / 2 + radius / 2,
                row * radius - totalHeight / 2 + radius / 2
            );

            // rotate
            let angle = this.rotate * Math.PI / 180;
            let x = location.x * Math.cos(angle) - location.y * Math.sin(angle);
            let y = location.x * Math.sin(angle) + location.y * Math.cos(angle);
            location.x = x;
            location.y = y;

            this.location[i] = location;
        }
    }

    // Calculate Deka
    calculateDeka(){
        let radius = this.getRadius() * 2;
        let maxColumn = 10; 
        let row = 0;
        for(let i = 0; i < this.count; i++){
            let remaining = this.count - i;
            let column = Math.min(remaining, maxColumn);
            let totalWidth = radius * column;
            for(let j = 0; j < column; j++){
                let location = new Vector2D(
                    j * radius - totalWidth / 2 + radius / 2,
                    row * radius
                );

                // rotate
                let angle = this.rotate * Math.PI / 180;
                let x = location.x * Math.cos(angle) - location.y * Math.sin(angle);
                let y = location.x * Math.sin(angle) + location.y * Math.cos(angle);
                location.x = x;
                location.y = y;

                this.location[i] = location;
                i++;
            }
            row++; 
            i--; 
        }



    }

    // Calculate Circle
    calculateCircle(){
        let radius = this.getRadius() * 2; 
        if(this.count > 0){
            this.location[0] = new Vector2D(0, 0); 
        }
        let order = 1;
        let i = 1;
        while(i < this.count){
            let circumference = 2 * Math.PI * radius * order;
            let count = Math.floor(circumference / radius);
            let angle = 360 / count;
            for(let j = 0; j < count; j++){
                let location = new Vector2D(
                    radius * order * Math.cos(angle * j * Math.PI / 180),
                    radius * order * Math.sin(angle * j * Math.PI / 180)
                );

                // rotate
                let rotate = this.rotate * Math.PI / 180;
                let x = location.x * Math.cos(rotate) - location.y * Math.sin(rotate);
                let y = location.x * Math.sin(rotate) + location.y * Math.cos(rotate);
                location.x = x;
                location.y = y;

                this.location[i] = location;
                i++;
                if(i >= this.count){
                    break;
                }
            }
            order++;
        }
    }

    // Calculate Circle Auto
    calculateCircleAuto(){
        let radius = this.getRadius() * 2; 
        if(this.count > 0){
            this.location[0] = new Vector2D(0, 0); 
        }
        let order = 1;
        let i = 1;
        while(i < this.count){
            let remaining = this.count - i;
            let circumference = 2 * Math.PI * radius * order;
            let count = Math.floor(circumference / radius);
            if(remaining < count ){
                circumference = remaining * radius;
                count = remaining;
            }
            let angle = 360 / count;
            for(let j = 0; j < count; j++){
                let location = new Vector2D(
                    radius * order * Math.cos(angle * j * Math.PI / 180),
                    radius * order * Math.sin(angle * j * Math.PI / 180)
                );

                // rotate
                let rotate = this.rotate * Math.PI / 180;
                let x = location.x * Math.cos(rotate) - location.y * Math.sin(rotate);
                let y = location.x * Math.sin(rotate) + location.y * Math.cos(rotate);
                location.x = x;
                location.y = y;

                this.location[i] = location;
                i++;
                if(i >= this.count){
                    break;
                }
            }
            order++;
        }
    }

    // Calculate Triangle
    calculateTriangle(){ 
        let radius = this.getRadius() * 2;
        let row = 0;
        let i = 0;
        while(i < this.count){
            let column = row + 1;
            let totalWidth = radius * column;
            let remaining = this.count - i;
            if(remaining < column){
                column = remaining;
                totalWidth = radius * column;
            }
            for(let j = 0; j < column; j++){
                let location = new Vector2D(
                    j * radius - totalWidth / 2 + radius / 2,
                    row * radius
                );

                // rotate
                let angle = this.rotate * Math.PI / 180;
                let x = location.x * Math.cos(angle) - location.y * Math.sin(angle);
                let y = location.x * Math.sin(angle) + location.y * Math.cos(angle);
                location.x = x;
                location.y = y;

                this.location[i] = location;
                i++;
            }
            row++;
        }

    }
}






const formation = new Formation(
    elType.value,
    elCount.value,
    elRadius.value
);
 


const draw = () => {
    const type = elType.value;
    const count = elCount.value;
    const radius = elRadius.value; 
    const rotate = elRotate.value;

    const width = elCanvas.width;
    const height = elCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    formation.setType(type);
    formation.setCount(count);
    formation.setRadius(radius);
    formation.setRotate(rotate);
    formation.calculate();

    // clear canvas
    ctx.clearRect(0, 0, elCanvas.width, elCanvas.height);

    // draw grid lines 10x10
    ctx.beginPath();
    for (let x = 0; x <= width; x += 10) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += 10) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    } 
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.11)';
    ctx.stroke();
    // draw center line
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.stroke();


    // draw circles on formation locations
    for(let i = 0; i < formation.location.length; i++){
        ctx.beginPath();
        if(unitImage && unitImage.complete){
            // draw image on location with 60x60 size and rotate
            ctx.save();
            ctx.translate(
                formation.location[i].x + centerX,
                formation.location[i].y + centerY
            );
            ctx.rotate(rotate * Math.PI / 180);
            ctx.drawImage(
                unitImage,
                -30,
                -30,
                60,
                60
            );
            ctx.restore(); 

        }
        else{
            ctx.arc(
                formation.location[i].x + centerX,
                formation.location[i].y + centerY,
                30,
                0, 
                Math.PI * 2
            );
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
        
    }

};



// on elType change
elType.addEventListener('input', () => {
    draw(); 
    localStorage.setItem('type', elType.value);
});
// load type from localStorage
if(localStorage.getItem('type')){
    elType.value = localStorage.getItem('type');
}

// on elCount change
elCount.addEventListener('input', () => {
    draw(); 
    let elValueSpan = elCount.previousElementSibling.querySelector('span');
    elValueSpan.innerHTML = elCount.value;
}); 

// on elRadius change
elRadius.addEventListener('input', () => {
    draw();
    let elValueSpan = elRadius.previousElementSibling.querySelector('span');
    elValueSpan.innerHTML = elRadius.value;
});

// on elRotate change
elRotate.addEventListener('input', () => {
    draw();
    let elValueSpan = elRotate.previousElementSibling.querySelector('span');
    elValueSpan.innerHTML = elRotate.value + '°';
});


const unitImage = new Image();
unitImage.src = './handgun_idle.png';
unitImage.onload = () => {
    draw();
};


 