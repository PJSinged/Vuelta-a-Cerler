/* 
  script.js
  - Manejo de checks, contadores y barra de progreso
  - Acordeón
  - Navegación anclada que expande la Fase correspondiente al hacer clic
  - Botón para reiniciar progreso
*/

document.addEventListener("DOMContentLoaded", function() {

    /* --------- CHECKBOXES / PROGRESO --------- */
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const totalPhases = 6;
  
    // Restaurar checks desde localStorage
    checkboxes.forEach(checkbox => {
      const fase = checkbox.getAttribute("data-fase");
      const dia = checkbox.getAttribute("data-dia");
      const key = "fase" + fase + "_dia" + dia;
      const isChecked = localStorage.getItem(key) === "true";
  
      if(isChecked) {
        checkbox.checked = true;
        highlightRow(checkbox);
      }
  
      checkbox.addEventListener("change", function() {
        localStorage.setItem(key, checkbox.checked);
        highlightRow(checkbox);
        actualizarContador(fase);
        actualizarProgresoGlobal();
      });
    });
  
    // Inicializar contadores
    for(let f = 1; f <= totalPhases; f++) {
      actualizarContador(f);
    }
  
    // Inicializar progreso global
    actualizarProgresoGlobal();
  
    // Resaltar fila completada
    function highlightRow(checkbox) {
      const row = checkbox.closest("tr");
      if(checkbox.checked) {
        row.classList.add("fila-completada");
      } else {
        row.classList.remove("fila-completada");
      }
    }
  
    // Actualizar contador por fase
    function actualizarContador(numFase) {
      const inputsFase = document.querySelectorAll(`input[data-fase="${numFase}"]`);
      let completados = 0;
      inputsFase.forEach(chk => {
        if(chk.checked) completados++;
      });
      const contadorFase = document.getElementById(`contador-fase${numFase}`);
      if(contadorFase) {
        contadorFase.textContent = `Completados: ${completados} / ${inputsFase.length}`;
      }
    }
  
    // Actualizar barra de progreso global
    function actualizarProgresoGlobal() {
      const progressBar = document.getElementById("globalProgressBar");
      const progressText = document.getElementById("progress-text");
      const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
      
      let checkedCount = 0;
      allCheckboxes.forEach(chk => {
        if(chk.checked) checkedCount++;
      });
      const total = allCheckboxes.length;
      const porcentaje = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
  
      progressBar.style.width = porcentaje + "%";
      progressText.textContent = porcentaje + "%";
    }
  
  
    /* --------- ACORDEÓN --------- */
    const accordionButtons = document.querySelectorAll(".accordion-button");
    accordionButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        const content = btn.nextElementSibling;
        const isExpanded = btn.getAttribute("aria-expanded") === "true";
  
        // Cerrar todos los demás
        accordionButtons.forEach(b => {
          if(b !== btn) {
            b.setAttribute("aria-expanded", "false");
            b.nextElementSibling.style.display = "none";
            b.nextElementSibling.setAttribute("aria-hidden", "true");
          }
        });
  
        // Alternar el actual
        if(!isExpanded) {
          btn.setAttribute("aria-expanded", "true");
          content.style.display = "block";
          content.setAttribute("aria-hidden", "false");
          // Desplazamiento suave
          content.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          btn.setAttribute("aria-expanded", "false");
          content.style.display = "none";
          content.setAttribute("aria-hidden", "true");
        }
      });
    });
  
  
    /* --------- NAVEGACIÓN POR FASE --------- */
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const faseNumber = link.getAttribute('data-fase');
        const targetButton = document.querySelector(`.accordion-button + #fase${faseNumber}`).previousElementSibling;
        const accordionContent = document.getElementById(`fase${faseNumber}`);
  
        // Cerrar otros
        accordionButtons.forEach(b => {
          if(b !== targetButton) {
            b.setAttribute("aria-expanded", "false");
            b.nextElementSibling.style.display = "none";
            b.nextElementSibling.setAttribute("aria-hidden", "true");
          }
        });
  
        // Expandir la fase objetivo
        targetButton.setAttribute("aria-expanded", "true");
        accordionContent.style.display = "block";
        accordionContent.setAttribute("aria-hidden", "false");
  
        // Scroll hacia la fase
        accordionContent.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  
  
    /* --------- BOTÓN REINICIAR PROGRESO --------- */
    const resetButton = document.getElementById('resetProgress');
    if(resetButton){
      resetButton.addEventListener('click', function() {
        // Limpia todo el localStorage relacionado con checkboxes
        checkboxes.forEach(checkbox => {
          const fase = checkbox.getAttribute("data-fase");
          const dia = checkbox.getAttribute("data-dia");
          const key = "fase" + fase + "_dia" + dia;
          localStorage.removeItem(key);
          checkbox.checked = false;
          highlightRow(checkbox);
        });
        // Actualiza contadores y progreso
        for(let f = 1; f <= totalPhases; f++) {
          actualizarContador(f);
        }
        actualizarProgresoGlobal();
        alert("Progreso reiniciado. ¡Puedes comenzar de nuevo!");
      });
    }
  
  });
  