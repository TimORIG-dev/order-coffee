const modal = document.getElementById('modal');
const form = document.getElementById('coffeeForm');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = collectOrderData();
    const count = data.length;

    const modalContent = document.querySelector('.modal-content');

    modalContent.innerHTML = `
        <button type="button" class="modal-close">✕</button>
        <p>Вы заказали ${count} ${getDrinkWord(count)}</p>
        ${buildTable(data)}
    `;

    modal.classList.add('active');

    modalContent.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
    });
});
const container = document.getElementById('beveragesContainer');
const addButton = document.querySelector('.add-button');

function updateNumbers() {
    const beverages = document.querySelectorAll('.beverage');

    beverages.forEach((beverage, index) => {
        const title = beverage.querySelector('.beverage-count');
        title.textContent = `Напиток №${index + 1}`;

        const deleteBtn = beverage.querySelector('.delete-button');

        deleteBtn.style.display = beverages.length > 1 ? 'inline-block' : 'none';
    });
}

function addDeleteHandler(beverage) {
    const deleteBtn = beverage.querySelector('.delete-button');

    deleteBtn.addEventListener('click', () => {
        const beverages = document.querySelectorAll('.beverage');

        if (beverages.length > 1) {
            beverage.remove();
            updateNumbers();
        }
    });
}

function addBeverage() {
    const template = document.querySelector('.beverage');
    const newBeverage = template.cloneNode(true);

    newBeverage.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    const index = document.querySelectorAll('.beverage').length;

    newBeverage.querySelectorAll('input[type="radio"]').forEach(rb => {
        rb.name = `milk-${index}`;
    });
    const radios = newBeverage.querySelectorAll('input[type="radio"]');
    if (radios.length) radios[0].checked = true;

    container.appendChild(newBeverage);

    addDeleteHandler(newBeverage);
    updateNumbers();
}
document.querySelectorAll('.beverage').forEach(addDeleteHandler);
updateNumbers();

addButton.addEventListener('click', addBeverage);

const closeModalBtn = document.querySelector('.modal-close');

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

function getDrinkWord(n) {
    const mod10 = n % 10;
    const mod100 = n % 100;

    if (mod100 >= 11 && mod100 <= 14) return 'напитков';
    if (mod10 === 1) return 'напиток';
    if (mod10 >= 2 && mod10 <= 4) return 'напитка';
    return 'напитков';
}

function collectOrderData() {
    const beverages = document.querySelectorAll('.beverage');

    return Array.from(beverages).map(bev => {
        const drinkSelect = bev.querySelector('select');
        const drink = drinkSelect.options[drinkSelect.selectedIndex].text;

        const checkedMilk = bev.querySelector('input[type="radio"]:checked');

        const milk = checkedMilk
            ? checkedMilk.closest('label').querySelector('span').textContent
            : 'не выбрано';

        const additions = Array.from(
            bev.querySelectorAll('input[type="checkbox"]:checked')
        ).map(cb =>
            cb.closest('label').querySelector('span').textContent
        );

        return {
            drink,
            milk,
            additions: additions.join(', ')
        };
    });
}

function buildTable(data) {
    let rows = `
        <tr>
            <th>Напиток</th>
            <th>Молоко</th>
            <th>Дополнительно</th>
        </tr>
    `;

    data.forEach(item => {
        rows += `
            <tr>
                <td>${item.drink}</td>
                <td>${item.milk}</td>
                <td>${item.additions || '-'}</td>
            </tr>
        `;
    });

    return `<table border="1" cellpadding="5" cellspacing="0">${rows}</table>`;
}