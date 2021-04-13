// Set up initial parameters for svg image
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//import the data from the CSV file

d3.csv("assets/data/data.csv").then(function (healthData) {
    console.log(healthData)

    healthData.forEach(function (data) {
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.age = +data.age;
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
        data.smoker = +data.smoker;
    });

    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(healthData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([2, d3.max(healthData, d => d.healthcare)])
        .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "12")
        .classed("stateCircle", true)
        .attr("opacity", ".5");

    //Alternative to tool tip for adding text datapoints
    chartGroup.append("g")
        .selectAll('text')
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .classed(".stateText", true)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "10px")
        .style("font-weight", "bold")
        .attr("alignment-baseline", "central");

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .style("fill", "black")
        .style("font", "20px sans-serif")
        .style("font-weight", "bold")
        .text("Lacks HealthCare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .style("font", "20px sans-serif")
        .style("font-weight", "bold")
        .text("Poverty (%)");

}).catch(function (error) {
    console.log(error);
});


