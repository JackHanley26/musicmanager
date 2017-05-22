(function () {
  'use strict';


  var ApiService = function ($rootScope, $http, $q, $timeout, $log, $window, backoffService) {
    var hardTimeout = 15 * 1000;

    //client can provide the full url
    var URL = "";

    var that = this;
    this._cancelAllCancellables = $q.defer();

    var service = {
      cancelAllCancellables: cancelAllCancellables,
      get: get,
      put: put,
      post: post,
      delete: del
    };
    return service;

    /**
     * @description
     * Cancel all requests that should allowed to be cancelled
     */
    function cancelAllCancellables() {
      that._cancelAllCancellables.resolve();
      that._cancelAllCancellables = $q.defer(); // new one for next calls
    }

    /**
     * @func apiRequest
     * @memberof ApiService
     * @description
     * Creates a request to the API, and handles certain error conditions, such as being
     * rate-limited.
     *
     * @param {String} url The URL of the API to request
     * @param {String} method The method type of the http request [GET, PUT, DELETE, POST]
     * @param {Object=} options Any options that the request needs, like data or extra headers
     * @returns {deferred.promise|{then, always}}
     */
    function apiRequest(url, method, options) {
      var deferred = $q.defer();

      var httpOptions = {
        url: URL + url,
        method: method,
        headers: {}
      };

      // Set this for easy differentiation between UI and API

      // If the Request in cancellable (good for requests that need to die if there is a page
      // change, then give it a timeout
      if (options && options.cancellable) {
        angular.extend(httpOptions, {
          timeout: that._cancelAllCancellables.promise
        });
      }
      if (options && options.headers) {
        httpOptions.headers = options.headers;
      }
//      if (TokenService.getToken()) {
//        httpOptions.headers.Authorization = 'Bearer ' + TokenService.getToken();
//      }
//      httpOptions.headers["x-ui"] = "XFE";

      // If we need a certain response type
      if (options && options.responseType) {
        httpOptions.responseType = options.responseType;
      }
      // If this is a POST or PUT request, it probably needs to send data with it
      if (options && options.data) {
        httpOptions.data = options.data;
      }

      // If this is a GET request, it probably needs to send params with it
      if (options && options.params) {
        httpOptions.params = options.params;
      }

      // If this is a GET request, it probably needs to send query with it
      if (options && options.query) {
        httpOptions.query = options.query;
      }

      // Initialize the backoff counter at 1 (this is the first request
      var counter = 1;

      var backoff = new backoffService.Backoff({
        min: 500, // Number of milliseconds minimum before we try the request again
        max: 20000 // If we backoff all the way to 20 seconds, we should probably stop trying
      });

      var httpRequest = function () {
        $http(httpOptions)
          .then(function (response) { // Response returned with HTTP 200 or 304
            deferred.resolve(response);
          }, function (response) {
            // If we get a 429 status code, meaning that we saw a rate-limited response,
            // then retry the request after the next backoff interval
            if (response.status === 429) {
              counter++;
              $timeout(function () {
                httpRequest();
              }, backoff.duration());
            } else {
              if (response.status === 401) {
                if (response.data && response.data.error !== 'Not authorized.' && options && options.hasOwnProperty('needsAuthorization')) {
                  // try to refresh the token
                  TokenService.removeToken();
                  TokenService.obtainAnonToken().then(deferred.resolve, deferred.reject);
                  return deferred.promise.then(function () {
                    return httpRequest();
                  });
                }
                else {
                  if (response.data && response.data.error) {
                    return deferred.reject(response.data.error);
                  } else {
                    return deferred.reject();
                  }
                }
              }
              // Otherwise we have no idea what the problem is
              else if (response.data && response.data.error) {
                return deferred.reject(response.data.error);
              } else {
                return deferred.reject();
              }
            }
          });
      };
      httpRequest();

      if (options && options.timeout) {
        hardTimeout = options.timeout;
      }

      $timeout(function () {
        deferred.reject("timeout");
      }, hardTimeout);

      return deferred.promise;
    }

    /**
     * @func get
     * @memberof ApiService
     * @description
     * Make a GET request to the API
     * @param url URL of the API call to make
     * @param options Options for the call, such as whether this request is cancellable
     * @returns {deferred.promise|{then, always}}
     */
    function get(url, options) {
      return apiRequest(url, 'GET', options);
    }

    /**
     * @func put
     * @memberof ApiService
     * @description
     * Make a PUT request to the API
     * @param url URL of the API call to make
     * @param data Data to send in the PUT request
     * @returns {deferred.promise|{then, always}}
     */
    function put(url, data) {
      if (data) {
        return apiRequest(url, 'PUT', {
          data: data
        });
      }
      else {
        return apiRequest(url, 'PUT');
      }
    }

    /**
     * @func post
     * @memberof ApiService
     * @description
     * Make a POST request to the API
     * @param url URL of the API call to make
     * @param data Data to send in the POST request
     * @returns {deferred.promise|{then, always}}
     */
    function post(url, data) {
      if (data) {
        return apiRequest(url, 'POST', {
          data: data
        });
      }
      else {
        return apiRequest(url, 'POST');
      }
    }

    /**
     * @func delete
     * @memberof ApiService
     * @description
     * Make a DELETE request to the API
     * @param url URL of the API call to make
     * @param url URL of the API call to make
     * @returns {deferred.promise|{then, always}}
     */
    function del(url, data, headers) {
      if (data) {
        var body = {};
        body.data = data;
        if (headers) {
          body.headers = headers;
        }

        return apiRequest(url, 'DELETE', body);
      } else {
        return apiRequest(url, 'DELETE');
      }
    }

  };

  angular.module('myapp')
    .service('ApiService', ApiService);

  ApiService.$inject = ['$rootScope', '$http', '$q', '$timeout', '$log', '$window', 'backoffService'];

})();
