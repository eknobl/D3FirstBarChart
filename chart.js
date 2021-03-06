async function drawLineChart() {
  // write your code here
  const data = await d3.json("./my_weather_data.json")
  const yAccessor = d => d["temperatureMax"]
  const dataParser = d3.timeParse("%Y-%m-%d")
  const xAccessor = d => dataParser(d.date)

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margins: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    }
  }
  dimensions.boundedWidth = dimensions.width
    -dimensions.margins.left
    -dimensions.margins.right
  dimensions.boundedHeight = dimensions.height
    -dimensions.margins.top
    -dimensions.margins.bottom
  
  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
  
  const bounds = wrapper.append("g")
    .style("transform", `translate(${
      dimensions.margins.left
    }px, ${
      dimensions.margins.right
    }px)`)

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor)) // extent dice los puntos extremos de datos de un accesor en particular
    .range([dimensions.boundedHeight, 0])
    console.log(yScale(0))

  const freezingPlacement = yScale(32)
  const freezing = bounds.append("rect")
    .attr("x", 0)
    .attr("y", freezingPlacement)
    .attr("width", dimensions.boundedWidth)
    .attr("height", dimensions.boundedHeight-freezingPlacement)
    .attr("fill", "#e0f3f3")

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, xAccessor)) // extent dice los puntos extremos de datos de un accesor en particular
    .range([dimensions.boundedWidth, 0])

  //Draw Data
  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

  const line = bounds.append("path")
    .attr("d", lineGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("stroke-width", 2)

  //Draw Axis
  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)

  const yAxis = bounds.append("g")
    yAxisGenerator(yAxis)

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${
      dimensions.boundedHeight 
    }px)`)
}


drawLineChart()























