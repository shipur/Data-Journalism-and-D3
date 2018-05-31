// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.

// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
//and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);;

//---selectedAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(csvData, selectedAxis) {
    // create scales

    console.log("Inside xScale function, selected axis: "+ selectedAxis);

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(csvData, d => d[selectedAxis]) * 0.8,
        d3.max(csvData, d => d[selectedAxis]) * 1.2
      ])
      .range([0, width])

      console.log("Inside xScale function, csvData[0][selected axis]: "+ csvData[0][selectedAxis]);
  
    return xLinearScale
  
  };

  // function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale)
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis)
  
    return xAxis
  }

  // function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, selectedAxis) {
    
    console.log("Selected Axis inside renderCircles: " + selectedAxis)

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[selectedAxis]))
  
    return circlesGroup
  };
  
  // function used for updating circles group with new tooltip
function updateToolTip(selectedAxis, circlesGroup) {
    console.log("Selected Axis inside updateToolTips: " + selectedAxis)

    if (selectedAxis == "poverty") {
      var label = "Poverty (%):"
    } else {
      var label = "Obesity (%)"
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        console.log("d[selectedAxis]: " + d[selectedAxis]);
        return (`${d.states}<br>${label} ${d[selectedAxis]}`);
        
      });
    console.log("tooltip: " +toolTip );
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup
  }

  // Retrieve data from the CSV file and execute everything below
d3.csv("../Data/data.csv", function (err, csvData) {
    if (err) return console.warn(error);
  
    console.log("csvData: "+ csvData[0].poverty);
    // parse data
    csvData.forEach(function (data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
    });
  
    //---console.log(" Selected axis: "+ selectedAxis);
    // xLinearScale function above csv import
    //---var xLinearScale = xScale(csvData, selectedAxis)
    var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(csvData, d => d.poverty)])
    .range([0, width]);
  
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(csvData, d => d.healthcare)])
      .range([height, 0]);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    //---var xAxis = 
    chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis)
  
    // append y axis
    chartGroup.append("g")
      .call(leftAxis)

      // var xScale = d3.scaleLinear()
// .domain([8, d3.max(csvData, d => d.poverty)])
// .range([0, width]);

// var yScale = d3.scaleLinear()
// .domain([0, d3.max(csvData, d => d.healthcare)])
// .range([height, 0]);

// // Create Axes
// // =============================================
// var xAxis = d3.axisBottom(xScale); 
// var yAxis = d3.axisLeft(yScale);

// //++++++++++++++++++
// // append axes
// chartGroup.append("g")
// .attr("transform", `translate(0, ${height})`)
// .call(xAxis);

// chartGroup.append("g")
//   //.attr("transform", `translate(30, 0)`)
//   .call(yAxis);

  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(csvData)
      .enter()
      .append("circle")
      //---.attr("cx", d => xLinearScale(d[selectedAxis]))
      .attr("cx", d=>xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 20)
      .attr("fill", "pink")
      .attr("opacity", ".5")
  
    // Create group for  2 x- axis labels
    // ---var labelsGroup = chartGroup.append("g")
    //----   .attr("transform", `translate(${width/2}, ${height + 20})`)
  
    //--- var povertyLabel = labelsGroup.append("text")
    //---   .attr("x", 0)
    //--   .attr("y", 20)
    //--   .attr("value", "poverty") //value to grab for event listener
    //--   .classed("active", true)
    //--   .text("Poverty (%)");
  
    //-- var obesityLabel = labelsGroup.append("text")
    //--   .attr("x", 0)
    //--   .attr("y", 40)
    //---   .attr("value", "obesity") //value to grab for event listener
    //---   .classed("inactive", true)
    //----   .text("Obesity");
  
    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Healthcare");
  
    // updateToolTip function above csv import
    // var circlesGroup = updateToolTip(selectedAxis, circlesGroup)
  
    // x axis labels event listener
    // labelsGroup.selectAll("text")
    //   .on("click", function () {
    //     // get value of selection
    //     var value = d3.select(this).attr("value")
        
    //     if (value != selectedAxis) {
    //         console.log("Selected Axis inside labelsGroup: " + selectedAxis)
    //       // replaces chosenXAxis with value
    //       selectedAxis = value;
  
    //       console.log(selectedAxis)
  
    //       // functions here found above csv import
    //       // updates x scale for new data
    //       xLinearScale = xScale(csvData, selectedAxis);
  
    //       // updates x axis with transition
    //       xAxis = renderAxes(xLinearScale, xAxis);
  
    //       // updates circles with new x values
    //       circlesGroup = renderCircles(circlesGroup, xLinearScale, selectedAxis);
  
    //       // updates tooltips with new info
    //     //   circlesGroup = updateToolTip(selectedAxis, circlesGroup);
  
    //       // changes classes to change bold text
    //       if (selectedAxis == "obesity") {
    //         obesityLabel
    //           .classed("active", true)
    //           .classed("inactive", false)
    //         povertyLabel
    //           .classed("active", false)
    //           .classed("inactive", true)
    //       } else {
    //         obesityLabel
    //           .classed("active", false)
    //           .classed("inactive", true)
    //         povertyLabel
    //           .classed("active", true)
    //           .classed("inactive", false)
    //       };
    //     };
    //   });
  
    });
















