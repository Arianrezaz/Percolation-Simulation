// Function to draw the grid on the canvas
function draw(N, perc) {
    var canvas = document.getElementById('animation');
    var ctx = canvas.getContext('2d');
    var canvasSize = canvas.width;
    var siteSize = Math.floor(canvasSize / N);
    var firstSiteLocation = (canvasSize - siteSize * N) / 2;

    function loc(coordinate) {
        return firstSiteLocation + (coordinate - 1) * siteSize;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    this.drawGrid = function () {
        for (var row = 1; row < N + 1; row++) {
            for (var col = 1; col < N + 1; col++) {
                if (perc.isFull(row, col)) {
                    ctx.fillStyle = "#6699FF";
                    ctx.fillRect(loc(col), loc(row), siteSize, siteSize);
                } else if (perc.isOpen(row, col)) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(loc(col), loc(row), siteSize, siteSize);
                } else {
                    ctx.fillStyle = "black";
                    ctx.fillRect(loc(col), loc(row), siteSize, siteSize);
                }
            }
        }
    }
}

// Main function to simulate percolation
function simulatePercolation() {
    clearInterval(interval);

    var N = +document.getElementById("gridSize").value;
    var radios = document.getElementsByName('speed');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            if (radios[i].value == "instant") { var delay = 0; }
            else if (radios[i].value == "fast") { var delay = 5; }
            else if (radios[i].value == "slow") { var delay = 100; }
            break;
        }
    }

    var perc = new Percolation(N);
    var drawPerc = new draw(N, perc);
    var count = 0;

    function openRandom() {
        var i = Math.floor(Math.random() * N + 1);
        var j = Math.floor(Math.random() * N + 1);

        if (perc.isOpen(i, j)) {
            openRandom();
        } else {
            perc.open(i, j);
            return;
        }
    }

    function checkPerc() {
        if (!perc.percolates()) {
            openRandom();
            count++;
            drawPerc.drawGrid();
        } else {
            clearInterval(interval);
            var percentage = parseFloat((count * 100) / (N * N)).toFixed(1);
            var outstring = `With ${count} sites opened, a spanning cluster has formed. ${percentage}% of sites are open`;
            document.getElementById("percolates").innerHTML = outstring;
            const barWrapper = document.querySelector('.bar-wrapper');
            const bar = document.querySelector('.bar');
            setTimeout(() => {
                barWrapper.style = 'display : block;';
                setTimeout(() => {
                    bar.style = `width : ${percentage}%`;
                    bar.innerHTML = `${percentage}%`; 
                }, 1)
            }, 100)
        }
    }
    
    function outputInstantly() {
        while (!perc.percolates()) {
            openRandom();
            count++;
        }
        drawPerc.drawGrid();
        var percentage = parseFloat((count * 100) / (N * N)).toFixed(1);
        var outstring = `With ${count} sites opened, a spanning cluster has formed. ${percentage}% of sites are open`;
        document.getElementById("percolates").innerHTML = outstring;
        const barWrapper = document.querySelector('.bar-wrapper');
        const bar = document.querySelector('.bar');
        barWrapper.style = 'display : block;';
        setTimeout(() => {
            bar.style = `width : ${percentage}%`;
            bar.innerHTML = `${percentage}%`; 
        }, 1)
    }
    

    if (delay === 0) {
        outputInstantly();
    } else {
        interval = setInterval(checkPerc, delay);
        interval();
    }
}