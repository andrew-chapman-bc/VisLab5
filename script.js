let coffee;
d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
    coffee = data
    console.log('in the function: ', coffee);
    makeCoffeeChart()        
});



const outerWidth = 800;
const outerHeight = 500;

const margin = {top:40, left:40, bottom:25, right:25};
const width = outerWidth - margin.left - margin.right;
const height = outerHeight - margin.top - margin.bottom;


const svg = d3.select('body')
  .append('svg')
  .attr('width', outerWidth)
  .attr('height', outerHeight)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

function makeCoffeeChart() {

    let revenueExtent = d3.extent(coffee, d => d.revenue)

    let xScale = d3.scaleBand()
        .domain(coffee.map(d=>d.company))
        .rangeRound([0, width])
        .paddingInner(0.1)

    let yScale = d3.scaleLinear()
        .domain([revenueExtent[1], 0])
        .range([height,0]); 


    svg.selectAll("rect")
        .data(coffee)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(d.company);
        })
        .attr("y", function(d) {
            return height - yScale(d.revenue);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return yScale(d.revenue);
        })
    const xAxis = d3.axisBottom()
        .scale(xScale)

    const yAxis = d3.axisLeft()
        .scale(yScale)
        //.ticks(7, "s")

    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`)
    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)

    svg.append("text")
		//.attr('x', 520)
		.attr("class", "lifeLabel")
        .attr("alignment-baseline", "baseline")
        .attr("font-size", 12)
        .attr("font-family", "sans-serif")
        .attr('dy', -10)
        .attr('dx', -15)
		.text("Billions USD")

    //const sizeScale = d3.scaleLinear()
    //    .range([5, 15])
}




