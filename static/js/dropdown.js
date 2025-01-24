document.getElementById('company-dropdown').addEventListener('change', function () {
    const symbol = this.value;
    fetch(`/api/dropdown/${symbol}`)
        .then(response => response.json())
        .then(data => {
            const infoDiv = document.getElementById('company-info');
            infoDiv.innerHTML = `
                <p><strong>Company:</strong> ${data['Company Name']}</p>
                <p><strong>Employees:</strong> ${data['Fulltime Employees']}</p>
                <p><strong>Stock Price:</strong> $${data['Stock Price']}</p>
                <p><strong>Business Summary:</strong> ${data['Business Summary']}</p>
            `;
        });
});
