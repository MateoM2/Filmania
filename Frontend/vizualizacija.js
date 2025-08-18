document.addEventListener('DOMContentLoaded', () => {

    const podatci = async () => {
        try {
            const fotografiResponse = await fetch('http://localhost:8000/api/fotografi');
            const zahtjeviResponse = await fetch('http://localhost:8000/api/zahtjevi');

            if (!fotografiResponse.ok || !zahtjeviResponse.ok) {
                throw new Error('Greška pri dohvaćanju podataka za vizualizaciju.');
            }
            
            const fotografi = await fotografiResponse.json();
            const zahtjevi = await zahtjeviResponse.json();

            
            createZahtjeviBarChart(fotografi, zahtjevi);

           
            createDogadajiPieChart(zahtjevi);

        } catch (error) {
            console.error('Greška pri vizualizaciji podataka:', error);
            document.querySelector('main').innerHTML = '<p class="text-danger">Ne mogu učitati podatke za grafikone.</p>';
        }
    };

    
    const createZahtjeviBarChart = (fotografi, zahtjevi) => {
        const zahtjeviPoFotografu = {};
        fotografi.forEach(f => zahtjeviPoFotografu[f.id] = { ime: `${f.Ime} ${f.Prezime}`, count: 0 });
        zahtjevi.forEach(z => {
            if (zahtjeviPoFotografu[z.fotograf]) {
                zahtjeviPoFotografu[z.fotograf].count++;
            }
        });

        const labels = Object.values(zahtjeviPoFotografu).map(f => f.ime);
        const data = Object.values(zahtjeviPoFotografu).map(f => f.count);

        new Chart(document.getElementById('zahtjeviBarChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Broj zahtjeva',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Broj zahtjeva'
                        }
                    }
                }
            }
        });
    };

    
    const createDogadajiPieChart = (zahtjevi) => {
        const dogadajiCount = {};
        zahtjevi.forEach(z => {
            const dogadaj = z.Dogadaj || 'Nepoznato';
            dogadajiCount[dogadaj] = (dogadajiCount[dogadaj] || 0) + 1;
        });

        const labels = Object.keys(dogadajiCount);
        const data = Object.values(dogadajiCount);

        const backgroundColors = [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
        ];

        new Chart(document.getElementById('dogadajiPieChart'), {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
            }
        });
    };

    podatci();
});