/* Script que contém funções importantes para o funcionamento do projeto
   componentes.js
*/

export function getLocalizacao() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                position => resolve(sucesso(position)),
                error => reject(erros(error)),
                opcao
            );
        } else {
            alert("A geolocalização não é suportada por este navegador.");
            reject(new Error("Geolocalização não suportada"));
        }
    });
}

function sucesso(position) {
    var vetPos = [];

    vetPos['latitude'] = position.coords.latitude;
    vetPos['longitude'] = position.coords.longitude;

    return vetPos;
}

function erros(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            window.alert("O usuário negou a solicitação de geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            window.alert("As informações de localização não estão disponíveis.");
            break;
        case error.TIMEOUT:
            window.alert("A solicitação para obter a localização do usuário expirou.");
            break;
        case error.UNKNOWN_ERROR:
            window.alert("Ocorreu um erro desconhecido.");
            break;
        default:
            window.alert("Error ");
            break;
    }

    return error;
}

var opcao = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
};

export function estiloMapa(tipoMapa) {
    var estilos = ['roadmap', 'satellite', 'hybrid', 'terrain'];

    for (let i = 0; i < estilos.length; i++) {
        if (estilos[i] === tipoMapa) {
            var elementoTipo = estilos[i];
        }
    }

    return elementoTipo;
}