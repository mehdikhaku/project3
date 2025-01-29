document.getElementById('company-dropdown').addEventListener('change', function () {
    const symbol = this.value;
    fetch(`/api/dropdown/${symbol}`)
        .then(response => response.json())
        .then(data => {
            const infoDiv = document.getElementById('company-info');
            infoDiv.innerHTML = `
                <p><strong>Company:</strong> ${data['Company Name']}</p>
                <p><strong>City:</strong> ${data['City']}</p>
                <p><strong>State:</strong> ${data['State']}</p>
                <p><strong>Country:</strong> ${data['Country']}</p>                                
                <p><strong>Sector:</strong> ${data['Sector']}</p>
                <p><strong>Industry:</strong> ${data['Industry']}</p>                
                <p><strong>Employees:</strong> ${data['Fulltime Employees']}</p>
                <p><strong>Business Summary:</strong> ${data['Business Summary']}</p>
            `;
        });
});
