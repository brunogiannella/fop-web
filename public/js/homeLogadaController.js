// Controllers

var homeLogadaControllers = angular.module('homeLogadaControllers', []);

homeLogadaControllers.controller('ConsultaOfertaController', [ '$scope', '$rootScope', '$http', '$location',
    function($scope, $rootScope, $http, $location, $timeout) {
		$scope.consultarOfertas = function(idUsuario){
			
			var token = $rootScope.sessao.token;
			
			var servico = 'http://localhost:3000/faleopreco-secure/ofertas/listarOfertas?token=' + token;

			var params = {consulta_ofertas: {id_usuario: idUsuario}};

			$http.post(servico, params)

        		.success(function(data) {
        			$scope.ofertas = data;
        		})
        		
        		.error(function(data) {
					$scope.statusOferta = "ERR";
        		});					
		} 

		$scope.ordenar = function (ordenacao){
			$scope.ordenacao = ordenacao;									
		}

		$scope.consultarOfertas($scope.sessao.email);

		executeDocumentReady();

	}
]);
