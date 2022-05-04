let slider = document.getElementById("lineWidth");
let valSpan = document.getElementById("lineWidthDisplay");

slider.oninput = () => {
    valSpan.innerHTML = slider.value;
};