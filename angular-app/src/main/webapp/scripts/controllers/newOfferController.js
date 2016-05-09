
angular.module('myapp').controller('NewOfferController', function ($scope, $location, locationParser, flash, OfferResource ) {
    $scope.disabled = false;
    $scope.$location = $location;
    $scope.offer = $scope.offer || {};
    

    $scope.save = function() {
        var successCallback = function(data,responseHeaders){
            var id = locationParser(responseHeaders);
            flash.setMessage({'type':'success','text':'The offer was created successfully.'});
            $location.path('/Offers');
        };
        var errorCallback = function(response) {
            if(response && response.data && response.data.message) {
                flash.setMessage({'type': 'error', 'text': response.data.message}, true);
            } else {
                flash.setMessage({'type': 'error', 'text': 'Something broke. Retry, or cancel and start afresh.'}, true);
            }
        };
        OfferResource.save($scope.offer, successCallback, errorCallback);
    };
    
    $scope.cancel = function() {
        $location.path("/Offers");
    };
});