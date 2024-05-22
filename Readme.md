# Percolation Simulation

This project implements a percolation simulation using JavaScript, HTML, and CSS. Percolation is a process where a liquid passes through a penetrable material. In this simulation, the liquid represents the "open" sites, and the penetrable material represents the grid.

### Algorithms Used:

1. **Percolation Simulation**: Models the process of percolation on a grid. It utilizes the Weighted Quick Union-Find algorithm to efficiently manage connections between grid sites.
2. **Weighted Quick Union-Find Algorithm**: An efficient algorithm for managing disjoint sets and determining connectivity between elements. It is used to determine whether the system percolates and efficiently manage connections between grid sites.

### Features:

- Randomized opening of sites to simulate percolation.
- Visualization of the percolation process on a grid.
- Adjustable grid size and simulation speed.

### Files:

- `index.html`: Contains the HTML structure of the simulation.
- `styles.css`: Defines the styling for the simulation interface.
- `script.js`: Implements the percolation simulation logic.

### Usage:

1. Open `index.html` in a web browser to run the simulation.
2. Enter the desired size of the grid (maximum 400).
3. Choose the simulation speed (instant, fast, slow).
4. Click the "Run Simulation" button to start the percolation simulation.
5. Observe the grid as it fills with liquid and the percolation rate.
6. After the simulation is complete, the percentage of open sites and percolation rate will be displayed.

### Percolation Simulation Example:

![Percolation Simulation Example](https://github.com/Arianrezaz/Percolation-Simulation/blob/main/Example.png)

## Acknowledgments

- This project was inspired by the percolation simulation problem in computer science.

### Contribution:
Contributions are welcome! Feel free to fork the repository, make improvements, and create pull requests.
