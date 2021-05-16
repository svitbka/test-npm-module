var mapDataString = [];
var canvas = new Heatmapfromdata('canvas');
var X = 0;

document.getElementById('switchpallette').addEventListener('click', function() {
    var pallette = document.getElementById('wrap__pallette');

    if (pallette.hidden === false) {
        pallette.hidden = true;
    } else {
        document.getElementById('pallette').style.cssText = 'display: flex;';
        pallette.hidden = false;
    }
});

document.getElementById('pallette').querySelectorAll('li').forEach(e => {
    e.addEventListener('click', () => {
        var color = document.getElementById('user__pallette');
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

document.getElementById('button__reset').addEventListener('click', () => {
   document.getElementById('user__pallette').querySelectorAll('li').forEach((e) => {
        e.remove();
    });
});

document.getElementById('button__save').addEventListener('click', () => {
    var pallette = document.getElementById('wrap__pallette');
    pallette.hidden = true;
});

document.getElementById('button__draw').addEventListener('click', () => {
    var colors = "";
    
    document.getElementById('user__pallette').querySelectorAll('li').forEach((e) => {
        colors += e.dataset.value;
    });

   document.getElementById("button__draw").style.cssText = `list-style: none;`;
    
    var dataColors = canvas.parseColors(colors),
        gradientData = canvas.linearInterpolation(dataColors);

    canvas.gradient(gradientData);

    drawFrame.call(canvas);

});

document.getElementById('button__select__file').addEventListener('change', () => {
    
    VAL = 0;
    for(var i = 0; i < document.querySelector("input[type=file]").files.length; i++) {
        var reader = new FileReader();
         
        var file = document.querySelector('input[type=file]').files[i];

        reader.readAsText(file);
        
        reader.onload = function(e) {
            mapDataString.push(e.target.result); 
            VAL++; 
           if (VAL == document.querySelector("input[type=file]").files.length) {
                X = (canvas._sizeColors - 1) / dataNormalization(parseDataFromFile(mapDataString[document.querySelector("input[type=file]").files.length - 1]));
                
               document.getElementById("button__draw").style.cssText = `background: green;`;
            }
        }
    }
});

var i = 0;
function drawFrame() {
    
    this._flagDrawFrame = true;

    data = parseDataFromFile(mapDataString[i]);

    this.data(data);

    this.draw(X);

    if (i < document.querySelector("input[type=file]").files.length - 1) {
        i++;
        setTimeout("drawFrame.call(canvas)", 20);
    }
};