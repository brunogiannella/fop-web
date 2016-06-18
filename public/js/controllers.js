// Controllers
var faleoprecoControllers = angular.module('faleoprecoControllers', []);

// Controller para busca de hoteis na home
faleoprecoControllers.controller('HotelSearchController', [ '$scope', '$rootScope', '$location', '$http', '$timeout',
    function($scope, $rootScope, $location, $http, $timeout) {
		$scope.pesquisaHotel = function(oferta) {
			$rootScope.oferta = oferta;
			$location.path('/hotel-region');
		}

		$scope.pesquisaDestinos = function(){
			
			var servico = 'http://localhost:3000/faleopreco-api/hoteis/destinosHoteis';
			$http.get(servico)

        		.success(function(data) {
					// JSON retornado do banco
					$scope.destinos = data.destinos;     
        		})
        		
        		.error(function(data) {
					// Se deu algum erro, mostro no log do console
					console.log("Ocorreu um erro no banco de dados");
        		});		
		} 

		$scope.setOpcaoHome = function (opcaoHome){
			$rootScope.opcaoHome = opcaoHome;
		}
		
		executeDocumentReady();

     	$rootScope.oferta = undefined;

		$scope.pesquisaDestinos();

	}
]);

// Controller para escolha de hoteis por regiao
faleoprecoControllers.controller('HotelRegionController', [ '$scope', '$rootScope', '$location', '$http', '$timeout',
    function($scope, $rootScope, $location, $http, $timeout) {
 		
		$scope.getRegioes = function(cidade){
			
			var servico = 'http://localhost:3000/faleopreco-api/hoteis/regioes/' + cidade;
			$http.get(servico)

        		.success(function(data) {
					// JSON retornado do banco
					$scope.regioes = data.regioes;     
        		})
        		
        		.error(function(data) {
					// Se deu algum erro, mostro no log do console
					console.log("Ocorreu um erro no banco de dados");
        		});		
		} 

		$scope.listaHoteis = function (oferta){
			$rootScope.oferta = oferta;
			$rootScope.oferta.classificacao = tjq('#rating').slider("value") / 10;
			$location.path('/hotel-list');	
		}

		var cidadeSelecionada = $rootScope.oferta.destino;
		$scope.getRegioes(cidadeSelecionada);

		$scope.$on('$viewContentLoaded', function (event){
			$timeout(function(){
				executeDocumentReady();
			}, 100);
		});
    } 
]);

// Controller para lista de hoteis
faleoprecoControllers.controller('HotelListViewController', [ '$scope', '$rootScope', '$location', '$http', '$timeout', 
    function($scope, $rootScope, $location, $http, $timeout) {
    	$scope.confirmaOferta = function (oferta){
			$rootScope.oferta = oferta;
			$rootScope.oferta.hoteis = $scope.hoteis;
			$location.path('/hotel-booking');	
		}

		$scope.$on('$viewContentLoaded', function (event){
			$timeout(function(){
				executeDocumentReady();
			}, 100);
		});

		$scope.listarHoteisRegiao = function(oferta)
		{
			var servico = 'http://localhost:3000/faleopreco-api/hoteis/regiao/';

			var preco = (oferta.preco == undefined ? 0 : oferta.preco);
			var classificacao = oferta.classificacao;
			var regioesSelecionadas = [];

			angular.forEach(oferta.regiao, function (key, value){
				if (key){
					regioesSelecionadas.push(value);
				}
			});

			var dados = {requestHoteisRegiao:{
				regioes: "",
				"classificacao": classificacao,
				"preco": preco
			}};

			dados.requestHoteisRegiao.regioes = regioesSelecionadas;

			$http.post(servico, dados)

        		.success(function(data) {
					// JSON retornado do banco
					$scope.hoteis = data.hoteis;     
        		})
        		
        		.error(function(data) {
					// Se deu algum erro, mostro no log do console
					console.log("Ocorreu um erro no banco de dados");
        		});			
		}
	
 		$scope.removeItem = function(index){
    		$scope.hoteis.splice(index, 1);
  		}

		$scope.listarHoteisRegiao($rootScope.oferta);
    } 
]);

