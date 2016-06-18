
// Main application with dependencies
var faleoprecoApp = angular.module('faleoprecoApp', [ 'ngRoute', 'faleoprecoControllers', 'usuarioControllers', 'homeLogadaControllers', 'faleoprecoServices', 'ui.bootstrap' ]);

// Configure routes for the different views
faleoprecoApp.config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    
    $routeProvider
        .when('/', {
            templateUrl : 'partials/hotel-search.html',
            controller : 'HotelSearchController'
        })

        .when('/hotel-region', {
            templateUrl : 'partials/hotel-region.html',
            controller : 'HotelRegionController'
        })

        .when('/hotel-list', {
            templateUrl : 'partials/hotel-list-view.html',
            controller : 'HotelListViewController'
        })

        .when('/hotel-booking', {
            templateUrl : 'partials/hotel-booking.html',
            controller : 'HotelBookingController'
        })

        .when('/hotel-efetiva', {
            templateUrl : 'partials/hotel-thankyou.html',
            controller : 'HotelEfetivaController'
        })

        .when('/quem-somos', {
            templateUrl : 'partials/about-us.html',
        })

        .when('/mapa-site', {
            templateUrl : 'partials/sitemap.html',
        })

        //area logada
        .when('/logado/home', {
            templateUrl : 'partials/home-logada.html',
        })

        .otherwise({
            redirectTo : '/'
        });
    }     
]);


//custom filters
faleoprecoApp.filter('getMonthName', function($filter){
    return function (input, opcaoAbreviado){
        var meses = [];
        var mes = $filter('date')(input,'MM');

        if (opcaoAbreviado){
            meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        } else {
            meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        }
        return meses[mes-1];
    }
});

faleoprecoApp.filter('getDayOfWeek', function($filter){
    return function (input, opcaoAbreviado){
            var dia = $filter('date')(input,'EEE');
            var diaSemana ='';
            
            switch (dia){
                case 'Sun': 
                    diaSemana = 'Domingo';
                    break;
                case 'Mon': 
                    diaSemana = 'Segunda-feira';
                    break;
                case 'Tue': 
                    diaSemana = 'Terça-feira';
                    break;
                case 'Wed': 
                    diaSemana = 'Quarta-feira';
                    break;
                case 'Thu': 
                    diaSemana = 'Quinta-feira';
                    break;
                case 'Fri': 
                    diaSemana = 'Sexta-feira';
                    break;
                case 'Sat': 
                    diaSemana = 'Sábado';
                    break;
            }

        if (opcaoAbreviado){
            diaSemana = diaSemana.substr(0,3);
        }

        return diaSemana;
    }
});
