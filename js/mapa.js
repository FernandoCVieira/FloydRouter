var geocoder;
var mapa;
var marker;
var bounds;
var service;
var directionsService;
var directionsRenderer
var routingList = [];
var listMarcadores = [];

var autoComplete;

var places = [];
var matrizDistancia = [];
var iteracoesPorLinha;
var iteration;
var numLines;
var curLine;

function initMapa(idMapa, idAutoComplete) {
    try {
        if (idMapa === null || idAutoComplete === null) {
            window.alert("Id do mapa e input não foram encotrado!");
            return;
        }
        //inicializa o serviço para cálculo de rotas para impressão
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();

        //Posição Atual
        var posicaoAtual = { lat: -5.79448, lng: -35.211 };
        var opcaoMapa = {
            zoom: 14,
            center: posicaoAtual,
            mapTypeId: google.maps.MapTypeId.ROADMAP //road map
        };

        //inicializa a instância do mapa e a seleção do div
        mapa = new google.maps.Map(idMapa, opcaoMapa);

        // inicializa o marcador de posição temporário
        directionsRenderer.setMap(mapa);

        const opcaoAuto = {
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
        };

        autoComplete = new google.maps.places.Autocomplete(idAutoComplete, opcaoAuto);

        autoComplete.addListener("place_changed", () => {
            const place = autoComplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                // O usuário digitou o nome de um Local que não foi sugerido e
                // pressionou a tecla Enter ou a solicitação de detalhes do local falhou.
                window.alert("Nenhum detalhe disponível para entrada: '" + place.name + "'");
                return;
            }
            //marker.setPosition(place.geometry.location);
            mapa.setCenter(place.geometry.location);
            mapa.setZoom(15);
            places.push({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
            addMarcador(place.geometry.location, mapa);
        })

        //inicializa o localizador geográfico
        geocoder = new google.maps.Geocoder();

        //inicializa o marcador de limite usado no mapa para ampliar
        bounds = new google.maps.LatLngBounds();

        //inicializa o serviço Matrix de distância
        service = new google.maps.DistanceMatrixService();

        document.getElementById("initButton").addEventListener("click", () => {
            calcuRotasMapa(places, listMarcadores, directionsService, directionsRenderer);
        });
    } catch (error) {
        window.alert("Erro ao inicializar o mapa:" + error.message);
    }
}

// adiciona um marcador à lista de marcadores do mapa
function addMarcador(location, mapa) {
    marker = new google.maps.Marker({
        position: location,
        map: mapa,
        draggable: true
    });
    return listMarcadores.push(marker) - 1;
}

// Define o mapa em todos os marcadores do array.
// function setMapaPontos(mapa) {
//     for (let i = 0; i < listMarcadores.length; i++) {
//         listMarcadores[i].setMap(mapa);
//     }
// }

// // Remove os marcadores do mapa, mas os mantém na array.
// function ocultaMarcadores() {
//     setMapaPontos(null);
// }

// // Exclua todos os marcadores do array removendo referências a eles.
// function deletarMarcadores() {
//     ocultaMarcadores();
//     listMarcadores = [];
// }

function posicaoGeocode(posicao, mapa, geocoder) {
    geocoder.geocode({ 'location': posicao }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                const pos = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
                const endereco = results[0].formatted_address;
                const textEndereco = document.getElementById("textEndereco");
                if (textEndereco) {
                    textEndereco.value = endereco;
                } else {
                    console.error('Elemento com ID "textEndereco" não encontrado.');
                }
                places.push(pos);
                addMarcador(pos, mapa);
            } else {
                window.alert("Nenhum resultado encontrado.");
            }
        } else {
            window.alert("Geocode falhou devido a: " + status);
        }
    });
}

function calcuRotasMapa(arrayPlaces, markerArray, directionsService, directionsRenderer) {
    const waypts = [];
    var origem;
    var destino;

    for (let i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    if (arrayPlaces.length === 2) {
        origem = arrayPlaces[0];
        destino = arrayPlaces[1];
    } else {
        origem = arrayPlaces[0];
        destino = arrayPlaces[0];

        for (let j = 0; j < arrayPlaces.length; j++) {
            if (j >= 1) {
                waypts.push({
                    location: arrayPlaces[j],
                    stopover: true
                });
            }
        }

    }

    const request = {
        origin: origem,
        destination: destino,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function (result, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
        }
    })
}

//it reads all the markers and zooms so that all the narcs appear
function fitMap() {
    bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < listMarcadores.length; i++) {
        if (listMarcadores[i].getMap() != null) {
            bounds.extend(listMarcadores[i].getPosition());
        }
    }
    mapa.fitBounds(bounds);
}


function sleep(milliseconds) {
    var start = new Date().getTime();
    while (true) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

$(document).ready(function () {
    var count = 0;
    var $idMap = $("#mapa");
    var $idInput = $("#textEndereco");
    initMapa($idMap[0], $idInput[0]);

    //carrega o marcador de endereço definido após clicar no botão
    $("#btnEndereco").click(function () {
        const endereco = $("#textEndereco").val().trim();
        if (endereco != "") {
            const origens = $("#origens");  // Seleciona o textarea

            // Adiciona o endereço com a identificação de origem ou numeração
            if (count === 0) {
                origens.val(origens.val() + `ORIGEM: ${endereco}`);
            } else {
                origens.val(origens.val() + "\n" + `PONTO ${count}: ${endereco}`);
            }

            count++;  // Incrementa o contador
            $("#textEndereco").val('');  // Limpa o input
        }
    });

    $("#btnMatriz").click(function () {
        const idMatriz = $("#displayMatriz");
        if (idMatriz.css("display") === "none") {
            idMatriz.css("display", "block");
        } else {
            idMatriz.css("display", "none");
        }
    });

    //envento de click para posicionar marcador temporário
    google.maps.event.addListener(mapa, 'click', function (event) {
        //marker.setPosition(event.latLng);
        //marker.setVisible(true);
        mapa.setCenter(event.latLng);
        posicaoGeocode(event.latLng, mapa, geocoder);
    });

    //evento de arraste do marcador temporário
    google.maps.event.addListener(marker, 'drag', function () {
        geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
            if (status == "OK") {
                if (results[0]) {
                    $('#textEndereco').val(results[0].formatted_address);
                }
            }
        });
    });

    // //auto complete em endereço digitado
    // $("#textEndereco").autocomplete({
    // 	source: function (request, response) {
    // 		geocoder.geocode({ 'address': request.term + ', Brazil', 'region': 'BR' }, function (results, status) {
    // 			response($.map(results, function (item) {
    // 				return {
    // 					label: item.formatted_address,
    // 					value: item.formatted_address,
    // 					latitude: item.geometry.location.lat(),
    // 					longitude: item.geometry.location.lng()
    // 				}
    // 			}));
    // 		});
    // 	},
    // 	select: function (event, ui) {
    // 		var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
    // 		marker.setPosition(location);
    // 		mapa.setCenter(location);
    // 		mapa.setZoom(15);
    // 	}
    // });

    $("form").submit(function (event) {
        event.preventDefault();
    });
});