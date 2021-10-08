//let coffee;



const outerWidth = 800;
const outerHeight = 500;

const margin = {top:40, left:40, bottom:25, right:25};
const width = outerWidth - margin.left - margin.right;
const height = outerHeight - margin.top - margin.bottom;

let type = d3.select('#group-by').node().value
console.log(type)

let order = "dec"

const svg = d3.select('body')
  .append('svg')
  .attr('width', outerWidth)
  .attr('height', outerHeight)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

let xScale = d3.scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1)

let yScale = d3.scaleLinear()
  .range([height,0]); 

svg.append('g')
  .attr('class', 'axis-y-axis')

svg.append('g')
  .attr('class', 'axis-x-axis')

svg.append("text")
  .attr("class", "y-axis-title")

let key = function(d) {
    return d.company;
};



function makeCoffeeChart(coffee, type, order) {

    console.log("YEET")
    console.log(type)
    console.log(order)

    if (order == "asc") {
        var sorted = coffee.sort(function(a, b) {
	    	return d3.descending(a[type], b[type]);
         });
    }
    else if (order == "dec"){
        var sorted = coffee.sort(function(a, b) {
	    	return d3.ascending(a[type], b[type]);
         });
    }

    
    let revenueExtent = d3.extent(coffee, d => d[type])

    console.log(coffee, revenueExtent)

    xScale.domain(sorted.map(function(d) {
        return d.company;
      }))

    yScale.domain([0,revenueExtent[1]])


    const bars = svg.selectAll("rect")
        .data(coffee, d=>d.company)

        
    bars.enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(d.company);
        })
        .attr("y", function(d) {
            //console.log("HELLLLLLOOOOOO")
            //console.log(d[type])
            return yScale(d[type]);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return height - yScale(d[type]);
        })
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("y", function(d) {
            //console.log("HELLLLLLOOOOOO")
            //console.log(d[type])
            return yScale(d[type]);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return height - yScale(d[type]);
        })

    bars.exit()
        .transition()
        .duration(1000)
        .remove()
    const xAxis = d3.axisBottom()
        .scale(xScale)

    const yAxis = d3.axisLeft()
        .scale(yScale)

    svg.select(".axis-x-axis")
        .transition()
        .duration(1000)
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`)

    svg.select(".axis-y-axis")
        .transition()
        .duration(1000)
        .call(yAxis)

    let labelString = ""
    if(type == "stores") {
        labelString = "Stores"
    }
    else {
        labelString = "Billions USD"
    }
    svg.select(".y-axis-title")
        .attr("alignment-baseline", "baseline")
        .attr("font-size", 12)
        .attr("font-family", "sans-serif")
        .attr('dy', -10)
        .attr('dx', -15)
		.text(labelString)

    //const sizeScale = d3.scaleLinear()
    //    .range([5, 15])

    var sortBars = function() {

        bars.sort(function(a, b) {
               return d3.ascending(a[type], b[type]);
               })
           .transition()
           .duration(1000)
           .attr("x", function(d, i) {
                   return xScale(d.company);
           })
           .attr("y", function(d) {
            return yScale(d[type]);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
                return height - yScale(d[type]);
             })
            

    };			
    if (order == "asc") {
        sortBars()
    }
    else if (order == "dec"){
        sortBars()
    }
}

d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
    //coffee = data
    console.log('in the function: ', data);
    makeCoffeeChart(data, type, order)
    d3.select('#group-by')
        .on('change', function() {
        type = d3.select('#group-by').node().value
        makeCoffeeChart(data,type, order);
    });  
    d3.select('#sort-by')
        .on('click', function() {
        type = d3.select('#group-by').node().value
        if (order == "asc") {
            order = "dec"
        }
        else {
            order = "asc"
        }
        makeCoffeeChart(data,type, order);
        
    });           
});




