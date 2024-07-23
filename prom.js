function translate_coords(x, y, scale, w, h) {
    var x_mod = (x * scale) + ((w - (1280 * scale)) / 2);
    var y_mod = (y * scale) + ((h - (1024 * scale)) / 2);
    return [x_mod, y_mod];
};

function retranslate_coords(x_mod, y_mod, scale, w, h) {
    var x = (x_mod / scale) - (((w - (1280 * scale)) / 2) / scale);
    var y = (y_mod / scale) - (((h - (1024 * scale)) / 2) / scale);
    return [x, y];
};

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        };
    };
};

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min
}; 

function isInRect(x, y, rect_x, rect_y, rect_width, rect_height) {
    return (rect_x <= x) && (rect_x + rect_width >= x) &&
           (rect_y <= y) && (rect_y + rect_height >= y);
};

function prom(canvas, ctx) {
    var w = canvas.width; var h = canvas.height;
    var scale_h = w / 1280;
    var scale_v = h / 1024;
    var scale = Math.min(scale_v, scale_h);

    var splash_img = new Image();
    splash_img.src = "indigo.png";
    splash_img.onload = function(){
        var t = translate_coords(0,0,scale,w,h);
        ctx.drawImage(splash_img,0,0,splash_img.width,splash_img.height,t[0],t[1],splash_img.width*scale,splash_img.height*scale);
    };
};

window.onload = function() {
    var canvas = document.getElementById("mycanvas");
    canvas.width = window.innerWidth - 8; var w = canvas.width;
    canvas.height = window.innerHeight - 20; var h = canvas.height;
    var ctx = canvas.getContext("2d");
    var scale_h = w / 1280;
    var scale_v = h / 1024;
    var scale = Math.min(scale_v, scale_h);

    var splash_img = new Image();
    splash_img.src = "indigo.png";
    splash_img.onload = function(){
        var t = translate_coords(0,0,scale,w,h);
        ctx.drawImage(splash_img,0,0,splash_img.width,splash_img.height,t[0],t[1],splash_img.width*scale,splash_img.height*scale);
    };

    setTimeout(function(){
        var start_img = new Image();
        start_img.src = "start_frame.png";
        start_img.onload = function(){
            var t = translate_coords(433,280,scale,w,h);
            ctx.drawImage(start_img,0,0,start_img.width,start_img.height,t[0],t[1],start_img.width*scale,start_img.height*scale);
        };

        var start_maint_img = new Image();
        start_maint_img.src = "stop_maint.png";
        start_maint_img.onload = function(){
            var t = translate_coords(676,357,scale,w,h);
            ctx.drawImage(start_maint_img,0,0,start_maint_img.width,start_maint_img.height,t[0],t[1],start_maint_img.width*scale,start_maint_img.height*scale);
        };

        var spinner_icon_count = 0;
        var spinner_icon = setInterval(function tick_spinner() {
            if (spinner_icon_count > 3) {spinner_icon_count = 0};
            var spinner_img = new Image();
            spinner_img.src = "spinner_"+spinner_icon_count+".png";
            spinner_img.onload = function(){
                var t = translate_coords(445,291,scale,w,h);
                ctx.drawImage(spinner_img,0,0,spinner_img.width,spinner_img.height,t[0],t[1],spinner_img.width*scale,spinner_img.height*scale);
            };
            spinner_icon_count++;
        }, 500);

        var killTimer = setTimeout(function () {
            window.location.replace("https://jurassicpark.systems/")
        }, getRandomNumber(4500, 8000));

        canvas.onmousedown = function(evt) {
            var t = translate_coords(676,357);
            var rect = canvas.getBoundingClientRect();
            var x = evt.clientX - rect.left;
            var y = evt.clientY - rect.top;
            
            var t = retranslate_coords(x,y,scale,w,h);
            if (isInRect(t[0],t[1],676,357,157,27) && (evt.button == 0)) {
                var start_maint_img = new Image();
                start_maint_img.src = "stop_maint_p.png";
                start_maint_img.onload = function(){
                    var t = translate_coords(676,357,scale,w,h);
                    ctx.drawImage(start_maint_img,0,0,start_maint_img.width,start_maint_img.height,t[0],t[1],start_maint_img.width*scale,start_maint_img.height*scale);
                };

                setTimeout(function () {
                    clearTimeout(killTimer);
                    clearInterval(spinner_icon);
                    canvas.onmousedown = function () {};
                    prom(canvas, ctx);
                }, 100);
            };
        };
    }, 2000);
};