//Arrays para as entradas de origens e destinos
var origins = [];
var destinations = [];

// Parâmetros iniciais da consulta
var query = {
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC
};
// Serviço de Matriz de Distância do Google
var dms;
// Valores de intervalo e limite para rastrear agrupamentos de origens (para permanecer dentro de QUERY_LIMIT)
var originsInterval = 0;
var originsLimit;

// Limite de consulta - 100 é o limite de consulta não-premier a partir desta atualização
var QUERY_LIMIT = 100;

var grafo = [];			// Variavel que cointem a lista de adjacências do grafo.
var path = [];			// Menor Caminho
var visatados = [];			// Visatados Array
var dist = 0;				// Distância percorrida
var nomesLugares = [];      // Array contendo o nomes dos lugares

function floyd(rows) {
    for (var i = 0; i < rows.length; i++) { //Seta a matriz de grafo com valores infinitos
        grafo.push([]);
        for (var j = 0; j < rows[i].elements.length; j++)
            grafo[i].push(i == j ? 0 : Infinity);
    }

    for (var i = 0; i < rows.length; i++) {					//Preenhecer grafo da Matriz de Distância da API do Google
        for (var j = 0; j < rows[i].elements.length; j++)
            if (rows[i].elements[j].status == "OK") {
                grafo[i][j] = rows[i].elements[j].distance.value;
            }
    }
    // Imprime a matriz resultante
    console.log("Matriz Original:");
    for (var i = 0; i < grafo.length; i++) {
        console.log(grafo[i].join("\t"));
    }

    for (var k = 0; k < rows.length; k++) {					// ALgoritmo de Floyd-Warshall
        for (var i = 0; i < rows.length; i++) {
            for (var j = 0; j < rows.length; j++) {
                if (grafo[i][k] + grafo[k][j] < grafo[i][j]) {
                    grafo[i][j] = grafo[i][k] + grafo[k][j];
                }
            }
        }
    }
    // Imprime a matriz resultante
    console.log("Matriz resultante após Floyd-Warshall:");
    for (var i = 0; i < grafo.length; i++) {
        console.log(grafo[i].join("\t"));
    }

    path.push(0);										//Inicie o caminho empurrando o nó de origem
    menorCaminho(grafo.length);						    // chamada da função menorCaminho
    var solution = "<b>ORIGEM: </b>" + nomesLugares[0] + "\n";
    for (var i = 1; i < path.length - 1; i++) {
        solution += "<b>PONTO " + path[i] + ": </b>" + nomesLugares[path[i]] + "\n";
    }
    solution += "<b>DESTINO: </b>" + nomesLugares[0];
    // Substituir \n por <br> para exibir no HTML corretamente
    solution = solution.replace(/\n/g, "<br>");							//Solução de impressão
    document.getElementById("solucao").innerHTML = "<b>O caminho ideal é:</b>" + "<br>" + solution + "<br><b>" + "Distância percorrida" + "</b><br>" + dist / 1000 + " Km";
}



function menorCaminho(n) { //// Função que atravessa o APSP criado e obtém o caminho ideal de acordo

    if (n == 1) {  //Verifica se resta apenas um destino não vistotado
        dist += grafo[path[path.length - 1]][0];		// Adiciona distância do destino final até a origem
        path.push(0);								//Adiciona fonte como último nó
        return;
    }


    var minDestination;				// Rastreia o destino mínimo
    var temp = Infinity;

    for (var j = 0; j < grafo.length; j++) { // Percorre o grafo
        if (j == 0 || visatados[j])			// Continuação do nó é nó fonte ou está visados
            continue;
        if (grafo[path[path.length - 1]][j] < temp) {  // Verifica minimizar distância
            temp = grafo[path[path.length - 1]][j];
            minDestination = j;
        }
    }


    visatados[minDestination] = 1;
    path.push(minDestination);
    dist += temp;
    menorCaminho(--n);
}

function updateMatrix() {
    updateQuery();
    dms.getDistanceMatrix(query, function (response, status) {
        if (status == "OK") {
            populateTable(response.rows);

            floyd(response.rows);
        } else {
            alert("Houve um problema com o pedido. O erro relatado é '" + status + "'");
        }
    }
    );
}

/*
 * Gera uma tabela no elemento 'matrix' para preencher os resultados do dms
 */
