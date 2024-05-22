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

// Percolation simulation class
function Percolation(N) {
    var size = N;
    var uf = new WeightedQuickUnionUF(N * N + 2);
    var topUF = new WeightedQuickUnionUF(N * N + 2);
    var opened = [];
    for (var i = 0; i < N * N; i++) {
        opened[i] = false;
    }

    function xyTo1D(i, j) {
        return size * (i - 1) + j;
    }

    this.open = function (i, j) {
        opened[xyTo1D(i, j)] = true;

        if (i != 1 && this.isOpen(i - 1, j)) {
            uf.union(xyTo1D(i, j), xyTo1D(i - 1, j));
            topUF.union(xyTo1D(i, j), xyTo1D(i - 1, j));
        }
        if (i != size && this.isOpen(i + 1, j)) {
            uf.union(xyTo1D(i, j), xyTo1D(i + 1, j));
            topUF.union(xyTo1D(i, j), xyTo1D(i + 1, j));
        }
        if (j != 1 && this.isOpen(i, j - 1)) {
            uf.union(xyTo1D(i, j), xyTo1D(i, j - 1));
            topUF.union(xyTo1D(i, j), xyTo1D(i, j - 1));
        }
        if (j != size && this.isOpen(i, j + 1)) {
            uf.union(xyTo1D(i, j), xyTo1D(i, j + 1));
            topUF.union(xyTo1D(i, j), xyTo1D(i, j + 1));
        }
        if (i == 1) {
            uf.union(0, xyTo1D(i, j));
            topUF.union(0, xyTo1D(i, j));
        }
        if (i == size) {
            uf.union(size * size + 1, xyTo1D(i, j));
        }
    }

    this.isOpen = function (i, j) {
        return opened[xyTo1D(i, j)];
    }

    this.isFull = function (i, j) {
        return topUF.connected(0, xyTo1D(i, j));
    }

    this.percolates = function () {
        return uf.connected(0, size * size + 1);
    }
}

// Union-Find class for efficiently managing and checking connections
function WeightedQuickUnionUF(N) {
    var parent = [];
    var size = [];
    for (var i = 0; i < N; i++) {
        parent[i] = i;
        size[i] = 1;
    }

    function root(i) {
        while (i != parent[i]) {
            parent[i] = parent[parent[i]];
            i = parent[i];
        }
        return i;
    }

    this.union = function (p, q) {
        var i = root(p);
        var j = root(q);
        if (i == j) return;

        if (size[i] < size[j]) {
            parent[i] = j;
            size[j] += size[i];
        } else {
            parent[j] = i;
            size[i] += size[j];
        }
    }

    this.connected = function (p, q) {
        return root(p) == root(q);
    }
}