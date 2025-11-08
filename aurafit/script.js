let url = " https://catfact.ninja/breeds"
let ul =document.querySelector("#rafi")
let ol =document.querySelector("#rafi2")
fetch(url).then((response)=> {
    response.json().then((data) =>{
        data.data.forEach((el) => {
            let li = document.createElement("li") //dynamic creation
            let ad = document.createElement("li")   
            li.innerHTML =el.breed
            ad.innerHTML =el.country   
            li.style.color="brown"
            ul.appendChild(li)
           ol.appendChild(ad)
        });
    })
})