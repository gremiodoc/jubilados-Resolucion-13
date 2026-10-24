(function(){
  var DATA = window.JUBILADOS || {};
  var TIPOS = {D:"D (Docente)", O:"O (Obrero)", A:"A (Administrativo)"};
  var $ = function(id){return document.getElementById(id);};

  function limpiar(v){ return String(v).replace(/\D/g,"").replace(/^0+/,""); }
  function formatear(n){ return n.replace(/\B(?=(\d{3})+(?!\d))/g,"."); }

  // Formato automático con puntos mientras se escribe
  function autoformato(inp){
    inp.addEventListener("input", function(){
      var n = limpiar(inp.value).slice(0,9);
      inp.value = n ? formatear(n) : "";
    });
  }

  function consultar(valor, origen){
    var err = $("error"); err.hidden = true;
    var n = limpiar(valor);
    if(n.length < 4){
      err.textContent = "Por favor escribe un número de cédula válido.";
      err.hidden = false; return;
    }
    var t = DATA[n];
    $("resultado").hidden = false;
    $("ok").hidden = !t; $("no").hidden = !!t;
    if(t){ $("tipo").textContent = TIPOS[t] || t; }
    else { $("ced-no").textContent = formatear(n); }
    $("cedula").value = formatear(n);
    $("cedula2").value = "";
    $("resultado").scrollIntoView({behavior:"smooth",block:"nearest"});
    if(origen===2) $("cedula2").focus();
  }

  $("form").addEventListener("submit", function(e){ e.preventDefault(); consultar($("cedula").value,1); });
  $("form2").addEventListener("submit", function(e){
    e.preventDefault();
    if($("cedula2").value.trim()) { $("cedula").value=$("cedula2").value; consultar($("cedula2").value,2); }
  });
  autoformato($("cedula")); autoformato($("cedula2"));
})();
