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

// Initial parameters
var chosenXAxis = "income";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon clicking of axis label
function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

// function used for updating y-scale var upon clicking of axis label
function yScale(data, chosenYAxis) {
    var YLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        ])
        .range([height, 0]);

    return YLinearScale;

}

// function used for updating and transitioning
function renderCircles(circlesGroup, newXScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}

// function for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "income") {
        label = "Household Income (Median)";
    }
    else if (chosenXAxis === "age") {
        label = "Age (Median)";
    }
    else {
        label = "In Poverty (%)";
    }

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

// retrieve data from CSV

d3.csv("data.csv").then(function (data, err) {
    if (err) throw err;

    // parse data
    data.forEach(function (data) {
        data.state = +data.state;
        data.abbr = +data.abbr;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });
    console.log(data)

    // xLinearScale function
    var xLinearScale = xScale(data, chosenXAxis);

    // yLinearScale function
    var yLinearScale = d3.scaleLinear()
        .domain(0, d3.min(data, d => d.chosenYAxis))
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0,${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .attr("value1", "abbr")
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "white")
        .attr("stroke", "black");

    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .classed("active", true);


    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value1", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty %:");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value1", "age") // value to grab for event listener
        .classed("active", true)
        .text("Age (Median):");

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value1", "income") // value to grab for event listener
        .classed("active", true)
        .text("Household Income (Median):");

    var smokesLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value2", "smokes") // value to grab for event listener
        .classed("active", true)
        .text("Smokes %:");

    var obesityLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value2", "obesity") // value to grab for event listener
        .classed("active", true)
        .text("Obesity %:");

    var healthcareLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value2", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Healthcare %:");

    chartGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text(d => d.d[chosenYAxis]);

    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    labelsGroup.selectAll("text")
        .on("click", function (renderCircles) {
            var value1 = d3.select(this).attr("value1");
            if (value1 !== chosenXAxis) {
                chosenXAxis = value1
            };
            var value2 = d3.select(this).attr("value2");
            if (value2 !== chosenYAxis) {
                chosenYAxis = value2;
            };
        });
    })