// Controller para confirmacao da oferta
faleoprecoControllers.controller('HotelBookingController', [ '$scope', '$rootScope',  '$location', '$http', '$timeout',
    function($scope, $rootScope,  $location, $http, $timeout) {
    	$scope.efetivaOferta = function (oferta){
    		oferta.pagamento.finalCartao = oferta.pagamento.codigo_cartao.substr(oferta.pagamento.codigo_cartao.length - 4);
			$rootScope.oferta = oferta;
			$location.path('/hotel-efetiva');	
		}

		$scope.converteData = function (strData){
			var parts = strData.split("/");
			return new Date(parts[2], parts[1] - 1, parts[0]);
		}

		$scope.calculaDiasEstadia = function (dataEntrada, dataSaida){
			var dtEnt = $scope.converteData(dataEntrada);
			var dtSai = $scope.converteData(dataSaida);
			var result = (dtSai - dtEnt) /1000/60/60/24;
			return result;
		}

		$scope.geraListaAnosCartao = function (){
			var ano = new Date().getFullYear();
			var numAnos  = 15;
			var listaAnos = [];
			for (i=0;i<numAnos;i++){
				listaAnos.push(ano);
				ano++;
			}						
			$scope.listaAnosCartao = listaAnos;
		}

		$scope.inicializa = function(){
			$scope.oferta.moeda = "R$";
			$scope.oferta.horaEntrada = "11hs";
			$scope.oferta.horaSaida = "14hs";

			var diasEstadia = $scope.calculaDiasEstadia($scope.oferta.dataEntrada, $scope.oferta.dataSaida);

			$scope.oferta.diasEstadia = diasEstadia + (diasEstadia > 1 ? ' NOITES' : ' NOITE');

			$scope.oferta.quantidadeQuartos = $scope.oferta.quartos  + ($scope.oferta.quartos > 1 ? ' QUARTOS' : ' QUARTO');

			var qtdePessoas = parseInt($scope.oferta.adultos) + parseInt($scope.oferta.criancas);
			$scope.oferta.quantidadePessoas = qtdePessoas + (qtdePessoas > 1 ? ' PESSOAS' : ' PESSOA');

			$scope.geraListaAnosCartao();

			$scope.$on('$viewContentLoaded', function (event){
				$timeout(function(){
					executeDocumentReady();
				}, 100);
			});
		}

		$scope.inicializa();
    } 
]);

// Controller para efetivacao da oferta
faleoprecoControllers.controller('HotelEfetivaController', [ '$scope', '$rootScope', '$http', '$timeout',
    function($scope, $rootScope, $http, $timeout) {
    	$scope.efetivarOferta = function (oferta){
    		var dados = {oferta:{
				dados_pessoais_usuario: "",
				informacoes_pagamento: "",
				hoteis: []
			}};

			dados.oferta.quantidade_quartos = oferta.quartos;
			dados.oferta.quantidade_adultos = oferta.adultos;
			dados.oferta.quantidade_criancas = oferta.criancas;
			dados.oferta.valor = oferta.preco;
			dados.oferta.data_inicio = oferta.dataEntrada;
			dados.oferta.data_fim = oferta.dataSaida;
			dados.oferta.dados_pessoais_usuario = oferta.usuario;
			dados.oferta.informacoes_pagamento = oferta.pagamento;

			var hotelSelecionado = {hash_identificador: "", nome: ""};

			angular.forEach(oferta.hoteis, function(hotel){
				hotelSelecionado.hash_identificador = hotel.hash_identificador;
				hotelSelecionado.nome = hotel.nome;
				dados.oferta.hoteis.push(hotelSelecionado);
			});

			var servico = 'http://localhost:3000/faleopreco-api/ofertas/enviarOferta';

			$http.post(servico, dados)

        		.success(function(data) {
					$scope.oferta.numeroOferta = data.id_oferta;     
        		})
        		
        		.error(function(data) {
					// Se deu algum erro, mostro no log do console
					console.log("Ocorreu um erro no banco de dados");
        		});		
    	}

		$scope.$on('$viewContentLoaded', function (event){
			$timeout(function(){
				executeDocumentReady();
			}, 100);
		});

		$scope.efetivarOferta($rootScope.oferta);
    } 
]);
