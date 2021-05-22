var svgWidth = 1500;
var svgHeight = 900;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * .97,
        d3.max(data, d => d[chosenXAxis]) * 1.03
        ])
        .range([0, width]);

    return xLinearScale;

}

function yScale(data, chosenYAxis) {
    var YLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * .97,
        d3.max(data, d => d[chosenYAxis]) * 1.03])
            .range([height, 0]);

    return YLinearScale;

}


function renderCircles(circlesGroup, XScale, chosenXAxis, chosenYAxis) {
    var currentYScale = yScale(allData, chosenYAxis)
    var currentXScale = xScale(allData, chosenXAxis)
    
    return circlesGroup;
}



var chosenXAxis = "income";
var chosenYAxis = "obesity";

var allData = []

d3.csv("data.csv").then(function (data) {
    allData = data
    var states = data.map(data => data.abbr);
    var stateName = data.map(data => data.state);
    console.log("states", states, "stateName", stateName);
    // parse data
    data.forEach(function (data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        console.log(data);
    });
    var xLinearScale = xScale(data, chosenXAxis);
    
    var yLinearScale = yScale(data, chosenYAxis);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    console.log(yLinearScale)
   
    // Initial parameters




   




    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0,${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", "translate(0,0)")
        .call(leftAxis);

    chartGroup.append("g")
        .call(leftAxis);
    var currentYScale = yScale(allData, chosenYAxis)
    var currentXScale = xScale(allData, chosenXAxis)

    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
       
        .append("circle")
        .attr("cx", d => currentXScale(d[chosenXAxis]))
        .attr("cy", d => currentYScale(d[chosenYAxis]))
        .attr("r", 11)
        .attr("fill", "#86cbff")
        .attr("stroke", "black");

    var circLabel = chartGroup.selectAll("label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "StAbbr")
        .text(function (d) { return (d.abbr) })
        .attr("text-anchor", "middle")
        .attr("font-size", "11")
        .attr("dy", d => yLinearScale(d.obesity)+2)
        .attr("dx", d => xLinearScale(d.income));

    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .classed("active", true);
   

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "income") // value to grab for event listener
        .classed("active", true)
        .attr("font-size", 13)
        .text("Household Income (Median)");


    

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("font-size", "13")
        .classed("axis-text", true)
        .text("Obesity %");

    var toolTip = d3.tip()
        .attr("class", "toolTip")
        .offset([80, -60])
        .style("display", "block")
        .html(function (d) {
            return (`<div class="box">${d.state}<br>Income: ${d.income} Median<br>obesity: ${d.obesity} %</strong></div>`)
        });


    svg.call(toolTip)
    circlesGroup.on("click", function (d) {

        toolTip.show(d, this);
    })

        // on mouse out event
        .on("mouseout", function (d) {
            toolTip.hide(d);
        });

})
