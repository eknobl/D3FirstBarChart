async function drawBars() {
// 1. ACCESS DATA
  const data = await d3.json("./my_weather_data.json")
  //console.log(data); CHECK POINT

  const drawChart = metric => { // THIS FUNCTION IS TO MAKE IT CUSTOMIZABLE

      const xAccessor = d => d[metric]
      const yAccessor = d => d.length // WE DIDN'T HAVE AN YACCESSOR BECAUSE Y ARE COUNTS.

    // 2. CREATE CHART DIMENSIONS 
      const width = 600;

      const dimensions = {
        width, 
        height: width * 0.6,
        margin: {
          top: 25,
          right: 25,
          bottom: 50,
          left: 50,
        }
      }

      dimensions.boundedWidth = dimensions.width - dimensions.margin.right - dimensions.margin.left
      dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
    
    // 3. DRAW CANVAS 
      const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        //.style("border", "1px solid") //CHECK POINT

      const bounds = wrapper.append("g")
        .style("transform", `translate(${
            dimensions.margin.left
          }px, ${
          dimensions.margin.top
          }px)`)

    // 4. CREATE SCALES
      const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice()

      const binsGenerator = d3.bin() 
        .domain(xScale.domain()) //USES THE DOMAIN THAT ALREADY HAS THE VALUES
        .value(xAccessor) //
        .thresholds(12) //DEFINES THE GAPS BETWEEN THE BARS

      const bins = binsGenerator(data)
      //console.log(bins[0]) //CHECK POINT

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor)]) //USES BINS, NOT DATA
        .range([dimensions.boundedHeight, 0])
        .nice()

    // 5. DRAW DATA 
      const binsGroup = bounds.append("g") //GROUPS ALL ELEMENTS OF THE BIN
        
      const binsGroups = binsGroup.selectAll("g") //ADDS DATA TO BINS
          .data(bins)
          .join("g")

      const barPadding = 1

      const barRects = binsGroups.append("rect")
          .attr("x", d => xScale(d.x0) + barPadding / 2)
          .attr("y", d => yScale(yAccessor(d)))
          .attr("width", d => d3.max([
            0,
            xScale(d.x1) - xScale(d.x0) - barPadding
          ]))
          .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
          //.style("fill", "skyblue")

    // 6. DRAW PHERIPHERALS 
      const barText = binsGroups.append("text")
        .attr("x", d => xScale(d.x0) + (barPadding / 2)+11)    
        .attr("y", d => yScale(yAccessor(d)+2))
        .text(yAccessor)
        .style("font-family", "Roboto")
        .style("fill", "lightgrey")

      const mean = d3.mean(data, xAccessor)
      console.log(mean)
      
      const meanLine = bounds.append("line")
          .attr("x1", xScale(mean))
          .attr("x2", xScale(mean))
          .attr("y1", dimensions.boundedHeight)
          .attr("y2", 0)
          .attr("stroke", "maroon")
          .style("stroke-dasharray", "2px 4px")

      const meanLabel = bounds.append("text")
          .attr("x", xScale(mean)+5)
          .attr("y", 0)
          .text("mean")
          .style("font-family", "Roboto")
          .style("fill", "lightgrey")

      const xAxisGenerator = d3.axisBottom()
          .scale(xScale)
      
        const xAxis = bounds.append("g")
          .call(xAxisGenerator)
          .style("transform", `translateY(${
            dimensions.boundedHeight
          }px`)
      
        const axisXLabel = xAxis.append("text")
          .attr("x", dimensions.boundedWidth / 2)
          .attr("y", dimensions.margin.bottom - 10)
          .attr("fill", "black")
          .style("font-size", "1.4em")
          .html(metric)
      
// SET UP INTERACTIONS
  }
  drawChart("humidity");
  drawChart("moonPhase");
  drawChart("dewPoint");
  drawChart("uvIndex");
}

drawBars()

