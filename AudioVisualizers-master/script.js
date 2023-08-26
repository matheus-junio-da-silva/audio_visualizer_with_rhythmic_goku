const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const file = document.getElementById('fileUpload');
const shape = document.getElementById('visualiserShape');
const barNum = document.getElementById('numberOfBars');
const barsColors = document.getElementById('barsColors');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
//goku
const element = document.getElementById("sprite");
const rhythmicGoku = document.getElementById('rhythmicGoku');

// Customize
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 5;
ctx.shadowBlur = 0;
ctx.shadowColor = 'white';

let audioSource;
let analyser;
let audioCtx;
let bufferLength;
let dataArray;
let barWidth;

const objColors = {
    color1: {
        red: 2,
        green: 4,
        blue: 8,
        hueSbar: 5,
        hueWhirl: 120,
        hueDotG: 250
    },
    color2: {
        red: 8,
        green: 4,
        blue: 2,
        hueSbar: 10,
        hueWhirl: 60,
        hueDotG: 200
    },
    color3: {
        red: 10,
        green: 5,
        blue: 2,
        hueSbar: 15,
        hueWhirl: 180,
        hueDotG: 150
    }
};

barNum.addEventListener('change', function () {
    analyser.fftSize =
        barNum.children[barNum.selectedIndex].getAttribute('value');
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    barWidth = (canvas.width / 2) / bufferLength; // double num bars for drawVDoubleBarVisualiser

});

rhythmicGoku.addEventListener('change', function () {
    rhythmicGokuEnableAndDisable(element, rhythmicGoku);
});

file.addEventListener('change', function () {
    const files = this.files;
    const audio1 = document.getElementById('audio1');
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audioCtx = new window.AudioContext();
    audio1.play();

    audioSource = audioCtx.createMediaElementSource(audio1);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize =
        barNum.children[barNum.selectedIndex].getAttribute('value'); // 64 => 32 bufferLength (32 bars)

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        let selectedColor = objColors[barsColors.value];

        switch (shape.selectedIndex) {
            case 0:
                drawVBarVisualiser(
                    bufferLength,
                    x,
                    barWidth,
                    barHeight,
                    dataArray,
                    selectedColor
                );
                break;
            case 1:
                drawCBarVisualiser(
                    bufferLength,
                    x,
                    barWidth,
                    barHeight,
                    dataArray,
                    selectedColor
                );
                break;
            case 2:
                drawSBarVisualiser(
                    bufferLength,
                    x,
                    barWidth,
                    barHeight,
                    dataArray,
                    selectedColor
                );
                break;
            case 3:
                drawWhirlVisualiser(
                    bufferLength,
                    x,
                    barWidth,
                    barHeight,
                    dataArray,
                    selectedColor
                );
                break;
            case 4:
                drawDotGVisualiser(
                    bufferLength,
                    x,
                    barWidth,
                    barHeight,
                    dataArray,
                    selectedColor
                );
                break;
            case 5:
                let barWidthDouble = (canvas.width / 2) / bufferLength;
                drawVDoubleBarVisualiser(
                    bufferLength,
                    x,
                    barWidthDouble,
                    barHeight,
                    dataArray,
                    selectedColor
                );
                break;
            default:
                drawVBarVisualiser(
                    bufferLength,
                    x,
                    barWidth,
                    barHeight,
                    dataArray,
                    selectedColor
                );
                break;
        }

        requestAnimationFrame(animate);
    }
    animate();
});
function toggleAnimation(maxBarHeight, barHeight, element) {
    // max value is 510
    if (barHeight == 400) {
        if (!element.classList.contains("powerup")) {
            element.classList.add("powerup");
            //change duration according to animation duration
            setTimeout(function () {
                element.classList.remove("powerup");
            }, 200);
        }
        
    }
}
function rhythmicGokuEnableAndDisable(element, rhythmicGoku) {
    if (rhythmicGoku.value == "none-goku") {
        if (element.classList.contains("gokuBlock")) {
            element.classList.remove("gokuBlock");
        }
        element.classList.add("gokuNone");
    }

    if (rhythmicGoku.value == "rhythmic-goku") {
        if (element.classList.contains("gokuNone")) {
            element.classList.remove("gokuNone");
        }
        element.classList.add("gokuBlock");
    }
}
let maxBarHeight = 0; // goku animation 
function drawVBarVisualiser(bufferLength, x, barWidth, barHeight, dataArray, colorObj) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2;
        const red = (i * barHeight) / colorObj.red;
        const green = i * colorObj.green;
        const blue = barHeight / colorObj.blue;
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;

        if (barHeight > maxBarHeight) { maxBarHeight = barHeight; }
        toggleAnimation(maxBarHeight, barHeight, element);
    }
}

