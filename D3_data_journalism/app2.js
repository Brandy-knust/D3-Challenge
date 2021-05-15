var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

function yScale(data, chosenYAxis) {
    var YLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);

    return YLinearScale;

}


function renderCircles(circlesGroup, XScale, chosenXAxis, chosenYAxis) {
    var currentYScale = yScale(allData, chosenYAxis)
    var currentXScale = xScale(allData, chosenXAxis)
    // circlesGroup.transition()
    //     .duration(1000)
    //     .attr("cx", d => currentXScale(d[chosenXAxis]))
    //     .attr("cy", d => currentYScale(d[chosenYAxis]));
    return circlesGroup;
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var label;

    // if (chosenXAxis === "income") {
    //     label = "Household Income (Median)";
    // }
    // else if (chosenXAxis === "age") {
    //     label = "Age (Median)";
    // }
    // else {
    //     label = "In Poverty (%)";
    // }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.obesity}<br>${d.smokes}<br>${d.healthcare} ${d[chosenXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })

        // on mouse out event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });
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
    var yLinearScale = d3.scaleLinear()
        .domain(0, d3.min(data, d => d.chosenYAxis))
        .range([height, 0]);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    console.log(yLinearScale)
    // }).catch(function (error) {
    //     console.log(error);


    // Initial parameters




    // xLinearScale function

    // yLinearScale function




    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0,${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);
    var currentYScale = yScale(allData, chosenYAxis)
    var currentXScale = xScale(allData, chosenXAxis)
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        // .text(function (d) { return d.abbr; })
        .append("circle")
        .attr("cx", d => currentXScale(d[chosenXAxis]))
        .attr("cy", d => currentYScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "white")
        .attr("stroke", "black");
    
    // circlesGroup.append("text")
    //     .attr("dy", function(d){
    //   return d.cy+5;
    // }).attr("dx",function(d){ return d.cx-5;})
    //          .text(function(d){return d.abbr});

    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .classed("active", true);
    // var povertyLabel = labelsGroup.append("text")
    //     .attr("x", 0)
    //     .attr("y", 20)
    //     .attr("value1", "poverty") // value to grab for event listener
    //     .classed("active", true)
    //     .text("Poverty %:");

    // var ageLabel = labelsGroup.append("text")
    //     .attr("x", 0)
    //     .attr("y", 20)
    //     .attr("value1", "age") // value to grab for event listener
    //     .classed("active", true)
    //     .text("Age (Median):");

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "income") // value to grab for event listener
        .classed("active", true)
        .text("Household Income (Median)");
    
        
    // var smokesLabel = labelsGroup.append("text")
    //     .attr("x", 0)
    //     .attr("y", 20)
    //     .attr("value2", "smokes") // value to grab for event listener
    //     .classed("active", true)
    //     .text("Smokes %:");

    var obesityLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "obesity") // value to grab for event listener
        .classed("active", true)
        .text("Obesity %");

    // var healthcareLabel = labelsGroup.append("text")
    //     .attr("x", 0)
    //     .attr("y", 20)
    //     .attr("value2", "healthcare") // value to grab for event listener
    //     .classed("active", true)
    //     .text("Healthcare %:");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Obesity %");

    // var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // labelsGroup.selectAll("text")
    //     .on("click", function (renderCircles);  
    //     var value1 = d3.select(this).attr("value1");
    // if (value1 !== chosenXAxis) {
    //     chosenXAxis = value1
    // };
    // var value2 = d3.select(this).attr("value2");
    // if (value2 !== chosenYAxis) {
    //     chosenYAxis = value2;
    // };
    // });
})