// Controllers

var usuarioControllers = angular.module('usuarioControllers', []);

usuarioControllers.controller('LoginController', [ '$scope', '$rootScope', '$http', '$location',
    function($scope, $rootScope, $http, $location) {
		$scope.loginUsuario = function(login){
			
			var servico = 'http://localhost:3000/faleopreco-api/authenticate';
			$http.post(servico, login)

        		.success(function(data) {
        			$rootScope.sessao.statusLogin = "OK";
					$rootScope.sessao.token = data.token;
					$rootScope.sessao.hashIdentificadorUsuario = data.hashIdentificadorUsuario;
					$rootScope.sessao.email = data.email;
					$rootScope.sessao.nome = data.nome;
					$rootScope.sessao.sobrenome = data.sobrenome;
					$rootScope.sessao.logado = true;
					tjq("#soap-popupbox").hide();
					$scope.carregaHomeLogada();
        		})
        		
        		.error(function(data) {
					// Se ocorrer algum erro
					$rootScope.sessao.statusLogin = "ERR";
					$rootScope.sessao.mensagemErro = data.message;
					$rootScope.sessao.logado = false;
        		});		
		} 

		$scope.cadastrarUsuario = function(usuario){
			
			var dados = {usuario: ""};
			dados.usuario = usuario;

			var servico = 'http://localhost:3000/faleopreco-api/usuarios';
			$http.post(servico, dados)

        		.success(function(data) {
					$scope.statusCadastro = "OK";     
        		})
        		
        		.error(function(data) {
					// Se ocorrer algum erro
					$scope.statusCadastro = "ERR";
        		});		
		} 

		$scope.submitForm = function(){
			angular.forEach($scope.frmCadastro.$error.required, function(field) {
   		 		field.$setDirty();
			});
		}

		$scope.submitFormLogin = function(){
			angular.forEach($scope.frmLogin.$error.required, function(field) {
   		 		field.$setDirty();
			});
		}

		$scope.initCadastro = function(){
			$scope.statusCadastro = "";			
		}

		$scope.carregaHomeLogada = function(){
			$location.path('/logado/home');
		}

		$scope.setOpcaoHome = function (opcaoHome){
			$rootScope.opcaoHome = opcaoHome;
		}

		$rootScope.sessao = {
			statusLogin: '', 
			token: '', 
			hashIdentificadorUsuario: '', 
			email: '', 
			nome: '', 
			sobrenome: '', 
			logado:false
		};

		$scope.initCadastro();
		$scope.setOpcaoHome('hoteis');
	}
]);
