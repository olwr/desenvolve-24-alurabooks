// API
let books = [];
let discountedBooks = [];
const endpointAPI = 'https://guilhermeonrails.github.io/casadocodigo/livros.json';

// Element
const booksSection = document.querySelector('#livros');
const filterButtons = document.querySelectorAll('.btn');
const availableBooksPrice = document.querySelector('#valor_total_livros_disponiveis');

getSearchBooksAPI();

// Functions
async function getSearchBooksAPI() {
    const res = await fetch(endpointAPI);
    books = await res.json();

    // console.table(books);
    discountedBooks = discounting(books);
    showBooks(discountedBooks);
};

// forEach
function showBooks(books) {
    booksSection.innerHTML = '';
    availableBooksPrice.innerHTML = '';
    books.forEach(book => {
        let availability = book.quantidade > 0 ? 'livro__imagens' : 'livro__imagens indisponivel';
        booksSection.innerHTML += `
        <div class="livro">
            <img class="${availability}" src="${book.imagem}"
                alt="${book.alt}" />
            <h2 class="livro__titulo">
                ${book.titulo}
            </h2>
            <p class="livro__descricao">${book.autor}</p>
            <p class="livro__preco" id="preco">R$ ${book.preco.toFixed(2)}</p>
            <div class="tags">
                <span class="tag">${book.categoria}</span>
            </div>
        </div>
        `;
    });
};

filterButtons.forEach(btn => btn.addEventListener('click', filterBooks));
filterButtons.forEach(btn => btn.addEventListener('click', sortBooks));

// map
function discounting(book) {
    const discount = 0.3;

    discountedBooks = books.map(book => {
        return {...book, preco: book.preco - (book.preco * discount)};
    });

    return discountedBooks;
};

// filter
function filterBooks() {
    const elementBtn = document.getElementById(this.id);
    const category = elementBtn.value;
    console.log(category);
    
    let filteredBooks = category == 'disponivel' ? filterAvailability() : filterCategory(category);

    showBooks(filteredBooks);

    if (category == 'disponivel') {
        const totalValue = sumPrices(discountedBooks);
        showAvailableBooksPrice(totalValue);
    };
};


function filterCategory(category) {
    return discountedBooks.filter(book => book.categoria === category);
};

function filterAvailability() {
    return discountedBooks.filter(book => book.quantidade > 0);
};

function showAvailableBooksPrice(totalValue) {
    availableBooksPrice.innerHTML = `
    <div class="livros__disponiveis">
    <p>Todos os livros disponíveis por R$ <span id="valor">${totalValue}</span></p>
    </div>
    `
};

// sort
function sortBooks() {
    const elementBtn = document.getElementById(this.id);
    console.log(typeof(elementBtn.id));

    if (elementBtn.id == 'btnOrdenarPorPreco') {
        let sortedBooks = discountedBooks.sort((a, b) => 
            a.preco - b.preco
        );
        showBooks(sortedBooks);
    };
};

// reduce
function sumPrices(books) {
    return books.reduce((acc, book) => acc + book.preco, 0).toFixed(2);
};