let content = document.querySelector(".content");
let audio = document.querySelector(".ayah_audio");
let prev = document.querySelector(".prev");
let playBtn = document.getElementById("playBtn");
let next = document.querySelector(".next");
let ayahText = document.querySelector(".ayah_text");

async function getAndDisplayData() {
  try {
    let response = await fetch("https://api.alquran.cloud/v1/surah")
    if(!response.ok) {
      throw new Error("We Cant Get The Response")
    } else {
      let data = await response.json();
      let fainalData = data.data
      return fainalData
    }
  } catch(err) {
    console.log(`We Are Faild ${err}`);
    content.innerHTML = `مش عارف اجيب البيانات تقريبا كده فيه مشكلة حاول في وقت تاني`
  }
}

getAndDisplayData()
.then((fainalData) => {
  fainalData.forEach(el => {
    content.innerHTML += `
    <div class="sorah ${el.englishName}">
    <span class="sorah_count">${el.number}</span>
    <div class="sorah_name">
      <div class="arabic_name">${el.name}</div>
      <div class="english_name">${el.englishName}</div>
    </div>
    <span class="ayah_count">${el.numberOfAyahs}</span>
  </div>
    `
  });
  getSorah()
})


function getSorah() {
  let AyahsAudios, AyahsText;
  let allSorahs = document.querySelectorAll(".sorah").forEach((ele) => {
    ele.addEventListener("click", (e) => {
      window.scrollTo(0,0)
      fetch(`https://api.alquran.cloud/v1/surah/${ele.childNodes[1].innerHTML}/ar.alafasy`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let verses = data.data.ayahs;
        AyahsAudios = [];
        AyahsText = [];
        for(let i = 0; i < verses.length; i++) {
          AyahsAudios.push(verses[i].audio)
          AyahsText.push(verses[i].text)
        }
        let ayahIndex = 0;
        changeAyah(ayahIndex)
        audio.addEventListener("ended", () => {
          ayahIndex++;
          if (ayahIndex < AyahsAudios.length) {
            changeAyah(ayahIndex)
          } else {
            ayahIndex = 0;
            changeAyah(ayahIndex)
            audio.pause()
            Swal.fire(
              'عاش',
              '♥ انك سمعت السورة',
              'success'
            )
            isPlay = true;
            togglePlay()
          }
        });
        // Handel Next Button
        next.addEventListener("click", (e) => {
          ayahIndex++
          if (ayahIndex < AyahsAudios.length) {
            changeAyah(ayahIndex)
            isPlay = false;
            togglePlay()
          } else {
            ayahIndex = 0;
            changeAyah(ayahIndex)
            audio.pause()
            Swal.fire(
              'عاش',
              '♥ انك سمعت السورة',
              'success'
            )
            isPlay = true;
            togglePlay()
          }
        });
         // Handel Prev Button
        prev.addEventListener("click", (e) => {
          ayahIndex--
          if (ayahIndex < AyahsAudios.length) {
            changeAyah(ayahIndex)
            isPlay = false;
            togglePlay()
            if (ayahIndex === -1) {
              ayahIndex = 0;
              changeAyah(ayahIndex)
              audio.pause()
              isPlay = true;
              togglePlay()
            }
          }
        });

        // Handel Play Button
        let isPlay = false;
        togglePlay()
        function togglePlay() {
          if (isPlay) {
            audio.pause()
            playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`
            isPlay = false
          } else {
            audio.play()
            playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`
            isPlay = true;
          }
        }

        playBtn.addEventListener("click", togglePlay);

        function changeAyah(index) {
          audio.src = AyahsAudios[index]
          ayahText.innerHTML = AyahsText[index]
        }
      })
    });
  })
}