function createSmallMultiples(companies) {
  const metrics = ['market_cap', 'revenues', 'net_income'];
  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const width = 200 - margin.left - margin.right;
  const height = 150 - margin.top - margin.bottom;

  const container = d3.select("#small-multiples-container");
  container.selectAll("*").remove();

  metrics.forEach(metric => {
    const svg = container.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0]);

    x.domain(companies.map(d => d.symbol));
    y.domain([0, d3.max(companies, d => d[metric])]);

    svg.selectAll(".bar")
      .data(companies)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.symbol))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d[metric]))
      .attr("height", d => height - y(d[metric]));

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .text(metric);
  });
}

document.getElementById('company-select').addEventListener('change', function() {
  const selectedCompanies = Array.from(this.selectedOptions).map(option => option.value);
  if (selectedCompanies.length > 3) {
    alert('Please select up to 3 companies');
    return;
  }
  
  fetch(`/api/companies?symbols=${selectedCompanies.join(',')}`)
    .then(response => response.json())
    .then(data => createSmallMultiples(data));
});
