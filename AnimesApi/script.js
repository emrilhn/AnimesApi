let currentPage = 1; // Başlangıçta 1. sayfadayız
let totalPages = 1;  // Toplam sayfa sayısı (API'den çekildikten sonra güncellenecek)

// API'den veri çekme fonksiyonu
const fetchAnimeData = async (page = 1) => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);
    const apidata = await response.json();
    console.log(apidata);
    const animeList = apidata.data;
   
    
    // Toplam sayfa sayısını API'den çek
    totalPages = apidata.pagination.last_visible_page;

    // Anime listesini ekrana bas
    displayAnime(animeList);

    // Sayfa numarasını ve toplam sayfa sayısını güncelle
    document.getElementById('current-page').textContent = `Sayfa: ${page} / ${totalPages}`;
  } catch (error) {
    console.error("Veri çekilemedi:", error);
  }
};

// Anime kartlarını ekrana basma fonksiyonu
const displayAnime = (animeList) => {
  
  const animeContainer = document.getElementById('anime-list');
  animeContainer.innerHTML = ''; // Önce mevcut listeyi temizle

  animeList.forEach(anime => {
    const broadcastString = anime.broadcast.string ?? "Unknown";
    const animeCard = `
      <div class="col-md-3 mb-4 ">
        <div class="card text-center">
          <img src="${anime.images.jpg.image_url}" class="card-img-top" alt="${anime.title}">
          <div class="card-body">
            <h5 class="card-title">${anime.title}</h5>
            <p class="card-text">Skor: ${anime.score}</p>
            <p class="card-text">Publication Date: ${broadcastString}</p>
          </div>
        </div>
      </div>
    `;
    animeContainer.innerHTML += animeCard;
  });
};

// İlk sayfa verilerini çek
fetchAnimeData(currentPage);

// İleri butonuna tıklama olayı
document.getElementById('next-btn').addEventListener('click', () => {
  if (currentPage < totalPages) {  // Eğer son sayfada değilsek
    currentPage++;
    fetchAnimeData(currentPage);// Bir sonraki sayfayı çek
    window.scrollTo(0, 0);  
  }
});

// Geri butonuna tıklama olayı
document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentPage > 1) {  //1. sayfanın altına inmemek için
    currentPage--;
    fetchAnimeData(currentPage); // Bir önceki sayfayı çek
    window.scrollTo(0, 0);// Sayfa değiştikten sonra yukarı kaydır
  }
});

// Sayfa numarası girilerek gitme olayı
document.getElementById('go-to-page-btn').addEventListener('click', () => {
  const pageInput = document.getElementById('page-input').value;
  const pageNumber = parseInt(pageInput, 10);

  // Girilen sayfa numarasının geçerli olup olmadığını kontrol edin
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    currentPage = pageNumber;
    fetchAnimeData(currentPage);
    window.scrollTo(0, 0);  // Sayfa değiştikten sonra yukarı kaydır
  } else {
    alert(`Lütfen 1 ile ${totalPages} arasında bir sayfa numarası girin.`);
  }
});