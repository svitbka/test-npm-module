var mapDataString = [];
var canvasAnim = new heatmapfromdata('animation');
var Xanimation = 0;


var canvasPict = new heatmapfromdata('canvas');
var Xpict = 0;
var dataPict = "";




function dataNormalization(matrix) {
    let maxElem = 0.0;
    for(let i = 0; i < matrix.length - 1; i++) {
        for(let j = 0; j < matrix.length - 1; j++) {
            maxElem = Math.max(Math.abs(matrix[i][j]), Math.abs(maxElem));
        }
    }

    return maxElem;
};


function parseDataFromFile(data) {
    return data.split("\n").map(e => {
        return e.trim().slice(0).split(",").map(e => +e);
    });
};

document.getElementById('switchpallette').addEventListener('click', function() {
    var pallette = document.getElementById('wrap_pallette');

    if (pallette.hidden === false) {
        pallette.hidden = true;
    } else {
        document.getElementById('pallette').style.cssText = 'display: flex;';
        pallette.hidden = false;
    }
});


document.getElementById('pallette').querySelectorAll('li').forEach(e => {
    e.addEventListener('click', () => {
        var color = document.getElementById('user_pallette');
        var a = e.cloneNode(true);
        a.style.cssText = `list-style: none;`;

        var flag = true;
        color.querySelectorAll('li').forEach(el => {
            if (a.getAttribute('id') === el.getAttribute('id')) {
                flag = false;
            }
        })

        if (flag) {
            color.append(a);
        }

    });
});


document.getElementById('button_reset').addEventListener('click', () => {
   document.getElementById('user_pallette').querySelectorAll('li').forEach((e) => {
        e.remove();
    });
});


document.getElementById('button_save').addEventListener('click', () => {
    var pallette = document.getElementById('wrap_pallette');
    pallette.hidden = true;
});

// для картинки //////////////////////////////////////////////////////

document.getElementById('button_draw').addEventListener('click', () => {
    var colors = "";
    
    document.getElementById('user_pallette').querySelectorAll('li').forEach((e) => {
        colors += e.dataset.value;
    });

   document.getElementById("button_draw").style.cssText = `list-style: none;`;
    
    var dataColors = canvasPict.parseColors(colors),
        gradientData = canvasPict.linearInterpolation(dataColors);

    canvasPict.gradient(gradientData);

    var data = parseDataFromFile(dataPict);
    Xpict = (canvasAnim._sizeColors - 1) / dataNormalization(data);

    canvasPict.data(data);
    canvasPict.draw(Xpict);

});


document.getElementById('button_file').addEventListener('change', () => {
    var el = document.getElementById('buttons_pict');
    VAL = 0;
    
    for(var i = 0; i < el.querySelector("input[type=file]").files.length; i++) {
        var reader = new FileReader();
         
        var file = el.querySelector('input[type=file]').files[i];

        reader.readAsText(file);
        
        reader.onload = function(e) {
            dataPict = e.target.result;
        
            document.getElementById("button_draw").style.cssText = `background: green;`;
        }
    }
});


// для анимации //////////////////////////////////////////////////////

document.getElementById('button_animation').addEventListener('click', () => {
    var colors = "";
    
    document.getElementById('user_pallette').querySelectorAll('li').forEach((e) => {
        colors += e.dataset.value;
    });

   document.getElementById("button_animation").style.cssText = `list-style: none;`;
    
    var dataColors = canvasAnim.parseColors(colors),
        gradientData = canvasAnim.linearInterpolation(dataColors);

    canvasAnim.gradient(gradientData);

    drawFrame.call(canvasAnim);

});


document.getElementById('button_folder').addEventListener('change', () => {
    var el = document.getElementById('buttons_anim');
    VAL = 0;
    
    for(var i = 0; i < el.querySelector("input[type=file]").files.length; i++) {
        var reader = new FileReader();
         
        var file = el.querySelector('input[type=file]').files[i];

        reader.readAsText(file);
        
        reader.onload = function(e) {
            mapDataString.push(e.target.result); 
            VAL++; 
           if (VAL == el.querySelector("input[type=file]").files.length) {
                Xanimation = (canvasAnim._sizeColors - 1) / dataNormalization(parseDataFromFile(mapDataString[el.querySelector("input[type=file]").files.length - 1]));
                
               document.getElementById("button_animation").style.cssText = `background: green;`;
            }
        }
    }
});


var i = 0;
function drawFrame() {
    var el = document.getElementById('buttons_anim');
    this._flagDrawFrame = true;

    data = parseDataFromFile(mapDataString[i]);
    console.log("data: ", data);

    this.data(data);

    this.draw(X);

    if (i < el.querySelector("input[type=file]").files.length - 1) {
        i++;
        setTimeout("drawFrame.call(canvasAnim)", 20);
    }
};