function drawCBarVisualiser(bufferLength, x, barWidth, barHeight, dataArray, colorObj) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i + (Math.PI * 2) / bufferLength);
        const red = (i * barHeight) / colorObj.red;
        const green = i * colorObj.green;
        const blue = barHeight / colorObj.blue;
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(0, 0, barWidth, (barHeight * 2) / 3);
        x += barWidth;
        ctx.restore();

        if (barHeight > maxBarHeight) { maxBarHeight = barHeight; }
        toggleAnimation(maxBarHeight, barHeight, element);
    }
}

function drawSBarVisualiser(bufferLength, x, barWidth, barHeight, dataArray, colorObj) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((i * (Math.PI * 6)) / bufferLength);
        const hue = i * colorObj.hueSbar;
        ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
        ctx.fillRect(0, 0, barWidth, (barHeight * 2) / 3);
        x += barWidth;
        ctx.restore();

        if (barHeight > maxBarHeight) { maxBarHeight = barHeight; }
        toggleAnimation(maxBarHeight, barHeight, element);
    }
}

function drawWhirlVisualiser(bufferLength, x, barWidth, barHeight, dataArray, colorObj) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2.5;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * 4.184);
        const hue = colorObj.hueWhirl + i * 0.05;
        ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
        ctx.beginPath();
        ctx.arc(10, barHeight / 2, barHeight / 2, 0, Math.PI / 4);
        ctx.fill();
        ctx.stroke();
        x += barWidth;
        ctx.restore();

        if (barHeight > maxBarHeight) { maxBarHeight = barHeight; }
        toggleAnimation(maxBarHeight, barHeight, element);
    }
}

function drawDotGVisualiser(bufferLength, x, barWidth, barHeight, dataArray, colorObj) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.4;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * bufferLength * -4.0003);
        const hue = colorObj.hueDotG + i * 2;
        ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
        ctx.beginPath();
        ctx.arc(0, barHeight, barHeight / 10, 0, Math.PI * 2);
        ctx.arc(0, barHeight / 1.5, barHeight / 20, 0, Math.PI * 2);
        ctx.arc(0, barHeight / 2, barHeight / 30, 0, Math.PI * 2);
        ctx.arc(0, barHeight / 3, barHeight / 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        x += barWidth;
        ctx.restore();

        if (barHeight > maxBarHeight) { maxBarHeight = barHeight; }
        toggleAnimation(maxBarHeight, barHeight, element);
    }
}

function drawVDoubleBarVisualiser(bufferLength, x, barWidth, barHeight, dataArray, colorObj) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2;
        const red = (i * barHeight) / colorObj.red;
        const green = i * colorObj.green;
        const blue = barHeight / colorObj.blue;
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(canvas.width/2 - x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;

        if (barHeight > maxBarHeight) { maxBarHeight = barHeight; }
        toggleAnimation(maxBarHeight, barHeight, element);
    }

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2;
        const red = (i * barHeight) / colorObj.red;
        const green = i * colorObj.green;
        const blue = barHeight / colorObj.blue;
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
}
