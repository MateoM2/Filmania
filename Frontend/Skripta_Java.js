document.addEventListener('DOMContentLoaded', () => {
    const fotografiContainer = document.getElementById('fotografi-container');
    const fotografSelect = document.getElementById('fotograf-id');
    const zahtjevForm = document.getElementById('zahtjev-form');
    const zahtjeviContainer = document.getElementById('zahtjevi-container');
    const gradFilterSelect = document.getElementById('grad-filter');
    let sviFotografi = []; 

    
    const fetchFotografi = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/fotografi');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            sviFotografi = await response.json();
            displayFotografi(sviFotografi);
            populateFotografSelect(sviFotografi);
            populateGradFilter(sviFotografi);
        } catch (error) {
            console.error('Došlo je do greške prilikom dohvaćanja fotografa:', error);
            fotografiContainer.innerHTML = '<p class="text-danger">Ne mogu dohvatiti listu fotografa. Pokušajte ponovno kasnije.</p>';
        }
    };

    
    const displayFotografi = (fotografi) => {
        fotografiContainer.innerHTML = '';
        if (fotografi.length === 0) {
            fotografiContainer.innerHTML = '<p>Trenutno nema dostupnih fotografa.</p>';
            return;
        }
        fotografi.forEach(fotograf => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="fotograf-card">
                    <h3>${fotograf.Ime} ${fotograf.Prezime} (${fotograf.naziv})</h3>
                    <p><strong>Grad:</strong> ${fotograf.Grad}</p>
                    <p><strong>Opis:</strong> ${fotograf.Opis || 'Nema opisa.'}</p>
                    <p><strong>Cijena po slici:</strong> ${fotograf.Cijena_po_slici} €</p>
                </div>
            `;
            fotografiContainer.appendChild(card);
        });
    };

   
    const populateFotografSelect = (fotografi) => {
        fotografSelect.innerHTML = '';
        if (fotografi.length > 0) {
            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = '--- Odaberi fotografa ---';
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            fotografSelect.appendChild(placeholderOption);

            fotografi.forEach(fotograf => {
                const option = document.createElement('option');
                option.value = fotograf.id;
                option.textContent = `${fotograf.Ime} ${fotograf.Prezime} (${fotograf.Grad})`;
                fotografSelect.appendChild(option);
            });
        }
    };

    const populateGradFilter = (fotografi) => {
        const gradovi = [...new Set(fotografi.map(f => f.Grad))];
        gradovi.sort(); 
        gradovi.forEach(grad => {
            const option = document.createElement('option');
            option.value = grad;
            option.textContent = grad;
            gradFilterSelect.appendChild(option);
        });
    };

   
    gradFilterSelect.addEventListener('change', (event) => {
        const selectedGrad = event.target.value;
        if (selectedGrad === 'svi') {
            displayFotografi(sviFotografi);
        } else {
            const filtriraniFotografi = sviFotografi.filter(f => f.Grad === selectedGrad);
            displayFotografi(filtriraniFotografi);
        }
    });

    const fetchZahtjevi = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/zahtjevi');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const zahtjevi = await response.json();
            displayZahtjevi(zahtjevi);
        } catch (error) {
            console.error('Došlo je do greške prilikom dohvaćanja zahtjeva:', error);
            zahtjeviContainer.innerHTML = '<p class="text-danger">Ne mogu dohvatiti listu zahtjeva. Pokušajte ponovno kasnije.</p>';
        }
    };

   
    const displayZahtjevi = (zahtjevi) => {
        zahtjeviContainer.innerHTML = '';
        if (zahtjevi.length === 0) {
            zahtjeviContainer.innerHTML = '<p>Trenutno nema poslanih zahtjeva.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'list-group';

        zahtjevi.forEach(zahtjev => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <strong>Fotograf:</strong> ${zahtjev.fotograf_ime}<br>
                    <strong>Datum:</strong> ${zahtjev.Datum_radnje}<br>
                    <strong>Količina slika:</strong> ${zahtjev.Kolicina_slika}<br>
                    <strong>Događaj:</strong> ${zahtjev.Dogadaj}
                </div>
                <div>
                    <button class="btn btn-warning btn-sm me-2" onclick="editZahtjev(${zahtjev.id}, '${zahtjev.Datum_radnje}', ${zahtjev.Kolicina_slika}, '${zahtjev.Dogadaj}')">Izmijeni</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteZahtjev(${zahtjev.id})">Obriši</button>
                </div>
            `;
            ul.appendChild(li);
        });
        zahtjeviContainer.appendChild(ul);
    };

    
    window.deleteZahtjev = async (id) => {
        if (confirm('Jeste li sigurni da želite obrisati ovaj zahtjev?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/zahtjevi/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
                }
                
                alert('Zahtjev je uspješno obrisan.');
                fetchZahtjevi();
            } catch (error) {
                console.error('Greška prilikom brisanja zahtjeva:', error);
                alert(`Greška: ${error.message}`);
            }
        }
    };

    window.editZahtjev = async (id, datum, kolicina, dogadaj) => {
        const newDatum = prompt('Unesite novi datum radnje:', datum);
        if (newDatum === null) return;

        const newKolicina = prompt('Unesite novu količinu slika:', kolicina);
        if (newKolicina === null) return;
        
        const newDogadaj = prompt('Unesite novi događaj:', dogadaj);
        if (newDogadaj === null) return;

        try {
            const response = await fetch(`http://localhost:8000/api/zahtjevi/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Datum_radnje: newDatum,
                    Kolicina_slika: parseInt(newKolicina),
                    Dogadaj: newDogadaj
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }
            
            alert('Zahtjev je uspješno ažuriran.');
            fetchZahtjevi();
        } catch (error) {
            console.error('Greška prilikom ažuriranja zahtjeva:', error);
            alert(`Greška: ${error.message}`);
        }
    };

    
    zahtjevForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(zahtjevForm);
        const data = Object.fromEntries(formData.entries());
        data['id_fotografa'] = parseInt(data['id_fotografa']);

        try {
            const response = await fetch('http://localhost:8000/api/zahtjevi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            alert(`Uspjeh: ${result.message}`);
            zahtjevForm.reset();
            fetchZahtjevi();
        } catch (error) {
            console.error('Greška prilikom slanja zahtjeva:', error);
            alert(`Greška: ${error.message}`);
        }
    });

    
    fetchFotografi();
    fetchZahtjevi();
});