function createTable() {
    var table = document.getElementById("matriz");
    document.getElementById("matriz").caption.innerHTML = "Matriz de Distância";
    var tr = addRow(table);
    addElement(tr);
    for (var j = 0; j < destinations.length; j++) {
        var td = addElement(tr);
        td.setAttribute("class", "destination");
        if (j == 0)
            td.appendChild(document.createTextNode("ORIGEM"));
        else
            td.appendChild(document.createTextNode("PONTO " + j));
    }

    for (var i = 0; i < origins.length; i++) {
        var tr = addRow(table);
        var td = addElement(tr);
        td.setAttribute("class", "origin");
        if (i == 0)
            td.appendChild(document.createTextNode("ORIGEM"));
        else
            td.appendChild(document.createTextNode("PONTO " + i));
        for (var j = 0; j < destinations.length; j++) {
            var td = addElement(tr, 'element-' + i + '-' + j);
        }
    }
}

/*
 * Recupera origens e destinos de textareas e
 * determina como construir a matriz inteira dentro das limitações de consulta
 */
function getInputs() {
    var originsString = document.getElementById('origens').value;
    var destinationsString = document.getElementById('origens').value;

    origins = originsString.split("\n").map(function(line) {
        return line.split(" : ")[1] || line.split(": ")[1] || line.split(":")[1];
    });
    destinations = destinationsString.split("\n").map(function(line) {
        return line.split(" : ")[1] || line.split(": ")[1] || line.split(":")[1];
    });

    for (var i = 0; i < origins.length; i++) {
        nomesLugares[i] = origins[i];
    }

    query.destinations = destinations;
    originsLimit = Math.floor(QUERY_LIMIT / destinations.length);
    if (originsLimit > 25) {
        originsLimit = 25;
    }
}

/*
 * Atualiza a consulta com base nos tamanhos conhecidos de origens e destinos
 */
function updateQuery() {
    if (origins.length * destinations.length < QUERY_LIMIT && originsLimit < 25) {
        query.origins = origins;
        originsInterval = 1;
    } else {
        query.origins = origins.slice(originsLimit * originsInterval, originsLimit * (originsInterval + 1));
        originsInterval++;
    }
}

/*
 * Inicializa os dados da matriz e extrai o primeiro conjunto de quase 100 resultados
 */
function matrixInit() {
    dms = new google.maps.DistanceMatrixService();
    getInputs();
    createTable();
    updateMatrix();

}

/*
 * Aceita linhas e preenche o conteúdo da tabela. A validação do erro é limitada a "ZERO_RESULTS"
 * status de retorno. O limite de origens e o intervalo de origens são usados ​​para encontrar a célula correta da tabela.
 */
function populateTable(rows) {
    var elementX;
    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < rows[i].elements.length; j++) {
            elementX = originsLimit * (originsInterval - 1) + i;
            if (rows[i].elements[j].status != "ZERO_RESULTS") {
                var distance = rows[i].elements[j].distance.text;
                var duration = rows[i].elements[j].duration.text;
                var td = document.getElementById('element-' + elementX + '-' + j);
                td.innerHTML = distance + "<br />" + duration;
            } else {
                var td = document.getElementById('element-' + elementX + '-' + j);
                td.innerHTML = "Nenhum resultado disponível," + "<br />" + "Verifique sua localização.";
            }
        }
    }


}

/*
 * Atualiza o parâmetro de consulta para unitSystem quando a opção de seleção de unidade é alterada
 */
function updateUnits() {
    switch (document.getElementById("unidades").value) {
        case "km":
            query.unitSystem = google.maps.UnitSystem.METRIC;
            break;
        case "mi":
            query.unitSystem = google.maps.UnitSystem.IMPERIAL;
            break;
    }
    updateMatrix();
}

/*
 * Adiciona uma linha ao elemento de tabela fornecido
 */
function addRow(table) {
    var tr = document.createElement('tr');
    table.appendChild(tr);
    return tr;
}

/*
 * Adiciona uma célula com o ID fornecido à linha fornecida
 */
function addElement(tr, id) {
    var td = document.createElement('td');
    if (id) {
        td.setAttribute('id', id);
    }
    tr.appendChild(td);
    return td;
}

/*
 * Limpa a tabela de resultados e redefine os estados dos botões
 */
function clearTable() {
    location.reload();
}

/*
 * Mostra/oculta instruções quando o link é clicado.
 */
function instructionsShowHide() {
    var instructions = document.getElementById('instructions');
    var instructionsLink = document.getElementById('instructionsLink');
    if (instructions.style.display == "none") {
        instructions.style.display = "block";
        instructionsLink.innerHTML = "Hide Instructions";
    } else {
        instructions.style.display = "none";
        instructionsLink.innerHTML = "Show Instructions";
    }

}