angular.module('myapp').factory('OfferResource', function($resource){
    var resource = $resource('http://localhost:9080/rest/offers/:OfferId',{OfferId:'@id'},{'queryAll':{method:'GET',isArray:true},'query':{method:'GET',isArray:false},'update':{method:'PUT'}});
    return resource;
});