//*********************************Below this previous Code **********/
// // Step 2: Create an SVG wrapper,
// // append an SVG group that will hold our chart,
// // and shift the latter by left and top margins.
// // =================================
// var svg = d3.select("body")
//   .append("svg")
// //   .attr("plotWidth", svgWidth)
// //   .attr("plotHeight", svgHeight)
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);

// var chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);


// // Step 3:
// // Import data from the mojoData.csv file
// // =================================
// d3.csv("../Data/data.csv", function (error, csvData) {
//   if (error) return console.warn(error);
//     console.log("csvData: "+ csvData[0].poverty);

//     // Initialize tool tip
//   // ==============================
//   var toolTip = d3.tip()
//   .attr("class", "tooltip")
//   //.offset([80, -60])
//   //.html("hi")
//   .html(function(d) {
//       //return (d.state)
//       return(`${d.state}<br>Poverty: ${d.poverty} <br>Healthcare: ${d.healthcare}`)
//     });

//   // Step 4: Parse the data

//   // Format the data
//   csvData.forEach(function (data) {
//     data.poverty = +data.poverty;
//     data.healthcare = +data.healthcare;

//     console.log("Poverty: "+ data.poverty);
//     console.log("Healthcare: "+ data.healthcare);
//   });


// // Create Scales
// //= ============================================
// var xScale = d3.scaleLinear()
// .domain([8, d3.max(csvData, d => d.poverty)])
// .range([0, width]);

// var yScale = d3.scaleLinear()
// .domain([0, d3.max(csvData, d => d.healthcare)])
// .range([height, 0]);

// // Create Axes
// // =============================================
// var xAxis = d3.axisBottom(xScale); 
// var yAxis = d3.axisLeft(yScale);

// //++++++++++++++++++
// // append axes
// chartGroup.append("g")
// .attr("transform", `translate(0, ${height})`)
// .call(xAxis);

// chartGroup.append("g")
//   //.attr("transform", `translate(30, 0)`)
//   .call(yAxis);

//    var circlesGroup = chartGroup.append("svg:g")
//     circlesGroup.selectAll("dot")
//         .data(csvData)
//         .enter()
//         .append("circle")
//         .attr("fill", "lightblue")
        
//         //.attr("cx", 50  )
//         .attr("cx", function (d,i) { return xScale(d.poverty); } )
//         //.attr("cx", function (d,i) { return xScale(d.poverty); } )
//         .attr("cy", function (d) { return yScale(d.healthcare); } )
//         .attr("r", 15)

//     circlesGroup.selectAll("text")
//     .data(csvData)
//     .enter()
//     .append("text")
//     .text(function(d) {
//       return d.Locationabbr;
//     })
//     //.text("bh")
//     .attr("x", function (d,i) { return xScale(d.poverty); } )
//     .attr("y", function (d) { return yScale(d.healthcare); } )
//     .attr("font-size", "15px")
//     .style("text-anchor", "middle")
//     .attr("fill", "white")
//     .on("mouseover", function (data) {
//         toolTip.show(data);
//       })
//       // onmouseout event
//       .on("mouseout", function (data, index) {
//         toolTip.hide(data);
//       });

//   //----------- TOOLTIP ------------------------
// //  // Initialize tool tip
// //   // ==============================
// //   var toolTip = d3.tip()
// //     .attr("class", "tooltip")
// //     //.offset([80, -60])
// //     //.html("hi")
// //     .html(function(d) {
// //         return (d.state)
// //       });
    

//   // Create tooltip in the chart
//   // ==============================
//   chartGroup.call(toolTip);

//   // Create event listeners to display and hide the tooltip
//   // ==============================
// //   circlesGroup.on("mouseover", function (data) {
// //       toolTip.show(data);
// //     })
// //     // onmouseout event
// //     .on("mouseout", function (data, index) {
// //       toolTip.hide(data);
// //     });
//     //----------- TOOLTIP ------------------------

//     // Create axes labels
//    chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left + 40)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .attr("class", "axisText")
//     .text("Lack of Healthcare");

//  chartGroup.append("text")
//    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
//    .attr("class", "axisText")
//    .text("Poverty");

// });
        
 


